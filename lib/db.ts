import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { packRemittanceSignature, unpackRemittanceSignature } from './remittance';
import type { StyleKey } from './styles';

const ALPHABET = '23456789abcdefghjkmnpqrstuvwxyz';

export function newLetterId(): string {
  let out = '';
  for (let i = 0; i < 8; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

let cached: SupabaseClient | null = null;
let cacheKey: string | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const k = `${url}::${key.slice(0, 8)}`;
  if (cached && cacheKey === k) return cached;
  cached = createClient(url, key, {
    auth: { persistSession: false },
  });
  cacheKey = k;
  return cached;
}

export interface StoredLetter {
  id: string;
  style: StyleKey;
  body: string;
  signature: string;
  remittanceAmount?: number | null;
  userInput?: string | null;
  meta?: Record<string, unknown> | null;
}

export async function saveLetter(letter: StoredLetter): Promise<boolean> {
  const db = getSupabase();
  if (!db) return false;
  const row: Record<string, unknown> = {
    id: letter.id,
    style: letter.style,
    body: letter.body,
    signature: packRemittanceSignature(letter.signature, letter.remittanceAmount),
  };
  if (letter.userInput) row.user_input = letter.userInput.slice(0, 2000);
  if (letter.meta && Object.keys(letter.meta).length > 0) row.meta = letter.meta;
  const { error } = await db.from('letters').insert(row);
  if (error) {
    // 若 user_input / meta 列还没建出来,降级到原最小集再试一次,不影响主流程
    if (/column .*(user_input|meta)/i.test(error.message)) {
      console.warn('letters table missing user_input/meta columns, falling back', error.message);
      const fallback = await db.from('letters').insert({
        id: row.id,
        style: row.style,
        body: row.body,
        signature: row.signature,
      });
      if (fallback.error) {
        console.warn('supabase fallback insert failed', fallback.error.message);
        return false;
      }
      return true;
    }
    console.warn('supabase insert failed', error.message);
    return false;
  }
  return true;
}

export async function readLetter(id: string): Promise<StoredLetter | null> {
  const db = getSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from('letters')
    .select('id, style, body, signature')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  const letter = data as StoredLetter;
  const unpacked = unpackRemittanceSignature(letter.signature);
  return {
    ...letter,
    signature: unpacked.signature,
    remittanceAmount: unpacked.remittanceAmount,
  };
}
