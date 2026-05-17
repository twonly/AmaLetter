import { NextResponse } from 'next/server';
import { newLetterId, saveLetter } from '@/lib/db';
import { chat } from '@/lib/llm';
import {
  buildLetterPrompt,
  buildModerationPrompt,
  detectSelfHarm,
  SELF_HARM_REPLY,
} from '@/lib/prompts';
import { normalizeRemittanceAmount } from '@/lib/remittance';
import { isStyleKey } from '@/lib/styles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface GenerateBody {
  style?: unknown;
  userInput?: unknown;
  withMoney?: unknown;
  remittanceAmount?: unknown;
  recipient?: unknown;
  recipientName?: unknown;
  senderName?: unknown;
}

function splitBodyAndSignature(letter: string): { body: string; signature: string } {
  const lines = letter.split(/\r?\n/).map((l) => l.trimEnd());
  while (lines.length && lines[lines.length - 1] === '') lines.pop();
  if (lines.length === 0) return { body: '', signature: '' };

  let cut = lines.length - 1;
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 4); i--) {
    if (lines[i] === '') {
      cut = i + 1;
      break;
    }
  }
  const sig = lines.slice(cut).join('\n').trim();
  const body = lines.slice(0, cut).join('\n').trim();
  if (!body) return { body: sig, signature: '' };
  return { body, signature: sig };
}

export async function POST(req: Request) {
  let payload: GenerateBody;
  try {
    payload = (await req.json()) as GenerateBody;
  } catch {
    return NextResponse.json(
      { success: false, blocked: true, blockReason: '请求格式有误,先生没看明白。' },
      { status: 400 }
    );
  }

  const style = typeof payload.style === 'string' ? payload.style : '';
  const userInput = typeof payload.userInput === 'string' ? payload.userInput.trim() : '';
  const recipient = typeof payload.recipient === 'string' ? payload.recipient.trim().slice(0, 10) : '';
  const recipientName = typeof payload.recipientName === 'string' ? payload.recipientName.trim().slice(0, 10) : '';
  const senderName = typeof payload.senderName === 'string' ? payload.senderName.trim().slice(0, 10) : '';

  if (!isStyleKey(style)) {
    return NextResponse.json(
      { success: false, blocked: true, blockReason: '风格未选,先生还在等。' },
      { status: 400 }
    );
  }
  const withMoney = style !== 'remembrance' && Boolean(payload.withMoney);
  const remittanceAmount = withMoney ? normalizeRemittanceAmount(payload.remittanceAmount) : null;
  if (!userInput || userInput.length < 4) {
    return NextResponse.json(
      { success: false, blocked: true, blockReason: '话太短了,再多说几句吧。' },
      { status: 400 }
    );
  }
  if (userInput.length > 2000) {
    return NextResponse.json(
      { success: false, blocked: true, blockReason: '话太长了,先生写不下。' },
      { status: 400 }
    );
  }

  if (detectSelfHarm(userInput)) {
    return NextResponse.json({
      success: false,
      blocked: true,
      blockReason: 'self-harm',
      letter: SELF_HARM_REPLY,
      signature: '',
    });
  }

  const prompt = buildLetterPrompt({
    style,
    userInput,
    withMoney,
    remittanceAmount,
    recipient,
    recipientName,
    senderName,
  });

  let raw = '';
  try {
    raw = await chat({
      messages: [{ role: 'user', content: prompt }],
      maxTokens: 1200,
      temperature: 0.65,
      timeoutMs: 50_000,
    });
  } catch (err) {
    console.error('generation failed', err);
    return NextResponse.json(
      { success: false, blocked: true, blockReason: '笔墨不顺,稍后再试。' },
      { status: 502 }
    );
  }

  if (!raw) {
    return NextResponse.json(
      { success: false, blocked: true, blockReason: '先生写到一半,卡住了。' },
      { status: 502 }
    );
  }

  try {
    const verdict = await chat({
      messages: [{ role: 'user', content: buildModerationPrompt(raw) }],
      maxTokens: 1200,
      temperature: 0,
      timeoutMs: 10_000,
    });
    if (verdict.toUpperCase().startsWith('BLOCK')) {
      const reason = verdict.split(/[::]/).slice(1).join(':').trim() || '内容未通过审核。';
      return NextResponse.json({
        success: false,
        blocked: true,
        blockReason: reason,
      });
    }
  } catch (err) {
    console.warn('moderation failed, allowing through with caution', err);
  }

  const { body, signature } = splitBodyAndSignature(raw);
  const id = newLetterId();

  if (!isStyleKey(style)) {
    return NextResponse.json(
      { success: false, blocked: true, blockReason: '风格丢了。' },
      { status: 500 }
    );
  }
  await saveLetter({ id, style, body, signature, remittanceAmount });

  return NextResponse.json({
    success: true,
    id,
    letter: body,
    signature,
    remittanceAmount,
  });
}
