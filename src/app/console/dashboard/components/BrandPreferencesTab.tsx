'use client';

import { useState } from 'react';

export default function BrandPreferencesTab() {
  // Brand Customization State
  const [logoPosition, setLogoPosition] = useState<'left' | 'center' | 'right' | 'full'>('left');
  const [brandName, setBrandName] = useState('Fluxtonx');
  const [brandSlogan, setBrandSlogan] = useState('Reliable eSIM Connections');
  const [officialWebsite, setOfficialWebsite] = useState('https://fluxtonx.com');
  const [supportEmail, setSupportEmail] = useState('support@fluxtonx.com');
  const [primaryColor, setPrimaryColor] = useState('#4f46e5'); // Indigo-600

  // Preferences State
  const [lowBalanceThreshold, setLowBalanceThreshold] = useState(20);
  const [lowBalanceNotifications, setLowBalanceNotifications] = useState(true);
  const [announcements, setAnnouncements] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [priceMultiplier, setPriceMultiplier] = useState(200);

  // Preview Switch Tab
  const [previewTab, setPreviewTab] = useState<'email' | 'esim_page'>('email');

  // Notification banner state
  const [savedMessage, setSavedMessage] = useState('');

  const handleReset = () => {
    setLogoPosition('left');
    setBrandName('Fluxtonx');
    setBrandSlogan('Reliable eSIM Connections');
    setOfficialWebsite('https://fluxtonx.com');
    setSupportEmail('support@fluxtonx.com');
    setPrimaryColor('#4f46e5');
    setSavedMessage('Settings reset to defaults!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Brand customization settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {savedMessage && (
        <div className="p-4 bg-green-50 border border-green-150 text-green-700 text-sm font-semibold rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
          ✓ {savedMessage}
        </div>
      )}

      {/* Company Details Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-sm font-bold text-gray-900">Company Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-32 shrink-0">Company name:</span>
            <span className="font-semibold text-gray-800">Fluxtonx</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-32 shrink-0">Company address:</span>
            <span className="font-semibold text-gray-450">Gulberg Green Islamabad</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 font-medium w-32 shrink-0">Company country:</span>
            <span className="font-semibold text-gray-400">Pakistan</span>
          </div>
        </div>
      </div>

      {/* Brand Customization and Preview Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Brand Customization Form Panel (Left) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 xl:col-span-7">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900">Brand Customization</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Logo select file input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-sm">
              <label className="text-gray-500 font-semibold">Logo</label>
              <div className="sm:col-span-2 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => alert('Logo file uploader.')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Select file
                </button>
              </div>
            </div>

            {/* Logo Position Select Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-sm">
              <label className="text-gray-500 font-semibold">Logo Position</label>
              <div className="sm:col-span-2 flex items-center gap-1">
                {[
                  { pos: 'left', label: 'Left Align', icon: 'M4 6h16M4 12h10M4 18h16' },
                  { pos: 'center', label: 'Center Align', icon: 'M4 6h16M7 12h10M4 18h16' },
                  { pos: 'right', label: 'Right Align', icon: 'M4 6h16M10 12h10M4 18h16' },
                  { pos: 'full', label: 'Full Span', icon: 'M4 6h16M4 12h16M4 18h16' }
                ].map(item => {
                  const isSelected = logoPosition === item.pos;
                  return (
                    <button
                      key={item.pos}
                      type="button"
                      onClick={() => setLogoPosition(item.pos as any)}
                      className={`p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50/30 text-indigo-600' : 'border-gray-200 text-gray-400'}`}
                      title={item.label}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Name */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-sm">
              <label htmlFor="brandName" className="text-gray-500 font-semibold">Brand Name</label>
              <input
                id="brandName"
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="brand name"
                className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
              />
            </div>

            {/* Brand Slogan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-sm">
              <label htmlFor="brandSlogan" className="text-gray-500 font-semibold">Brand Slogan</label>
              <input
                id="brandSlogan"
                type="text"
                value={brandSlogan}
                onChange={e => setBrandSlogan(e.target.value)}
                placeholder="brand slogan"
                className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
              />
            </div>

            {/* Official Website */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-sm">
              <label htmlFor="officialWebsite" className="text-gray-500 font-semibold">Official Website</label>
              <input
                id="officialWebsite"
                type="text"
                value={officialWebsite}
                onChange={e => setOfficialWebsite(e.target.value)}
                placeholder="official website"
                className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
              />
            </div>

            {/* Support Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-sm">
              <label htmlFor="supportEmail" className="text-gray-500 font-semibold">Support Email</label>
              <input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                placeholder="support email"
                className="sm:col-span-2 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 text-xs w-full"
              />
            </div>

            {/* Primary Color Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-sm">
              <label className="text-gray-500 font-semibold">Primary Color</label>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => setPrimaryColor(e.target.value)}
                  className="w-8 h-8 rounded border border-gray-200 cursor-pointer overflow-hidden p-0"
                />
                <span className="font-mono text-xs text-gray-500 uppercase">{primaryColor}</span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 italic">
              * Optional fields will use system defaults if not set.
            </p>

            {/* Actions Reset/Save */}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-all active:scale-95"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Panel (Right) */}
        <div className="xl:col-span-5 space-y-4">
          {/* Preview Header & Tab Swapping */}
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <button
              onClick={() => setPreviewTab('email')}
              className={`text-xs font-bold px-3 py-1 cursor-pointer transition-all ${previewTab === 'email' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Email
            </button>
            <button
              onClick={() => setPreviewTab('esim_page')}
              className={`text-xs font-bold px-3 py-1 cursor-pointer transition-all ${previewTab === 'esim_page' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              eSIM Page
            </button>
          </div>

          {/* Email Tab Preview content */}
          {previewTab === 'email' ? (
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-md space-y-5 text-xs text-gray-600 leading-normal animate-in fade-in duration-200 max-h-[600px] overflow-y-auto">
              {/* Brand Logo Alignment Mock */}
              <div className={`flex w-full ${logoPosition === 'center' ? 'justify-center' : logoPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-3.5 py-1.5 rounded-lg text-white font-bold tracking-tight text-[10px]"
                  style={{ backgroundColor: primaryColor }}
                >
                  {brandName}
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-gray-800">Dear customer,</p>
                <p>
                  Thank you. For your order details to your eSIM information, you can scan the QR code to activate your plan on your device.
                </p>
                <p className="font-medium text-indigo-600 hover:underline cursor-pointer">
                  Sync/View eSIM Details
                </p>
              </div>

              {/* QR Code container */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-gray-100/60 w-44 mx-auto space-y-2 select-none">
                {/* SVG mock QR Code */}
                <svg className="w-24 h-24 text-gray-800" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="none" />
                  {/* Top-left position block */}
                  <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                  <rect x="10" y="10" width="15" height="15" fill="white" />
                  <rect x="13" y="13" width="9" height="9" fill="currentColor" />
                  {/* Top-right position block */}
                  <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                  <rect x="75" y="10" width="15" height="15" fill="white" />
                  <rect x="78" y="13" width="9" height="9" fill="currentColor" />
                  {/* Bottom-left position block */}
                  <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                  <rect x="10" y="75" width="15" height="15" fill="white" />
                  <rect x="13" y="78" width="9" height="9" fill="currentColor" />
                  {/* Randomized mock data bits */}
                  <rect x="35" y="5" width="10" height="5" fill="currentColor" />
                  <rect x="50" y="5" width="5" height="15" fill="currentColor" />
                  <rect x="60" y="10" width="5" height="5" fill="currentColor" />
                  <rect x="35" y="15" width="5" height="15" fill="currentColor" />
                  <rect x="45" y="25" width="15" height="5" fill="currentColor" />
                  <rect x="70" y="35" width="10" height="10" fill="currentColor" />
                  <rect x="5" y="40" width="15" height="5" fill="currentColor" />
                  <rect x="25" y="45" width="10" height="5" fill="currentColor" />
                  <rect x="40" y="45" width="5" height="15" fill="currentColor" />
                  <rect x="55" y="50" width="15" height="5" fill="currentColor" />
                  <rect x="85" y="50" width="10" height="10" fill="currentColor" />
                  <rect x="70" y="65" width="5" height="15" fill="currentColor" />
                  <rect x="80" y="70" width="15" height="5" fill="currentColor" />
                  <rect x="85" y="85" width="10" height="10" fill="currentColor" />
                  <rect x="35" y="75" width="15" height="5" fill="currentColor" />
                  <rect x="40" y="85" width="5" height="10" fill="currentColor" />
                  <rect x="55" y="80" width="10" height="15" fill="currentColor" />
                </svg>
                <span className="text-[10px] text-gray-400 font-semibold">Scan on eSIM device</span>
              </div>

              {/* eSIM codes metadata */}
              <div className="space-y-1.5 p-3.5 bg-gray-50/40 border border-gray-100 rounded-2xl font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-gray-400">ORDER NO (BATCH ID):</span>
                  <span className="text-gray-800 font-semibold">B-9481920</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">eSIM Tran No:</span>
                  <span className="text-gray-800 font-semibold">T-5829104</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">eSIM Profile No:</span>
                  <span className="text-gray-800 font-semibold">P-2938102</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Activated Before:</span>
                  <span className="text-gray-800 font-semibold">2026-09-15 20:20:00 UTC</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-1.5 mt-1.5">
                  <span className="text-gray-400">Activation Code (String):</span>
                  <span className="text-gray-800 font-semibold truncate max-w-[200px]" title="LPA:1$rsp.aqonnect.com$T-5829104">LPA:1$rsp.aqonnect.com$T-5829104</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SM-DP+ Address:</span>
                  <span className="text-gray-800 font-semibold">rsp.aqonnect.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Activation Code:</span>
                  <span className="text-gray-800 font-semibold">T-5829104</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">APN:</span>
                  <span className="text-gray-800 font-semibold">{brandName.toLowerCase() || 'aqonnect'}</span>
                </div>
              </div>

              {/* Install instructions buttons */}
              <div className="flex gap-2">
                <button type="button" className="flex-1 py-2 bg-gray-950 text-white font-bold rounded-xl active:scale-95 transition-all">
                  iOS (iPad/iPhone)
                </button>
                <button type="button" className="flex-1 py-2 bg-gray-950 text-white font-bold rounded-xl active:scale-95 transition-all">
                  Android (S-2)
                </button>
              </div>

              {/* Social share icons mock */}
              <div className="space-y-2 border-t border-gray-150 pt-3">
                <span className="text-[10px] text-gray-400 font-bold block text-center">You can also share this link with friends on social pages:</span>
                <div className="flex justify-center gap-4 text-blue-600 font-semibold">
                  <span className="hover:underline cursor-pointer">Facebook</span>
                  <span className="hover:underline cursor-pointer">Twitter</span>
                  <span className="hover:underline cursor-pointer">WhatsApp</span>
                </div>
              </div>

              <div className="space-y-1 border-t border-gray-150 pt-3 text-[10px]">
                <p className="font-semibold text-gray-800">Best regards,</p>
                <p className="font-bold text-gray-900">{brandName} Team</p>
                {brandSlogan && <p className="text-gray-400 italic text-[9px]">{brandSlogan}</p>}
                {officialWebsite && <p className="text-indigo-600 hover:underline cursor-pointer">{officialWebsite}</p>}
                <p className="text-[8px] text-gray-400 text-center pt-3 select-none">
                  *** This is a system-generated message please do not reply to this address ***
                </p>
              </div>
            </div>
          ) : (
            /* eSIM Page Mobile Preview content */
            <div className="bg-slate-50 border border-gray-200 rounded-3xl p-4 shadow-md max-w-sm mx-auto space-y-4 animate-in fade-in duration-200 text-xs">
              {/* Mock Mobile Browser Navigation Bar */}
              <div className="bg-white rounded-xl py-1.5 px-3 border border-gray-100 flex items-center justify-between text-[10px] text-gray-400 shadow-sm select-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="font-mono text-[9px] truncate max-w-[150px]">{officialWebsite ? officialWebsite : 'https://console.aqonnect.app'}</span>
                <span className="text-gray-300">↻</span>
              </div>

              {/* Custom Branded Header Inside Mobile Page */}
              <div className={`flex w-full px-2 ${logoPosition === 'center' ? 'justify-center' : logoPosition === 'right' ? 'justify-end' : 'justify-start'}`}>
                <span
                  className="font-extrabold tracking-tight text-sm py-1"
                  style={{ color: primaryColor }}
                >
                  {brandName}
                </span>
              </div>

              {/* Main eSIM Card Box */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center space-y-4">
                <h4 className="font-bold text-gray-900 text-sm">Singapore 1GB 7 days</h4>

                <button
                  type="button"
                  className="w-full py-2.5 text-white font-bold rounded-xl active:scale-[0.98] transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Quick Install
                </button>

                <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold select-none">
                  <div className="h-px bg-gray-150 flex-1" />
                  <span>Or</span>
                  <div className="h-px bg-gray-150 flex-1" />
                </div>

                <div className="flex flex-col items-center justify-center space-y-1.5 select-none">
                  {/* SVG mock QR Code */}
                  <svg className="w-20 h-20 text-gray-900" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="none" />
                    <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="currentColor" />
                    <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="currentColor" />
                    <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="currentColor" />
                    <rect x="35" y="5" width="10" height="5" fill="currentColor" />
                    <rect x="50" y="5" width="5" height="15" fill="currentColor" />
                    <rect x="60" y="10" width="5" height="5" fill="currentColor" />
                    <rect x="35" y="15" width="5" height="15" fill="currentColor" />
                    <rect x="45" y="25" width="15" height="5" fill="currentColor" />
                    <rect x="70" y="35" width="10" height="10" fill="currentColor" />
                    <rect x="5" y="40" width="15" height="5" fill="currentColor" />
                    <rect x="25" y="45" width="10" height="5" fill="currentColor" />
                    <rect x="55" y="50" width="15" height="5" fill="currentColor" />
                    <rect x="85" y="50" width="10" height="10" fill="currentColor" />
                    <rect x="70" y="65" width="5" height="15" fill="currentColor" />
                    <rect x="80" y="70" width="15" height="5" fill="currentColor" />
                    <rect x="85" y="85" width="10" height="10" fill="currentColor" />
                    <rect x="35" y="75" width="15" height="5" fill="currentColor" />
                  </svg>
                  <span className="text-[9px] text-gray-400 font-semibold">Scan on eSIM device</span>
                </div>
              </div>

              {/* eSIM Mobile details list */}
              <div className="space-y-1.5 p-3.5 bg-white border border-gray-100 rounded-2xl font-mono text-[9px] text-gray-500 shadow-sm">
                <div className="flex justify-between">
                  <span>Activate Before:</span>
                  <span className="text-gray-800 font-semibold">2026-09-15 20:20:00 UTC</span>
                </div>
                <div className="flex justify-between">
                  <span>ICCID:</span>
                  <span className="text-gray-800 font-semibold truncate max-w-[150px]">8904903200123456789</span>
                </div>
                <div className="flex justify-between">
                  <span>APN:</span>
                  <span className="text-gray-800 font-semibold">{brandName.toLowerCase() || 'aqonnect'}</span>
                </div>
              </div>

              {/* Coverage and network Search */}
              <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm space-y-3">
                <span className="font-bold text-[10px] text-gray-700 block">Coverage and Networks</span>
                <input
                  type="text"
                  placeholder="Country or area"
                  disabled
                  className="w-full px-2.5 py-1.5 border border-gray-150 rounded-xl bg-gray-50 text-[10px] focus:outline-none placeholder-gray-400 cursor-not-allowed"
                />

                {/* Network row */}
                <div className="flex justify-between items-center text-[10px] pt-1">
                  <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                    <span>🇸🇬</span>
                    <span>Singapore</span>
                  </div>
                  <span className="text-gray-400">Singtel 5G</span>
                </div>
              </div>

              {/* Mobile page footer buttons */}
              <div className="space-y-2 pt-2">
                <button type="button" className="w-full py-2 bg-gray-950 text-white font-bold rounded-xl active:scale-[0.98] transition-all">
                  Check Usage
                </button>
                <button type="button" className="w-full py-1 text-center font-bold text-gray-600 hover:text-gray-800 hover:underline cursor-pointer block">
                  Installation Guide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preferences Section (Bottom) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Preferences Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900">Email Preferences</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Low balance input threshold notification */}
            <div className="flex flex-col space-y-1">
              <label className="font-semibold text-gray-750 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lowBalanceNotifications}
                  onChange={e => setLowBalanceNotifications(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Low Balance Notifications</span>
              </label>

              <div className="flex items-center gap-1.5 pl-6 pt-0.5 text-gray-500">
                <span>Receive a notification if your balance is less than</span>
                <input
                  type="number"
                  value={lowBalanceThreshold}
                  onChange={e => setLowBalanceThreshold(Number(e.target.value))}
                  className="w-12 text-center border border-gray-200 rounded px-1 py-0.5 font-bold text-gray-700 focus:outline-none"
                  min="0"
                />
                <span>USD</span>
                <button
                  type="button"
                  onClick={() => {
                    setSavedMessage(`Low balance notification threshold updated to $${lowBalanceThreshold}!`);
                    setTimeout(() => setSavedMessage(''), 3000);
                  }}
                  className="text-indigo-600 hover:text-indigo-750 hover:underline font-bold ml-1 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Checkbox 2: Announcements */}
            <label className="font-semibold text-gray-750 flex items-center gap-2 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={announcements}
                onChange={e => setAnnouncements(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <div className="space-y-0.5">
                <span className="block font-semibold">Announcements when product updates</span>
                <span className="block text-[10px] text-gray-400 font-medium">Product updates</span>
              </div>
            </label>

            {/* Checkbox 3: Updates */}
            <label className="font-semibold text-gray-750 flex items-center gap-2 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={productUpdates}
                onChange={e => setProductUpdates(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>Product updates</span>
            </label>
          </div>
        </div>

        {/* Merchant Preferences Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-bold text-gray-900">Merchant Preferences</h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <span className="block font-semibold text-gray-750">Retail price multiplier settings</span>
              <div className="flex items-center gap-2 text-gray-500 pt-0.5">
                <span>Retail price = price * multiplier</span>
                <div className="flex items-center border border-gray-250 rounded px-2 py-0.5 bg-gray-50">
                  <input
                    type="number"
                    value={priceMultiplier}
                    onChange={e => setPriceMultiplier(Number(e.target.value))}
                    className="w-10 text-center font-bold text-gray-700 bg-transparent focus:outline-none"
                    min="100"
                  />
                  <span className="font-semibold text-gray-500">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSavedMessage(`Retail price multiplier updated to ${priceMultiplier}%!`);
                    setTimeout(() => setSavedMessage(''), 3000);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold ml-1 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
