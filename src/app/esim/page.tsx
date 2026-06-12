'use client';

/**
 * eSIM Details page - /esim?on=ORDER_NUMBER
 * Shows plan status, usage info, installation QR, eSIM details, and support.
 * All data fetched from the API (live from eSIM Access provider).
 */
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Accordion from '@/components/ui/Accordion';

interface LiveData {
  status?: string;
  totalVolume?: number;
  remainingVolume?: number;
  usedVolume?: number;
  packageName?: string;
  expired?: boolean;
  apn?: string;
  operators?: string;
  breakout?: string;
  packageCode?: string;
  duration?: number;
  durationUnit?: string;
  totalDays?: number;
  remainDays?: number;
  activeDays?: number;
  activeDate?: string;
  expireDate?: string;
  locationCode?: string;
  countries?: string;
  raw?: Record<string, unknown>;
}

interface EsimData {
  id: string;
  packageName: string;
  packageCode: string;
  countryCode: string;
  countryName: string;
  days?: number;
  amountUSD: number;
  esimOrderNo?: string;
  esimTranNo?: string;
  stripePaymentIntentId?: string;
  iccid?: string;
  qrCodeUrl?: string;
  activationCode?: string;
  smdpAddress?: string;
  matchingId?: string;
  esimStatus?: string;
  createdAt?: string;
  live?: LiveData;
}

