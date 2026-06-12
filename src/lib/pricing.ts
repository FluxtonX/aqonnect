/**
 * Pricing utility for calculating customer-facing prices.
 * Reads PRICE_MARKUP_PERCENT and PRICE_FIXED_FEE_USD (or legacy PRICE_FIXED_FEE_EUR) from environment.
 */

interface PriceInput {
  providerPrice: number;
  isPerDay: boolean;
  days?: number;
}

interface PriceResult {
  total: number;        // USD with 2 decimals
  stripeAmount: number; // integer cents for Stripe
}

export function calculateCustomerPrice({ providerPrice, isPerDay, days }: PriceInput): PriceResult {
  const markupPercent = parseFloat(process.env.PRICE_MARKUP_PERCENT || '0');
  const fixedFee = parseFloat(process.env.PRICE_FIXED_FEE_USD || process.env.PRICE_FIXED_FEE_EUR || '0');

  let basePrice: number;

  if (isPerDay && days && days > 0) {
    basePrice = providerPrice * days;
  } else {
    basePrice = providerPrice;
  }

  const markup = basePrice * (markupPercent / 100);
  const total = Math.round((basePrice + markup + fixedFee) * 100) / 100;
  const stripeAmount = Math.round(total * 100);

  return { total, stripeAmount };
}
