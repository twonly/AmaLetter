import { NextResponse } from 'next/server';
import { readLetter } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = params.id?.trim();
  if (!id || !/^[a-z0-9]{4,16}$/i.test(id)) {
    return NextResponse.json({ success: false, reason: 'bad_id' }, { status: 400 });
  }
  const stored = await readLetter(id);
  if (!stored) {
    return NextResponse.json(
      { success: false, reason: 'not_found' },
      { status: 404, headers: { 'cache-control': 'no-store' } }
    );
  }
  return NextResponse.json(
    {
      success: true,
      style: stored.style,
      body: stored.body,
      signature: stored.signature,
    },
    { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } }
  );
}
