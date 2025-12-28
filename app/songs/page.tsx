import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageSkeleton } from '@/components/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Song Translator',
  description: 'Translate and explore Garhwali songs with line-by-line translations to Hindi and English.',
};

const SongTranslator = dynamic(
  () => import('@/components/SongTranslator').then((m) => m.SongTranslator),
  {
    ssr: false,
    loading: () => <PageSkeleton />,
  }
);

export default function SongsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SongTranslator />
    </div>
  );
}
