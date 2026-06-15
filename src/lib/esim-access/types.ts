/**
 * TypeScript types for eSIM Access API.
 */

// --- Raw API response types ---

export interface EsimPackageRaw {
  packageCode: string;
  slug?: string;
  name: string;
  price: number;           // price (value * 10,000, e.g. 10000 = $1.00 USD)
  currencyCode: string;    // e.g. "USD"
  volume: number;          // data in bytes
  smsVolume?: number;
  smsStatus?: number;
  dataType?: number;
  duration: number;        // validity in days
  durationUnit?: string;   // e.g. "DAY"
  location: string;
  locationCode: string;
  description?: string;
  activePolicy?: number;
  activeType?: number;
  speed?: string;
  supportTopUpType?: number;
  retailPrice?: number;
  priceType?: string;      // "normal" or "daily"
  unusedValidityTime?: number;
  minDays?: number;
  maxDays?: number;
  [key: string]: unknown;
}

export interface EsimPackageListResponse {
  success: boolean;
  errorCode?: string | number | null;
  errorMsg?: string | null;
  obj?: {
    packageList: EsimPackageRaw[];
  };
}

export interface EsimOrderRequestItem {
  packageCode: string;
  count: number;
  price: number;
  periodNum?: number;       // number of days for per-day packages
}

export interface EsimOrderRequest {
  transactionId: string;
  packageInfoList: EsimOrderRequestItem[];
}

export interface EsimProfile {
  iccid?: string;
  lpaType?: string;
  lpa?: string;             // SM-DP+ address
  activationCode?: string;
  qrCodeUrl?: string;
  matchingId?: string;
  smdpAddress?: string;
  confirmationCode?: string;
}

export interface EsimOrderResponseObj {
  orderNo?: string;
  transactionId?: string;
  packageCode?: string;
  count?: number;
  totalPrice?: number;
  currency?: string;
  status?: string;
  esimList?: EsimProfile[];
  [key: string]: unknown;
}

export interface EsimOrderResponse {
  success: boolean;
  errorCode?: string | number | null;
  errorMsg?: string | null;
  obj?: EsimOrderResponseObj;
}

export interface EsimOrderQueryResponse {
  success: boolean;
  errorCode?: string | number | null;
  errorMsg?: string | null;
  obj?: EsimOrderResponseObj;
}

// --- Normalized frontend-friendly types ---

export interface NormalizedPlan {
  id: string;
  packageCode: string;
  slug?: string;
  countryCode: string;
  countryName: string;
  name: string;
  displayName: string;
  dataAmount: string;
  validityDays: number | null;
  isPerDay: boolean;
  priceUSD: number;         // price in USD (converted from cents)
  dailyPriceUSD?: number;
  currency: 'USD';
  minDays?: number;
  maxDays?: number;
  raw: unknown;
}
