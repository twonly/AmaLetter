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
  meta?: unknown;
}

function safeString(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
}

function buildMeta(req: Request, clientMeta: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  // 客户端注入(WriteClient 收集的 referrer / utm / ua_class)
  if (clientMeta && typeof clientMeta === 'object') {
    const m = clientMeta as Record<string, unknown>;
    const ref = safeString(m.ref, 200);
    if (ref) out.ref = ref;
    const uaClass = safeString(m.ua_class, 40);
    if (uaClass) out.ua_class = uaClass;
    if (m.utm && typeof m.utm === 'object') {
      const utm: Record<string, string> = {};
      for (const [k, v] of Object.entries(m.utm as Record<string, unknown>)) {
        const val = safeString(v, 50);
        if (val) utm[k.slice(0, 20)] = val;
      }
      if (Object.keys(utm).length > 0) out.utm = utm;
    }
  }
  // 服务端兜底:Vercel geo + request referer
  const h = req.headers;
  const country = h.get('x-vercel-ip-country');
  if (country) out.country = country.slice(0, 4);
  const region = h.get('x-vercel-ip-country-region');
  if (region) out.region = region.slice(0, 8);
  if (!out.ref) {
    const serverRef = h.get('referer');
    if (serverRef) out.ref = serverRef.slice(0, 200);
  }
  return out;
}

function splitBodyAndSignature(letter: string): { body: string; signature: string } {
  // 先过滤掉空行,按非空行处理(模型在抬头/正文/落款之间放不放空行不稳定)
  const lines = letter
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return { body: '', signature: '' };
  if (lines.length === 1) return { body: lines[0], signature: '' };

  const last = lines[lines.length - 1];
  // 落款特征:① 以关系字开头 + 空格/全角空格 + 名字 ② 结尾含敬辞 ③ 含古历日期
  const SIG_HEAD = /^(夫|儿|孙|弟|男|妹|姐|兄|愚|侄|甥)[\s　]/;
  const SIG_TAIL = /(顿首|手书|拜上|敬上|拜启|手启|敬启|谨上|某月)$/;
  const SIG_DATE = /(民国|农历|公元)?(廿|初|某|[一二三四五六七八九十百千]|\d){1,3}年?[一二三四五六七八九十春夏秋冬]+月[初廿一二三四五六七八九十\d]+(日)?$/;
  const looksLikeSig =
    last.length <= 30 &&
    (SIG_HEAD.test(last) || SIG_TAIL.test(last) || SIG_DATE.test(last));

  if (looksLikeSig) {
    return {
      body: lines.slice(0, -1).join('\n').trim(),
      signature: last,
    };
  }
  // 落款没识别出来:整段当 body,signature 空
  return { body: lines.join('\n'), signature: '' };
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
  let lastErr: unknown = null;
  // 推理模型 reasoning tokens 不可控,空内容自动重试一次再放弃
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      raw = await chat({
        messages: [{ role: 'user', content: prompt }],
        // no-think 模式下,reasoning 不消耗 tokens,1500 足够 60-160 字侨批
        maxTokens: 1500,
        temperature: attempt === 1 ? 0.65 : 0.5,
        timeoutMs: 25_000,
      });
    } catch (err) {
      lastErr = err;
      console.error(`generate attempt ${attempt} threw`, err);
      raw = '';
    }
    if (raw && raw.length >= 20) break;
    console.warn(`generate attempt ${attempt} empty/short content, len=${raw.length}`);
  }

  if (!raw || raw.length < 20) {
    console.error('generate gave up after retries', { lastErr, len: raw.length });
    // 关键:返 200,避免 Cloudflare 把 5xx body 替换成纯文本错误页
    return NextResponse.json({
      success: false,
      blocked: true,
      blockReason: '先生今日笔墨不顺,稍后再试一次。',
    });
  }

  try {
    const verdict = await chat({
      messages: [{ role: 'user', content: buildModerationPrompt(raw) }],
      maxTokens: 200,
      temperature: 0,
      timeoutMs: 8_000,
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
  const meta = buildMeta(req, payload.meta);
  await saveLetter({ id, style, body, signature, remittanceAmount, userInput, meta });

  return NextResponse.json({
    success: true,
    id,
    letter: body,
    signature,
    remittanceAmount,
  });
}
