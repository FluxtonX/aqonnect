/**
 * Formatting utilities for display.
 */

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatDataAmount(mb: number): string {
  if (mb >= 1024) {
    const gb = mb / 1024;
    return gb % 1 === 0 ? `${gb}GB` : `${gb.toFixed(1)}GB`;
  }
  return `${mb}MB`;
}

export function formatPlanName(
  countryName: string,
  dataAmount: string,
  validityDays: number | null,
  isPerDay: boolean
): string {
  if (isPerDay) {
    return `${countryName} ${dataAmount}/Day`;
  }
  if (validityDays) {
    return `${countryName} ${dataAmount} ${validityDays}Days`;
  }
  return `${countryName} ${dataAmount}`;
}
