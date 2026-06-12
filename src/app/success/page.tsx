'use client';

/**
 * Payment Success page.
 * Shows payment confirmation, details, and eSIM access link.
 * Matches the production AQonnect design.
 */
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface OrderData {
  id: string;
  email?: string;
  countryCode: string;
  countryName: string;
  packageName: string;
  days?: number;
  amountUSD: number;
  paymentStatus: string;
  esimStatus?: string;
  esimOrderNo?: string;
  esimTranNo?: string;
  iccid?: string;
  qrCodeUrl?: string;
  activationCode?: string;
  smdpAddress?: string;
  matchingId?: string;
  createdAt?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!sessionId) {
      setError('No session ID provided.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/order/status?session_id=${sessionId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Unable to fetch order.');
      }

      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch order status.');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Auto-poll while eSIM is not ready
  useEffect(() => {
    if (!order) return;
    const esimReady = order.esimStatus === 'completed' && (order.iccid || order.qrCodeUrl || order.activationCode);
    if (esimReady || pollCount >= 20) return;

    const timer = setTimeout(() => {
      setPollCount((c) => c + 1);
      fetchOrder();
    }, 3000);

    return () => clearTimeout(timer);
  }, [order, pollCount, fetchOrder]);

  const handleRefresh = () => {
    setLoading(true);
    setPollCount(0);
    fetchOrder();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-6">{error || 'Order not found.'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #D9A514, #C49412)' }}
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const esimReady = order.esimStatus === 'completed' && (order.iccid || order.qrCodeUrl || order.activationCode);
  const esimLink = order.esimOrderNo
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/esim?on=${order.esimOrderNo}`
    : null;

  return (
    <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg animate-slide-up space-y-5">
        {/* Success Header */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-1">
            {/* Gold checkmark outline */}
            <div className="w-9 h-9 rounded-full border-[2.5px] flex items-center justify-center" style={{ borderColor: '#D9A514' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#D9A514" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3.5">
              <DetailRow label="Plan" value={order.packageName} />
              <DetailRow label="Amount Paid" value={`$${order.amountUSD.toFixed(2)}`} bold />
              <DetailRow label="Date" value={formatDate(order.createdAt)} />
              {order.esimOrderNo && (
                <div className="flex items-center justify-between gap-4 pt-3.5 border-t border-gray-100">
                  <span className="text-sm text-gray-500 flex-shrink-0">Order Number</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    {order.esimOrderNo}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* eSIM Ready / Preparing Section */}
        {esimReady ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-5 space-y-4">
              <h3 className="text-base font-semibold text-gray-900">Your eSIM is Ready</h3>

              {/* View Your eSIM Button */}
              {esimLink && (
                <a
                  href={esimLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="view-esim-button"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
                  style={{ background: '#D9A514' }}
                >
                  {/* External link icon */}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Your eSIM
                </a>
              )}

              {/* Permalink */}
              {esimLink && (
                <div className="border border-gray-200 rounded-lg p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Permalink - Save or bookmark this link!
                      </p>
                      <p className="text-xs text-gray-400 font-mono break-all leading-relaxed">
                        {esimLink}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyLink(esimLink)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 px-2 py-1 rounded hover:bg-gray-50"
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                You can use this link anytime to view your eSIM details, QR code, and installation
                instructions.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-6 text-center space-y-3">
              <LoadingSpinner size="sm" className="mb-1" />
              <p className="text-sm text-amber-800 font-medium">Your eSIM is being prepared</p>
              <p className="text-xs text-amber-600">This usually takes a few moments. The page will update automatically.</p>
              <button
                onClick={handleRefresh}
                className="mt-2 w-full py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
                style={{ background: '#D9A514' }}
              >
                Refresh Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, bold, mono }: { label: string; value: string; bold?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span
        className={`text-sm text-right ${bold ? 'font-bold' : 'font-medium'} ${mono ? 'font-mono text-xs' : ''} text-gray-900`}
      >
        {value}
      </span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center py-20"><LoadingSpinner size="lg" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
