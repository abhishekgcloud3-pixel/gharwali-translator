import Link from 'next/link';
import Navigation from './Navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-primary text-xl">
              {SITE_CONFIG.name}
            </span>
          </Link>
        </div>
        <Navigation />
        <div className="flex items-center gap-4">
          <Button variant="default">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
