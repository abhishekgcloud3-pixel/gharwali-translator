import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-4 text-xl font-medium text-foreground">Page not found</p>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link href="/">Go to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/learn">Learn Garhwali</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
