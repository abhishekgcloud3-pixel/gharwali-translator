'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumb />
        </div>
      </div>
      <div
        key={pathname}
        className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
      >
        {children}
      </div>
    </div>
  );
}
