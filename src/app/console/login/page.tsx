'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    // Simulate login and redirect
    setTimeout(() => {
      setLoading(false);
      router.push('/console/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Illustration Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#f4f7fc] p-12 flex-col justify-between relative overflow-hidden">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">AQ</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            AQonnect <span className="text-amber-500 font-semibold">Console</span>
          </span>
        </div>

        {/* Custom SVG Illustration */}
        <div className="flex-1 flex flex-col justify-center items-center select-none py-8 z-10">
          <svg className="w-full max-w-md h-auto" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Monitor Stand & Base */}
            <path d="M220 310 L280 310 L290 340 L210 340 Z" fill="#cfd8dc" />
            <rect x="150" y="335" width="200" height="8" rx="4" fill="#b0bec5" />

            {/* Laptop/Monitor Body */}
            <rect x="80" y="100" width="340" height="210" rx="12" fill="#37474f" />
            <rect x="92" y="112" width="316" height="186" rx="6" fill="#ffffff" />
            <rect x="80" y="295" width="340" height="15" fill="#263238" />

            {/* Laptop Keyboard Area (overlayed style) */}
            <path d="M60 310 L440 310 L460 330 L40 330 Z" fill="#cfd8dc" opacity="0.3" />

            {/* Pie Chart & Bar Charts inside monitor */}
            <circle cx="150" cy="205" r="45" fill="#f5f5f5" />
            <path d="M150 205 L150 160 A 45 45 0 0 1 195 205 Z" fill="#3b82f6" />
            <path d="M150 205 L195 205 A 45 45 0 1 1 150 160 Z" fill="#10b981" />

            <rect x="230" y="215" width="20" height="50" rx="3" fill="#3b82f6" />
            <rect x="260" y="185" width="20" height="80" rx="3" fill="#10b981" />
            <rect x="290" y="165" width="20" height="100" rx="3" fill="#ef4444" />
            <rect x="320" y="235" width="20" height="30" rx="3" fill="#f59e0b" />

            {/* Windows title bar */}
            <rect x="92" y="112" width="316" height="24" fill="#eceff1" rx="2" />
            <circle cx="107" cy="124" r="4" fill="#ff5f56" />
            <circle cx="119" cy="124" r="4" fill="#ffbd2e" />
            <circle cx="131" cy="124" r="4" fill="#27c93f" />

            {/* Red Cloud with API text */}
            <path d="M210 90 C190 90, 180 110, 190 125 C175 130, 175 150, 195 155 C200 160, 260 160, 265 150 C280 145, 280 125, 265 115 C265 95, 235 85, 210 90 Z" fill="#ef4444" />
            <text x="212" y="132" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">API</text>

            {/* Connecting Nodes (Cloud to laptop) */}
            <path d="M190 155 L160 190" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M250 155 L280 185" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="160" cy="190" r="3" fill="#3b82f6" />
            <circle cx="280" cy="185" r="3" fill="#10b981" />

            {/* Rotating Gear 1 */}
            <g transform="translate(70, 230)">
              <circle cx="0" cy="0" r="15" fill="#90a4ae" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(0)" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(45)" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(90)" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(135)" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(180)" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(225)" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(270)" />
              <path d="M-5 -22 L5 -22 L7 -15 L-7 -15 Z" fill="#90a4ae" transform="rotate(315)" />
              <circle cx="0" cy="0" r="6" fill="#f4f7fc" />
            </g>

            {/* Rotating Gear 2 */}
            <g transform="translate(110, 270)">
              <circle cx="0" cy="0" r="22" fill="#78909c" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(22)" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(67)" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(112)" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(157)" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(202)" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(247)" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(292)" />
              <path d="M-6 -30 L6 -30 L9 -22 L-9 -22 Z" fill="#78909c" transform="rotate(337)" />
              <circle cx="0" cy="0" r="9" fill="#f4f7fc" />
            </g>

            {/* Developer Person sitting */}
            <path d="M330 250 C310 250, 290 270, 290 290 L370 290 C370 270, 350 250, 330 250 Z" fill="#3b82f6" />
            <circle cx="330" cy="225" r="16" fill="#ffcc80" />
            {/* Person's laptop */}
            <polygon points="280,270 310,270 305,290 275,290" fill="#1e293b" />
            <path d="M305 290 L275 290 L270 300 L300 300 Z" fill="#475569" />
            <circle cx="330" cy="225" r="16" fill="#ffe0b2" />
            {/* Hair */}
            <path d="M314 220 C314 205, 346 205, 346 220 C346 210, 314 210, 314 220 Z" fill="#27272a" />
          </svg>
        </div>

        {/* Footer text info */}
        <div className="text-xs text-gray-400 z-10">
          © 2026 AQonnect Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo for mobile only */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">AQ</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">
              AQonnect <span className="text-amber-500 font-semibold">Console</span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Hi, welcome aboard
          </h2>
          <p className="text-gray-500 mb-8">
            Manage your eSIM integrations and developer tools in one place.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
              <div className="flex justify-end mt-1.5">
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white" />
              )}
              Log in
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <span className="text-sm text-gray-500 block">Don't have an account yet?</span>
            <Link
              href="/console/signup"
              className="inline-block w-full py-3 text-center border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
