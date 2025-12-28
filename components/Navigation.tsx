'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { title: 'Home', href: ROUTES.home },
  { title: 'Song Translator', href: ROUTES.songs },
  { title: 'Learn', href: ROUTES.learn },
  { title: 'About', href: ROUTES.about },
  { title: 'FAQ', href: ROUTES.faq },
  { title: 'Contribute', href: ROUTES.contribute },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'inline-flex h-11 items-center rounded-md px-3 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              isActive
                ? 'text-primary bg-accent/10'
                : 'text-muted-foreground hover:text-primary hover:bg-accent/10'
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
