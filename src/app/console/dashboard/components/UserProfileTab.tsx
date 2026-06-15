'use client';

import { useState, useEffect } from 'react';

export default function UserProfileTab() {
  // Initial profile data
  const [profile, setProfile] = useState({
    name: 'Developer Fluxtonx',
    email: 'developer.fluxtonx@gmail.com',
    dialCode: '+92',
    dialCountry: 'Pakistan',
    phoneNumber: '3451184105'
  });

  // Modal display states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Edit modal form states
  const [editName, setEditName] = useState('');
  const [editDialCode, setEditDialCode] = useState('+92');
  const [editDialCountry, setEditDialCountry] = useState('Pakistan');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');

  // Password modal form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  // OTP Countdown timer states
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Country dial codes mockup list
  const countryDialCodes = [
    { code: '+92', country: 'Pakistan' },
    { code: '+1', country: 'United States' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+86', country: 'China' },
    { code: '+65', country: 'Singapore' },
    { code: '+852', country: 'Hong Kong' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' }
  ];

  // OTP Countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && otpSent) {
      setOtpSent(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, otpSent]);

  // Launch Edit Modal
  const handleOpenEdit = () => {
    setEditName(profile.name);
    setEditDialCode(profile.dialCode);
    setEditDialCountry(profile.dialCountry);
    setEditPhoneNumber(profile.phoneNumber);
    setShowEditModal(true);
  };

  // Save changes from Edit Modal
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name: editName,
      email: profile.email, // email is typically read-only
      dialCode: editDialCode,
      dialCountry: editDialCountry,
      phoneNumber: editPhoneNumber
    });
    setShowEditModal(false);
  };

  // Launch Change Password Modal
  const handleOpenPassword = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setVerificationCode('');
    setOtpSent(false);
    setCountdown(0);
    setShowPasswordModal(true);
  };

  // Simulate sending verification code OTP
  const handleSendCode = () => {
    setOtpSent(true);
    setCountdown(60);
    // Display a mockup success notification alert
    alert('Verification code sent successfully to developer.fluxtonx@gmail.com!');
  };

  // Submit Password update
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (!verificationCode) {
      alert("Please enter the verification code!");
      return;
    }
    alert("Password updated successfully!");
    setShowPasswordModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Account Details Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900">
            <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-base font-bold">Account Details</h2>
          </div>
          <button
            onClick={handleOpenEdit}
            className="px-4 py-1.5 border border-blue-600 hover:bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Row 1: Name */}
          <div className="grid grid-cols-3 sm:grid-cols-4 items-center py-2.5">
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Name:</span>
            <span className="col-span-2 sm:col-span-3 text-gray-800 font-semibold text-sm">{profile.name}</span>
          </div>

          {/* Row 2: Email */}
          <div className="grid grid-cols-3 sm:grid-cols-4 items-center py-2.5 border-t border-gray-50">
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Email:</span>
            <span className="col-span-2 sm:col-span-3 text-gray-850 font-mono text-sm">{profile.email}</span>
          </div>

          {/* Row 3: Phone Number */}
          <div className="grid grid-cols-3 sm:grid-cols-4 items-center py-2.5 border-t border-gray-50">
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Phone Number:</span>
            <span className="col-span-2 sm:col-span-3 text-gray-800 font-medium text-sm">
              ({profile.dialCode}) {profile.phoneNumber}
            </span>
          </div>

          {/* Row 4: Password */}
          <div className="grid grid-cols-3 sm:grid-cols-4 items-center py-2.5 border-t border-gray-50">
            <span className="text-gray-400 font-semibold text-xs uppercase tracking-wider">Password:</span>
            <button
              onClick={handleOpenPassword}
              className="col-span-2 sm:col-span-3 text-blue-600 hover:text-blue-700 font-bold text-sm cursor-pointer select-none text-left hover:underline"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* 1. Edit Details Modal Overlay */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowEditModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Modal Container */}
          <form
            onSubmit={handleSaveProfile}
            className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">Edit</h3>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  {/* Country dial code select */}
                  <select
                    value={`${editDialCode} ${editDialCountry}`}
                    onChange={e => {
                      const selectedVal = e.target.value;
                      const match = countryDialCodes.find(
                        item => `${item.code} ${item.country}` === selectedVal
                      );
                      if (match) {
                        setEditDialCode(match.code);
                        setEditDialCountry(match.country);
                      }
                    }}
                    className="px-2 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-600 shrink-0 w-32"
                  >
                    {countryDialCodes.map(item => (
                      <option key={`${item.code} ${item.country}`} value={`${item.code} ${item.country}`}>
                        {item.code} {item.country}
                      </option>
                    ))}
                  </select>

                  {/* Phone number digits */}
                  <input
                    type="tel"
                    required
                    value={editPhoneNumber}
                    onChange={e => setEditPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 2. Change Password Modal Overlay */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowPasswordModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Modal Container */}
          <form
            onSubmit={handleSavePassword}
            className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 border border-gray-100 flex flex-col gap-5 animate-in zoom-in-95 duration-200"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="text-center">
              <h3 className="text-base font-bold text-gray-900">Change Password</h3>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Old password */}
              <div>
                <input
                  type="password"
                  required
                  placeholder="Old password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                />
              </div>

              {/* New password */}
              <div>
                <input
                  type="password"
                  required
                  placeholder="New password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                />
              </div>

              {/* Confirm password */}
              <div>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                />
              </div>

              {/* Verification code */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  required
                  placeholder="Verification code"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                />
                <button
                  type="button"
                  disabled={countdown > 0}
                  onClick={handleSendCode}
                  className={`px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg shrink-0 transition-all select-none cursor-pointer ${
                    countdown > 0 ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100' : ''
                  }`}
                >
                  {countdown > 0 ? `Send (${countdown}s)` : 'Send'}
                </button>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="px-6 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
