import { LetterClient } from './LetterClient';

export const dynamic = 'force-dynamic';

export default function LetterPage({ params }: { params: { id: string } }) {
  return <LetterClient id={params.id} />;
}
