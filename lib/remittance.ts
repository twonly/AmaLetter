const DEFAULT_AMOUNT = 50;
const MAX_AMOUNT = 9999;
const META_RE = /\n?<!--qiaopi-remittance:(\d{1,4})-->\s*$/;

export function normalizeRemittanceAmount(value: unknown): number {
  const raw =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value.trim())
        : Number.NaN;

  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_AMOUNT;
  return Math.min(MAX_AMOUNT, Math.floor(raw));
}

export function packRemittanceSignature(signature: string, remittanceAmount?: number | null): string {
  if (!remittanceAmount) return signature;
  const amount = normalizeRemittanceAmount(remittanceAmount);
  const cleanSignature = signature.trim();
  const metadata = `<!--qiaopi-remittance:${amount}-->`;
  return cleanSignature ? `${cleanSignature}\n${metadata}` : metadata;
}

export function unpackRemittanceSignature(signature: string): {
  signature: string;
  remittanceAmount: number | null;
} {
  const match = signature.match(META_RE);
  if (!match) {
    return { signature, remittanceAmount: null };
  }
  return {
    signature: signature.replace(META_RE, '').trim(),
    remittanceAmount: normalizeRemittanceAmount(match[1]),
  };
}
