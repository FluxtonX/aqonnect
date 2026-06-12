'use client';

/**
 * Success page - Shows payment confirmation and eSIM details.
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
  iccid?: string;
  qrCodeUrl?: string;
  activationCode?: string;
  smdpAddress?: string;
  matchingId?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

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
    if (esimReady || pollCount >= 20) return; // Stop after ~60s of polling

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

  return (
    <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg animate-slide-up">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Success banner */}
          <div className="px-6 pt-8 pb-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D9A51422, #D9A51411)' }}>
              <svg className="w-8 h-8" style={{ color: '#D9A514' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
            <p className="text-gray-500 mt-1">
              {esimReady ? 'Your eSIM is ready.' : 'Your eSIM is being prepared.'}
            </p>
          </div>

          {/* Order details */}
          <div className="px-6 py-4 space-y-3">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <DetailRow label="Country" value={order.countryName} />
              <DetailRow label="Plan" value={order.packageName} />
              {order.days && <DetailRow label="Days" value={`${order.days} days`} />}
              <DetailRow label="Amount" value={`$${order.amountUSD.toFixed(2)}`} highlight />
              {order.email && <DetailRow label="Email" value={order.email} />}
            </div>

            {/* eSIM details */}
            {esimReady ? (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  eSIM Activation Details
                </h3>

                {order.iccid && <DetailRow label="ICCID" value={order.iccid} mono />}
                {order.smdpAddress && <DetailRow label="SM-DP+ Address" value={order.smdpAddress} mono />}
                {order.matchingId && <DetailRow label="Matching ID" value={order.matchingId} mono />}
                {order.activationCode && <DetailRow label="Activation Code" value={order.activationCode} mono />}

                {order.qrCodeUrl && (
                  <div className="pt-3 text-center">
                    <p className="text-xs text-gray-500 mb-2">Scan QR code to install eSIM</p>
                    <img
                      src={order.qrCodeUrl}
                      alt="eSIM QR Code"
                      className="w-48 h-48 mx-auto rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                <LoadingSpinner size="sm" className="mb-2" />
                <p className="text-sm text-amber-800 font-medium">Your eSIM is being prepared</p>
                <p className="text-xs text-amber-600 mt-1">Please refresh this page in a few moments.</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-7 pt-3 space-y-3">
            {!esimReady && (
              <button
                onClick={handleRefresh}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #D9A514, #C49412)' }}
              >
                Refresh Status
              </button>
            )}
            <a
              href="/"
              className="block w-full py-3 rounded-xl border border-gray-200 text-center text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Buy Another eSIM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight, mono }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span
        className={`text-sm text-right ${highlight ? 'font-bold' : 'font-medium'} ${mono ? 'font-mono text-xs break-all' : ''}`}
        style={highlight ? { color: '#D9A514' } : { color: '#111827' }}
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
