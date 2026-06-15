'use client';

import { usePathname } from 'next/navigation';

/**
 * AQonnect Footer component.
 */
export default function Footer() {
  const pathname = usePathname();

  // Hide footer on console routes
  if (pathname && pathname.startsWith('/console')) {
    return null;
  }

  return (
    <footer className="w-full py-8 text-center text-sm text-gray-400">
      <p>© {new Date().getFullYear()} AQonnect.</p>
    </footer>
  );
}
