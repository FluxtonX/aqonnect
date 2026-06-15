'use client';

/**
 * EsimCheckoutCard - Main card orchestrating the checkout flow:
 * Country selection → Plan selection → Days (if per-day) → Checkout
 */
import { useState, useCallback } from 'react';
import CountrySelect from './CountrySelect';
import PlanSelect from './PlanSelect';
import DaySelector from './DaySelector';
import ErrorMessage from '@/components/ui/ErrorMessage';
import type { NormalizedPlan } from '@/lib/esim-access/types';

export default function EsimCheckoutCard() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [days, setDays] = useState(1);
  const [plans, setPlans] = useState<NormalizedPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const currentPlan = plans.find(p => p.packageCode === selectedPlan);

  // Calculate total price
  const getTotal = useCallback(() => {
    if (!currentPlan) return 0;
    if (currentPlan.isPerDay) {
      return (currentPlan.dailyPriceUSD || currentPlan.priceUSD) * days;
    }
    return currentPlan.priceUSD;
  }, [currentPlan, days]);

  // Fetch packages when country changes
  const handleCountryChange = useCallback(async (countryCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedPlan(null);
    setPlans([]);
    setPlansError(null);
    setCheckoutError(null);
    setDays(1);

    setPlansLoading(true);
    try {
      const res = await fetch(`/api/esim/packages?countryCode=${countryCode}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load packages');
      }

      setPlans(data.plans || []);
      if (data.plans?.length === 0) {
        setPlansError('No eSIM plans available for this destination.');
      }
    } catch (err) {
      setPlansError(err instanceof Error ? err.message : 'Unable to load packages. Please try again.');
    } finally {
      setPlansLoading(false);
    }
  }, []);

  // Handle plan selection
  const handlePlanChange = useCallback((packageCode: string) => {
    setSelectedPlan(packageCode);
    setDays(1);
    setCheckoutError(null);
  }, []);

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    if (!selectedCountry || !selectedPlan || !currentPlan) return;

    setCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const body: { countryCode: string; packageCode: string; days?: number } = {
        countryCode: selectedCountry,
        packageCode: selectedPlan,
      };

      if (currentPlan.isPerDay) {
        body.days = days;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Checkout could not be started.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Checkout could not be started.');
    } finally {
      setCheckoutLoading(false);
    }
  }, [selectedCountry, selectedPlan, currentPlan, days]);

  const total = getTotal();
  const isReadyToCheckout = selectedCountry && selectedPlan && currentPlan && (!currentPlan.isPerDay || days >= 1);

  // Button text
  let buttonText = 'Continue';
  if (isReadyToCheckout && total > 0) {
    buttonText = `Continue to Pay $${total.toFixed(2)}`;
  }
  if (checkoutLoading) {
    buttonText = 'Preparing checkout...';
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible">
        {/* Header */}
        <div className="px-6 pt-7 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Select Your eSIM</h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose your destination to view available data plans
          </p>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-5">
          {/* Country */}
          <CountrySelect
            value={selectedCountry}
            onChange={handleCountryChange}
          />

          {/* Plans */}
          {selectedCountry && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <PlanSelect
                plans={plans}
                value={selectedPlan}
                onChange={handlePlanChange}
                loading={plansLoading}
                disabled={!selectedCountry}
              />
            </div>
          )}

          {/* Plans error */}
          {plansError && (
            <ErrorMessage
              message={plansError}
              onRetry={selectedCountry ? () => handleCountryChange(selectedCountry) : undefined}
            />
          )}

          {/* Days selector */}
          {currentPlan?.isPerDay && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <DaySelector
                days={days}
                onChange={setDays}
                dailyPrice={currentPlan.dailyPriceUSD || currentPlan.priceUSD}
                minDays={currentPlan.minDays || 1}
                maxDays={currentPlan.maxDays || 30}
              />
            </div>
          )}

          {/* Fixed plan price summary */}
          {currentPlan && !currentPlan.isPerDay && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-amber-50 rounded-xl animate-in fade-in duration-300">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold" style={{ color: '#D9A514' }}>
                ${currentPlan.priceUSD.toFixed(2)}
              </span>
            </div>
          )}

          {/* Checkout error */}
          {checkoutError && (
            <ErrorMessage message={checkoutError} />
          )}
        </div>

        {/* CTA Button */}
        <div className="px-6 pb-7">
          <button
            id="checkout-button"
            onClick={handleCheckout}
            disabled={!isReadyToCheckout || checkoutLoading}
            className={`
              w-full py-3.5 rounded-xl text-base font-semibold
              transition-all duration-200 flex items-center justify-center gap-2
              ${isReadyToCheckout && !checkoutLoading
                ? 'text-white shadow-md hover:shadow-lg active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
            style={isReadyToCheckout && !checkoutLoading ? {
              background: 'linear-gradient(135deg, #D9A514 0%, #E0AA17 50%, #C49412 100%)',
            } : undefined}
          >
            {checkoutLoading && (
              <span className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin" style={{ borderTopColor: 'white' }} />
            )}
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
