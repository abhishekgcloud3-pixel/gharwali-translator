'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          We couldn’t load this page. Try again, or go back home.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
