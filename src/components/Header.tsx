'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Jobs', href: '/' },
    { name: 'Analytics', href: '/analytics' },
  ];

  return (
    <header className="border-b">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Job Tracker
            </Link>
            <div className="ml-10 hidden space-x-8 md:flex">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors hover:text-primary',
                    pathname === link.href
                      ? 'border-b-2 border-primary text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}