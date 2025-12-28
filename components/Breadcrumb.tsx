'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const LABELS: Record<string, string> = {
  '': 'Home',
  about: 'About',
  learn: 'Learn',
  faq: 'FAQ',
  songs: 'Song Translator',
  contribute: 'Contribute',
};

function segmentToLabel(segment: string) {
  return LABELS[segment] ?? segment.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();

  const segments = React.useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    return parts;
  }, [pathname]);

  const crumbs = React.useMemo(() => {
    const items: Array<{ href: string; label: string }> = [{ href: '/', label: 'Home' }];
    let href = '';
    for (const seg of segments) {
      href += `/${seg}`;
      items.push({ href, label: segmentToLabel(seg) });
    }
    return items;
  }, [segments]);

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((c, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {idx !== 0 && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
              {isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {c.label}
                </span>
              ) : (
                <Link
                  href={c.href}
                  className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
