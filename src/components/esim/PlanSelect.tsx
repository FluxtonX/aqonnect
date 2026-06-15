'use client';

/**
 * PlanSelect - eSIM plan dropdown with name left, price right.
 */
import SearchableSelect from '@/components/ui/SearchableSelect';
import type { SelectOption } from '@/components/ui/SearchableSelect';
import type { NormalizedPlan } from '@/lib/esim-access/types';

interface PlanSelectProps {
  plans: NormalizedPlan[];
  value: string | null;
  onChange: (packageCode: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PlanSelect({ plans, value, onChange, loading, disabled }: PlanSelectProps) {
  const options: SelectOption[] = plans.map(plan => ({
    value: plan.packageCode,
    label: plan.displayName,
    searchText: `${plan.displayName} ${plan.dataAmount} ${plan.name}`,
    renderLabel: (
      <span className="flex items-center justify-between w-full">
        <span className="text-gray-900">{plan.displayName}</span>
        <span className="text-sm text-gray-900 ml-2 flex-shrink-0">
          ${plan.priceUSD.toFixed(2)}
          {plan.isPerDay ? '/day' : ''}
        </span>
      </span>
    ),
  }));

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Data Plan
      </label>
      <SearchableSelect
        id="plan-select"
        options={options}
        value={value}
        onChange={onChange}
        placeholder={loading ? 'Loading plans...' : 'Select a Plan...'}
        searchPlaceholder="Search plans..."
        loading={loading}
        disabled={disabled || loading}
      />
    </div>
  );
}
