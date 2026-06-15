'use client';

import { usePathname } from 'next/navigation';

/**
 * AQonnect Header component.
 * Centered logo + brand name, matching the production design.
 */
export default function Header() {
  const pathname = usePathname();

  // Hide header on console routes
  if (pathname && pathname.startsWith('/console')) {
    return null;
  }

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center gap-3">
        {/* Logo mark */}
        <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs tracking-tight">AQ</span>
        </div>

        <h1
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{ color: '#D9A514' }}
        >
          AQonnect
        </h1>
      </div>
    </header>
  );
}
