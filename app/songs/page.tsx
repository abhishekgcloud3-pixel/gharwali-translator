import type { Metadata } from 'next';
import { SongTranslator } from '@/components/SongTranslator';

export const metadata: Metadata = {
  title: 'Song Translator'
};

export default function SongsPage() {
  return <SongTranslator />;
}