function EsimDetailsContent() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get('on');
  const [data, setData] = useState<EsimData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    if (!orderNo) {
      setError('No order number provided.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/esim/details?on=${orderNo}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Unable to fetch eSIM details.');
      }

      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch eSIM details.');
    } finally {
      setLoading(false);
    }
  }, [orderNo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (!data) return;
    const shareData = {
      title: `eSIM - ${data.packageName}`,
      text: `eSIM details for ${data.packageName}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await handleCopy(window.location.href);
      }
    } catch {
      // User cancelled share
    }
  };

  const lpaCode = data?.activationCode?.startsWith('LPA:')
    ? data.activationCode
    : data?.smdpAddress && data?.matchingId
    ? `LPA:1$${data.smdpAddress}$${data.matchingId}`
    : data?.activationCode || '';

  const handleIosInstall = () => {
    if (!lpaCode) return;
    window.open(`https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=${lpaCode}`, '_blank');
  };

  const handleAndroidInstall = () => {
    if (!lpaCode) return;
    window.open(`https://esimsetup.android.com/esim_qrcode_provisioning/?carddata=${lpaCode}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">eSIM Not Found</h2>
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

  // Derive status from live data
  const liveStatus = data.live?.status || data.esimStatus || 'unknown';
  const statusLabel = formatStatus(liveStatus);

  // Usage calculation
  const totalVolume = data.live?.totalVolume;
  const remainingVolume = data.live?.remainingVolume;
  const usedVolume = data.live?.usedVolume;

  let usedMB = 0;
  let totalMB = 0;
  let remainingMB = 0;
  let usedPercent = 0;

  if (totalVolume && totalVolume > 0) {
    totalMB = totalVolume / (1024 * 1024);
    if (remainingVolume !== null && remainingVolume !== undefined) {
      remainingMB = remainingVolume / (1024 * 1024);
      usedMB = totalMB - remainingMB;
    } else if (usedVolume !== null && usedVolume !== undefined) {
      usedMB = usedVolume / (1024 * 1024);
      remainingMB = totalMB - usedMB;
    }
    usedPercent = Math.min(100, Math.round((usedMB / totalMB) * 100));
  }

  const remainingPercent = 100 - usedPercent;

  // Days info
  const totalDays = data.live?.totalDays || data.days || null;
  const remainDays = data.live?.remainDays ?? null;
  const activeDays = data.live?.activeDays ?? null;
  const isDailyPlan = data.packageName?.includes('/Day');
  const dailyDataAmount = isDailyPlan ? data.packageName.split(' ').find(s => s.includes('/Day'))?.replace('/Day', '') : null;

  // Derive transaction ID
  let displayTransactionId = '—';
  if (data.stripePaymentIntentId) {
    displayTransactionId = data.stripePaymentIntentId.startsWith('pi_')
      ? `aaqid_${data.stripePaymentIntentId}`
      : data.stripePaymentIntentId;
  } else if (data.esimTranNo) {
    displayTransactionId = data.esimTranNo;
  }

  return (
    <div className="flex-1 flex items-start justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-xl animate-slide-up space-y-4">
        {/* Plan Banner */}
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 flex-shrink-0" />
            <span className="text-base font-semibold text-gray-900">{data.packageName}</span>
          </div>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md tracking-wide">
            {statusLabel}
          </span>
        </div>

        {/* Usage Information */}
        {totalVolume && totalVolume > 0 ? (
          <Accordion
            title="Usage Information"
            defaultOpen={true}
          >
            <div className="space-y-4">
              {/* Data usage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Data
                  </span>
                  <span className="text-sm">
                    <span style={{ color: '#D9A514' }} className="font-semibold">
                      {formatMB(remainingMB)}
                    </span>
                    <span className="text-gray-400"> / {formatMB(totalMB)}</span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${remainingPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-400">{remainingPercent}% remaining</span>
                  <span className="text-xs text-gray-400">{usedPercent}% used</span>
                </div>
              </div>

              {/* Daily plan info */}
              {isDailyPlan && totalDays !== null && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-sm" style={{ color: '#D9A514' }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Daily Plan
                    </span>
                    <span className="text-sm" style={{ color: '#D9A514' }}>
                      Day {activeDays !== null ? activeDays : '—'} of {totalDays}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill-gray"
                      style={{ width: `${remainDays !== null && totalDays ? ((totalDays - (remainDays || 0)) / totalDays) * 100 : 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-gray-400">
                      {remainDays !== null ? `${remainDays} days remaining` : '0 days remaining'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {dailyDataAmount ? `${dailyDataAmount} per day` : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Accordion>
        ) : (
          /* Show usage section even without data but indicate no data available */
          <Accordion title="Usage Information" defaultOpen={false}>
            <p className="text-sm text-gray-400 text-center py-4">
              Usage data is not yet available for this eSIM.
            </p>
          </Accordion>
        )}

        {/* Installation */}
        <Accordion title="Installation" defaultOpen={false}>
          <div className="space-y-6 flex flex-col items-center">
            {/* QR Code */}
            {showQr && data.qrCodeUrl && (
              <div className="relative bg-white border border-gray-200 rounded-xl p-3 shadow-sm w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center animate-fade-in">
                <img
                  src={data.qrCodeUrl}
                  alt="eSIM QR Code"
                  className="w-full h-full object-contain rounded-lg"
                />
                <button
                  onClick={() => window.open(data.qrCodeUrl!, '_blank')}
                  className="absolute bottom-2 right-2 bg-white px-2.5 py-1 rounded-full text-[10px] font-semibold text-gray-600 shadow-sm border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  Expand
                </button>
              </div>
            )}

            {/* Circular Tab Buttons */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 w-full pt-2">
              <CircularButton
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="4" y="4" width="6" height="6" rx="1" />
                    <rect x="14" y="4" width="6" height="6" rx="1" />
                    <rect x="4" y="14" width="6" height="6" rx="1" />
                    <rect x="14" y="14" width="6" height="6" rx="1" />
                  </svg>
                }
                label="QR Code"
                active={showQr}
                onClick={() => setShowQr(!showQr)}
              />
              <CircularButton
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.97 1.12.09 2.26-.58 2.98-1.41z"/>
                  </svg>
                }
                label="iOS"
                active={false}
                onClick={handleIosInstall}
              />
              <CircularButton
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 15.3c-.551 0-1 .449-1 1 0 .551.449 1 1 1s1-.449 1-1c0-.551-.449-1-1-1zm-11.046 0c-.551 0-1 .449-1 1 0 .551.449 1 1 1s1-.449 1-1c0-.551-.449-1-1-1zm11.546-3.8c-.097-.175-.297-.247-.471-.151l-.988.544c-.787-.521-1.663-.889-2.584-1.076l.487-1.503c.061-.19-.044-.393-.235-.455-.19-.062-.394.043-.455.234l-.497 1.536c-.452-.036-.91-.036-1.362 0l-.497-1.536c-.061-.19-.265-.296-.455-.234-.191.062-.296.265-.235.455l.487 1.503c-.921.187-1.797.555-2.584 1.076l-.988-.544c-.174-.096-.374-.024-.471.151-.097.175-.025.375.151.471l.995.548c-1.42 1.488-2.203 3.498-2.203 5.66h16.039c0-2.162-.783-4.172-2.203-5.66l.995-.548c.176-.096.248-.296.151-.471z"/>
                  </svg>
                }
                label="Android"
                active={false}
                onClick={handleAndroidInstall}
              />
              <CircularButton
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
                label="Copy"
                active={copied}
                onClick={() => handleCopy(lpaCode)}
              />
              <CircularButton
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                }
                label="Share"
                active={false}
                onClick={handleShare}
              />
            </div>

            {/* Description Text */}
            <p className="text-xs text-gray-500 text-center px-4 leading-relaxed transition-all">
              {copied ? (
                <span className="text-green-600 font-semibold">
                  LPA activation code copied to clipboard!
                </span>
              ) : showQr ? (
                "Scan the QR code with your phone's camera or choose an installation option above."
              ) : (
                "Click on an installation option above to get started."
              )}
            </p>
          </div>
        </Accordion>

        {/* eSIM Details */}
        <Accordion title="eSIM Details" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-3">
            <DetailCell label="APN" value={data.live?.apn || '—'} mono />
            <DetailCell label="OPERATORS" value={data.live?.operators || '—'} />
            <DetailCell label="BREAKOUT" value={data.live?.breakout || '—'} />
            <DetailCell label="TRANSACTION ID" value={displayTransactionId} mono={displayTransactionId !== '—'} small />
            <DetailCell label="ORDER NO" value={data.esimOrderNo || '—'} mono />
            <DetailCell label="ICCID" value={data.iccid || '—'} mono />
            <DetailCell label="PACKAGE" value={data.live?.packageCode || data.packageCode || '—'} mono />
            <DetailCell label="COUNTRIES" value={data.live?.countries || data.countryCode || '—'} />
          </div>
        </Accordion>

        {/* Support */}
        <Accordion
          title="Support"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          defaultOpen={false}
        >
          <div className="text-center py-3 space-y-3">
            <p className="text-sm text-gray-500">
              Need help with your eSIM? Contact our support team.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-amber-50"
              style={{ borderColor: '#D9A514', color: '#D9A514' }}
            >
              Contact Support
            </a>
          </div>
        </Accordion>
      </div>
    </div>
  );
}

/** Format bytes to human-readable MB/GB */
function formatMB(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return gb % 1 === 0 ? `${gb} GB` : `${gb.toFixed(1)} GB`;
  }
  return `${mb % 1 === 0 ? mb : mb.toFixed(1)} MB`;
}

/** Format eSIM status for display */
function formatStatus(status: string): string {
  const map: Record<string, string> = {
    completed: 'ACTIVE',
    processing: 'PROCESSING',
    failed: 'FAILED',
    IN_USE: 'IN_USE',
    USED_EXPIRED: 'USED_EXPIRED',
    NOT_ACTIVE: 'NOT_ACTIVE',
    DELETED: 'DELETED',
  };
  return map[status] || status.toUpperCase().replace(/_/g, '_');
}

/** Circular button for install methods */
function CircularButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[64px]">
      <button
        onClick={onClick}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 hover:brightness-95 ${
          active
            ? 'text-white'
            : 'text-[#D9A514]'
        }`}
        style={{
          backgroundColor: active ? '#D9A514' : '#fbf7ee',
        }}
      >
        {icon}
      </button>
      <span className="text-[11px] font-medium text-gray-800">{label}</span>
    </div>
  );
}

/** Detail cell for the eSIM Details grid */
function DetailCell({
  label,
  value,
  mono,
  small,
}: {
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-[10px] text-gray-400 font-medium tracking-wider mb-1">{label}</p>
      <p
        className={`text-sm text-gray-900 break-all ${mono ? 'font-mono' : ''} ${
          small ? 'text-xs' : ''
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function EsimPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <EsimDetailsContent />
    </Suspense>
  );
}
