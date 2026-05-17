import { Suspense } from 'react';
import { WriteClient } from './WriteClient';

export const dynamic = 'force-dynamic';

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <WriteClient />
    </Suspense>
  );
}
