'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { title: 'Home', href: ROUTES.home },
  { title: 'Song Translator', href: ROUTES.songs },
  { title: 'Learn', href: '/learn' },
  { title: 'About', href: ROUTES.about },
  { title: 'FAQ', href: '/faq' },
  { title: 'Contribute', href: '/contribute' },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = React.useRef<HTMLAnchorElement | null>(null);
  const lastLinkRef = React.useRef<HTMLAnchorElement | null>(null);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = 'unset';
      prev?.focus?.();
    };
  }, [isOpen]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (e.key !== 'Tab') return;

    const first = firstLinkRef.current;
    const last = lastLinkRef.current;
    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="md:hidden">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="fixed top-16 left-0 right-0 z-50 h-[calc(100vh-4rem)] overflow-y-auto bg-background border-b"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            onKeyDown={onMenuKeyDown}
          >
            <nav className="container grid gap-2 p-4" aria-label="Mobile navigation">
              {navItems.map((item, idx) => {
                const isLast = idx === navItems.length - 1;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    ref={(el) => {
                      if (idx === 0) firstLinkRef.current = el;
                      if (isLast) lastLinkRef.current = el;
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center text-lg font-medium transition-colors p-3 rounded-md',
                      'hover:text-primary hover:bg-accent/10',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      isActive ? 'text-primary bg-accent/5' : 'text-muted-foreground'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
