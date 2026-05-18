export const LETTER_MODEL = 'deepseek-v4-flash';
export const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

interface DSMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DSChoice {
  index: number;
  message: { role: string; content: string | null; reasoning_content?: string | null };
  finish_reason: string;
}

interface DSResponse {
  id: string;
  choices: DSChoice[];
  usage?: Record<string, unknown>;
}

interface ChatOptions {
  messages: DSMessage[];
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
  /** 默认 false:走 no-think。设 true 重新启用 reasoning(慢且贵,正常不用) */
  think?: boolean;
}

export async function chat({
  messages,
  maxTokens = 1500,
  temperature = 0.85,
  timeoutMs = 30_000,
  signal,
  think = false,
}: ChatOptions): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable.');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const composedSignal = signal
    ? mergeSignals(signal, controller.signal)
    : controller.signal;

  const body: Record<string, unknown> = {
    model: LETTER_MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
    stream: false,
  };
  if (!think) {
    // 关闭 reasoning,reasoning_tokens 归零,延迟降到 1/4 ~ 1/5
    body.thinking = { type: 'disabled' };
  }

  let res: Response;
  try {
    res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: composedSignal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DeepSeek API ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as DSResponse;
  const content = data.choices?.[0]?.message?.content ?? '';
  return content.trim();
}

function mergeSignals(a: AbortSignal, b: AbortSignal): AbortSignal {
  if (typeof (AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }).any === 'function') {
    return (AbortSignal as unknown as { any: (signals: AbortSignal[]) => AbortSignal }).any([a, b]);
  }
  const c = new AbortController();
  const forward = (sig: AbortSignal) => {
    if (sig.aborted) c.abort(sig.reason);
    else sig.addEventListener('abort', () => c.abort(sig.reason), { once: true });
  };
  forward(a);
  forward(b);
  return c.signal;
}
