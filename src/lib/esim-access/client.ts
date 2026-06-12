/**
 * eSIM Access API client.
 * All calls are server-side only. Never import this in client components.
 */
import { getEsimAccessHeaders } from './auth';
import { normalizePackages } from './normalize';
import type {
  EsimPackageListResponse,
  EsimOrderRequest,
  EsimOrderRequestItem,
  EsimOrderResponse,
  EsimOrderQueryResponse,
  NormalizedPlan,
} from './types';

const BASE_URL = process.env.ESIM_ACCESS_BASE_URL || 'https://api.esimaccess.com';

// --- In-memory cache for packages ---
interface CacheEntry {
  data: NormalizedPlan[];
  timestamp: number;
}

const packageCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// --- Internal fetch helper ---

async function esimFetch<T>(path: string, body: unknown): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers = getEsimAccessHeaders();

  console.log(`[eSIM Access] POST ${path}`);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[eSIM Access] HTTP ${response.status}: ${text}`);
    throw new Error(`eSIM Access API error: ${response.status}`);
  }

  const data = await response.json() as T;
  return data;
}

// --- Public API methods ---

export async function getPackageList(locationCode: string): Promise<NormalizedPlan[]> {
  // Check cache
  const cacheKey = `packages:${locationCode}`;
  const cached = packageCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log(`[eSIM Access] Cache hit for ${locationCode}`);
    return cached.data;
  }

  const response = await esimFetch<EsimPackageListResponse>(
    '/api/v1/open/package/list',
    { locationCode }
  );

  if (!response.success || !response.obj?.packageList) {
    console.error(`[eSIM Access] Package list error:`, response.errorMsg || 'Unknown error');
    throw new Error(response.errorMsg || 'Failed to fetch packages');
  }

  const plans = normalizePackages(response.obj.packageList);

  // Store in cache
  packageCache.set(cacheKey, {
    data: plans,
    timestamp: Date.now(),
  });

  return plans;
}

export async function createOrder(params: {
  packageCode: string;
  price: number;
  days?: number;
  transactionId: string;
}): Promise<EsimOrderResponse> {
  const item: EsimOrderRequestItem = {
    packageCode: params.packageCode,
    count: 1,
    price: params.price,
  };

  if (params.days) {
    item.periodNum = params.days;
  }

  const body: EsimOrderRequest = {
    transactionId: params.transactionId,
    packageInfoList: [item],
  };

  const response = await esimFetch<EsimOrderResponse>(
    '/api/v1/open/esim/order',
    body
  );

  if (!response.success) {
    console.error(`[eSIM Access] Order error:`, response.errorMsg || 'Unknown error');
    throw new Error(response.errorMsg || 'Failed to create eSIM order');
  }

  return response;
}

export async function queryOrderStatus(orderNo: string): Promise<EsimOrderQueryResponse> {
  const response = await esimFetch<EsimOrderQueryResponse>(
    '/api/v1/open/esim/query',
    {
      orderNo,
      pager: { pageNum: 1, pageSize: 10 },
    }
  );

  console.log(`[eSIM Access] Query response for ${orderNo}:`, JSON.stringify(response));

  return response;
}
