'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { title: 'Home', href: ROUTES.home },
  { title: 'Song Translator', href: ROUTES.songs },
  { title: 'Contribute', href: ROUTES.contribute },
  { title: 'About', href: ROUTES.about },
  { title: 'Services', href: ROUTES.services },
  { title: 'Contact', href: ROUTES.contact },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'transition-colors hover:text-primary',
            pathname === item.href ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
