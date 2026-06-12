'use client';

/**
 * DaySelector - Number of days input for per-day packages.
 */

interface DaySelectorProps {
  days: number;
  onChange: (days: number) => void;
  dailyPrice: number;
  minDays?: number;
  maxDays?: number;
}

export default function DaySelector({ days, onChange, dailyPrice, minDays = 1, maxDays = 30 }: DaySelectorProps) {
  const total = dailyPrice * days;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Number of Days
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(minDays, days - 1))}
          disabled={days <= minDays}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>

        <input
          type="number"
          id="day-selector"
          min={minDays}
          max={maxDays}
          value={days}
          onChange={e => {
            const val = parseInt(e.target.value) || minDays;
            onChange(Math.min(maxDays, Math.max(minDays, val)));
          }}
          className="w-20 text-center py-2 px-3 border border-gray-200 rounded-xl text-lg font-semibold text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={() => onChange(Math.min(maxDays, days + 1))}
          disabled={days >= maxDays}
          className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <span className="text-sm text-gray-500 ml-auto">
          {days} {days === 1 ? 'day' : 'days'}
        </span>
      </div>

      {/* Total price */}
      <div className="mt-3 flex items-center justify-between px-4 py-2.5 bg-amber-50 rounded-xl">
        <span className="text-sm text-gray-600">Total</span>
        <span className="text-lg font-bold" style={{ color: '#D9A514' }}>
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
