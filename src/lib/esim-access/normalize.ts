/**
 * Normalize raw eSIM Access packages into frontend-friendly plans.
 */
import { countries } from '@/data/countries';
import type { EsimPackageRaw, NormalizedPlan } from './types';

function formatDataAmount(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) {
    const gb = mb / 1024;
    return gb % 1 === 0 ? `${gb}GB` : `${gb.toFixed(1)}GB`;
  }
  return `${Math.round(mb)}MB`;
}

function getCountryName(locationCode: string): string {
  const country = countries.find(c => c.iso2 === locationCode);
  return country?.name || locationCode;
}

/**
 * Convert raw API price (in cents, e.g. 7000 = $70.00) to dollars.
 * The eSIM Access API returns price as an integer in the smallest unit.
 */
function convertPrice(rawPrice: number): number {
  return Math.round(rawPrice) / 100;
}

export function normalizePackage(raw: EsimPackageRaw): NormalizedPlan {
  const isPerDay = raw.priceType === 'daily';
  const dataAmount = formatDataAmount(raw.volume);
  const countryName = getCountryName(raw.locationCode);
  const priceUSD = convertPrice(raw.price);

  let displayName: string;
  if (isPerDay) {
    displayName = `${dataAmount}/Day`;
  } else {
    displayName = `${dataAmount} - ${raw.duration} Days`;
  }

  return {
    id: raw.packageCode,
    packageCode: raw.packageCode,
    slug: raw.slug,
    countryCode: raw.locationCode,
    countryName,
    name: raw.name || displayName,
    displayName,
    dataAmount,
    validityDays: isPerDay ? null : raw.duration,
    isPerDay,
    priceUSD,
    dailyPriceUSD: isPerDay ? priceUSD : undefined,
    currency: 'USD',
    minDays: raw.minDays,
    maxDays: raw.maxDays,
    raw,
  };
}

export function normalizePackages(rawPackages: EsimPackageRaw[]): NormalizedPlan[] {
  return rawPackages.map(normalizePackage);
}
