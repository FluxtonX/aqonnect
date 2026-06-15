'use client';

import { useState } from 'react';

export default function DeveloperTab() {
  // Mock API Key States
  const [accessCode, setAccessCode] = useState('3c4f2e8d91a04b5c6d7e8f901234892b');
  const [secretKey, setSecretKey] = useState('9b11c2a3d4e5f6a7b8c9d0e1f2a37df7');
  const [createTime, setCreateTime] = useState('2026-06-15 18:03:01');

  // Copy success tooltips
  const [copiedKey, setCopiedKey] = useState<'access' | 'secret' | null>(null);

  // Modal State
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Webhook States
  const [webhookUrl, setWebhookUrl] = useState('');
  const [tempWebhookUrl, setTempWebhookUrl] = useState('');
  const [isEditingWebhook, setIsEditingWebhook] = useState(false);

  // Copy to clipboard helper
  const handleCopy = (text: string, type: 'access' | 'secret') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Generate random keys helper
  const generateRandomHex = (length: number) => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  // Roll keys action
  const handleRollKeys = () => {
    const newAccessCode = generateRandomHex(32);
    const newSecretKey = generateRandomHex(32);
    
    // Format current date/time: YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const formattedDate = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    setAccessCode(newAccessCode);
    setSecretKey(newSecretKey);
    setCreateTime(formattedDate);
    setShowWarningModal(false);
  };

  // Webhook action helpers
  const handleEditWebhook = () => {
    setTempWebhookUrl(webhookUrl);
    setIsEditingWebhook(true);
  };

  const handleSaveWebhook = () => {
    setWebhookUrl(tempWebhookUrl);
    setIsEditingWebhook(false);
  };

  const handleCancelWebhook = () => {
    setIsEditingWebhook(false);
  };

  // Helper to mask tokens
  const maskToken = (token: string) => {
    if (token.length <= 8) return token;
    return token.substring(0, 4) + '*************' + token.substring(token.length - 4);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. API Keys Section Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-gray-900">API Keys</h2>
            <p className="text-xs text-gray-400 font-medium">Authenticate API requests by key.</p>
          </div>
          <button
            onClick={() => setShowWarningModal(true)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Roll Keys
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Token</th>
                <th className="px-4 py-3">createTime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-gray-700">AccessCode</td>
                <td className="px-4 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <span className="font-mono">{maskToken(accessCode)}</span>
                  <button
                    onClick={() => handleCopy(accessCode, 'access')}
                    className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer select-none flex items-center gap-1"
                  >
                    Copy
                  </button>
                  {copiedKey === 'access' && (
                    <span className="text-[10px] text-green-600 font-bold animate-pulse">Copied!</span>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-400 font-mono">{createTime}</td>
              </tr>
              <tr className="hover:bg-gray-50/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-gray-700">SecretKey</td>
                <td className="px-4 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <span className="font-mono">{maskToken(secretKey)}</span>
                  <button
                    onClick={() => handleCopy(secretKey, 'secret')}
                    className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer select-none flex items-center gap-1"
                  >
                    Copy
                  </button>
                  {copiedKey === 'secret' && (
                    <span className="text-[10px] text-green-600 font-bold animate-pulse">Copied!</span>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-400 font-mono">{createTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. API Docs Section Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-2 text-xs font-semibold">
        <span className="text-gray-900">API docs :</span>
        <a
          href="https://docs.esimaccess.com/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
        >
          https://docs.esimaccess.com/
        </a>
      </div>

      {/* 3. Webhooks Section Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-900">Webhooks</h2>
          <p className="text-xs text-gray-400 font-medium">Please add a URL where you will be notified of server events.</p>
        </div>

        {!isEditingWebhook ? (
          <div className="space-y-4">
            {/* Read-only URL Display Box */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 relative min-h-[64px] flex flex-col justify-center">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider absolute top-2.5 left-4 select-none">
                URL
              </span>
              <span className="text-xs text-gray-750 font-mono break-all mt-2 pl-0">
                {webhookUrl || <span className="text-gray-300 italic">No webhook URL configured</span>}
              </span>
            </div>
            <button
              onClick={handleEditWebhook}
              className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">
                URL
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="text"
                  value={tempWebhookUrl}
                  onChange={e => setTempWebhookUrl(e.target.value)}
                  placeholder="https://host/path"
                  className="max-w-md w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-gray-800"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelWebhook}
                    className="px-4 py-1.5 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveWebhook}
                    className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Roll Keys Warning Modal overlay */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setShowWarningModal(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 border border-gray-100 flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowWarningModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Warning Header & Message */}
            <div className="flex items-start gap-4">
              {/* Amber warning circle exclamation icon */}
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-1 flex-1 pr-6">
                <h3 className="text-base font-bold text-gray-900">Warning</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Rolling your API Keys will disable your existing keys.
                </p>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-4 py-1.5 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRollKeys}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
