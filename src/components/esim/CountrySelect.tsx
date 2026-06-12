'use client';

/**
 * CountrySelect - Country dropdown with flag + name.
 */
import SearchableSelect from '@/components/ui/SearchableSelect';
import { countries } from '@/data/countries';
import type { SelectOption } from '@/components/ui/SearchableSelect';

interface CountrySelectProps {
  value: string | null;
  onChange: (countryCode: string) => void;
}

const countryOptions: SelectOption[] = countries.map(c => ({
  value: c.iso2,
  label: `${c.flag} ${c.name}`,
  searchText: `${c.name} ${c.iso2}`,
  renderLabel: (
    <span className="flex items-center gap-2">
      <span className="text-lg">{c.flag}</span>
      <span>{c.name}</span>
    </span>
  ),
}));

export default function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Destination Country
      </label>
      <SearchableSelect
        id="country-select"
        options={countryOptions}
        value={value}
        onChange={onChange}
        placeholder="Select a country"
        searchPlaceholder="Search countries..."
      />
    </div>
  );
}
