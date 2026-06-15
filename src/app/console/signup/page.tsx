'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    phoneCode: '+1',
    phoneNumber: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    couponCode: '',
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agree) {
      setError('You must accept the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    // Simulate signup and redirect to dashboard
    setTimeout(() => {
      setLoading(false);
      router.push('/console/dashboard');
    }, 1000);
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

            {/* Connecting Nodes */}
            <path d="M190 155 L160 190" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M250 155 L280 185" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="160" cy="190" r="3" fill="#3b82f6" />
            <circle cx="280" cy="185" r="3" fill="#10b981" />

            {/* Gears */}
            <g transform="translate(70, 230)">
              <circle cx="0" cy="0" r="15" fill="#90a4ae" />
              <circle cx="0" cy="0" r="6" fill="#f4f7fc" />
            </g>
            <g transform="translate(110, 270)">
              <circle cx="0" cy="0" r="22" fill="#78909c" />
              <circle cx="0" cy="0" r="9" fill="#f4f7fc" />
            </g>

            {/* Developer Person */}
            <path d="M330 250 C310 250, 290 270, 290 290 L370 290 C370 270, 350 250, 330 250 Z" fill="#3b82f6" />
            <circle cx="330" cy="225" r="16" fill="#ffe0b2" />
          </svg>
        </div>

        {/* Footer info */}
        <div className="text-xs text-gray-400 z-10">
          © 2026 AQonnect Inc. All rights reserved.
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto my-auto">
          {/* Header Link back to login */}
          <div className="flex justify-between items-center mb-6">
            {/* Logo for mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">AQ</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                AQonnect <span className="text-amber-500 font-semibold">Console</span>
              </span>
            </div>
            
            <div className="text-sm text-right w-full">
              <span className="text-gray-500">Already have an account? </span>
              <Link href="/console/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                Login.
              </Link>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            Get started with a free eSIM account.
          </h2>
          <p className="text-gray-500 mb-8">
            Create an AQonnect Developer Account to access data bundles worldwide.
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {/* First & Last name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Company name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Company Name
              </label>
              <input
                id="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your Company Inc."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  id="phoneCode"
                  value={formData.phoneCode}
                  onChange={handleChange}
                  className="px-3 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
                >
                  <option value="+1">+1 US/CA</option>
                  <option value="+44">+44 UK</option>
                  <option value="+49">+49 DE</option>
                  <option value="+33">+33 FR</option>
                  <option value="+92">+92 PK</option>
                  <option value="+86">+86 CN</option>
                </select>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Email verification */}
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Verification
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="col-span-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
                  onClick={() => alert('Verification code sent to email!')}
                >
                  Verify Email
                </button>
                <input
                  id="verificationCode"
                  type="text"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  placeholder="Verification code"
                  className="col-span-2 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Coupon Code */}
            <div>
              <label htmlFor="couponCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                Coupon Code (Optional)
              </label>
              <input
                id="couponCode"
                type="text"
                value={formData.couponCode}
                onChange={handleChange}
                placeholder="PROMO2026"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                id="agree"
                type="checkbox"
                checked={formData.agree}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                required
              />
              <label htmlFor="agree" className="text-xs text-gray-500 select-none">
                By continuing, you agree that you have read and accepted our{' '}
                <a href="#" className="text-indigo-600 font-semibold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 font-semibold hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white" />
              )}
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
