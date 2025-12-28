import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { TranslatorSkeleton } from '@/components/LoadingSkeleton';
import { ROUTES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Translate Garhwali to Hindi and English, learn common phrases, and explore Garhwali culture from Uttarakhand.',
};

const TextTranslator = dynamic(
  () => import('@/components/TextTranslator').then((m) => m.TextTranslator),
  {
    ssr: false,
    loading: () => <TranslatorSkeleton />,
  }
);

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <section className="w-full py-10 md:py-16 lg:py-24 text-center px-4">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary font-bold tracking-tight">
            Welcome to Garhwali Seva
          </h1>
          <p className="max-w-[42rem] leading-relaxed text-muted-foreground text-base sm:text-lg md:text-xl">
            A platform dedicated to serving the Garhwali community and promoting the rich cultural heritage of Uttarakhand.
          </p>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            <Button size="lg" className="min-w-[140px]" asChild>
              <Link href={ROUTES.learn}>Start Learning</Link>
            </Button>
            <Button size="lg" variant="outline" className="min-w-[140px]" asChild>
              <Link href={ROUTES.about}>About Garhwali</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Text Translator Section */}
      <section className="w-full py-8 md:py-12">
        <TextTranslator />
      </section>

      <section className="container py-10 md:py-14 lg:py-20 px-4">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-secondary font-bold tracking-tight">
            Discover Garhwali Culture
          </h2>
          <p className="max-w-[85%] leading-relaxed text-muted-foreground sm:text-lg">
            Explore language, tradition, and the beauty of Uttarakhand.
          </p>
        </div>
        <div className="mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
          <div className="relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:border-accent/50 group">
            <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6 bg-accent/5 group-hover:bg-accent/10 transition-colors">
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-accent">Culture</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Preserving and promoting Garhwali traditions, music, and heritage.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:border-primary/50 group">
            <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6 bg-primary/5 group-hover:bg-primary/10 transition-colors">
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-primary">Community</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Connecting people worldwide who share love for Garhwali culture.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg hover:border-secondary/50 group">
            <div className="flex min-h-[180px] flex-col justify-between rounded-md p-6 bg-secondary/5 group-hover:bg-secondary/10 transition-colors">
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-secondary">Service</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dedicated support for language learners and local initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}