import { createClient, type SupabaseClient } from '@supabase/supabase-js';
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
}

export async function saveLetter(letter: StoredLetter): Promise<boolean> {
  const db = getSupabase();
  if (!db) return false;
  const { error } = await db.from('letters').insert({
    id: letter.id,
    style: letter.style,
    body: letter.body,
    signature: letter.signature,
  });
  if (error) {
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
  return data as StoredLetter;
}
