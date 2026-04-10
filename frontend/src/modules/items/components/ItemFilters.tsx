import { useState } from 'react';
import {
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  SRI_LANKAN_DISTRICTS_BY_PROVINCE,
  SRI_LANKAN_PROVINCES,
} from '../../../utils/constants';

interface Filters {
  search: string;
  category: string;
  condition: string;
  district: string;
  province: string;
}

interface Props {
  onFilterChange: (filters: Filters) => void;
}

const ItemFilters = ({ onFilterChange }: Props) => {
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    condition: '',
    district: '',
    province: '',
  });

  const handleChange = (key: keyof Filters, value: string) => {
    const updated = { ...filters, [key]: value };

    setFilters(updated);
    onFilterChange(updated); //  send to parent
  };

  const handleProvinceChange = (value: string) => {
    const updated = {
      ...filters,
      province: value,
      district: '',
    };

    setFilters(updated);
    onFilterChange(updated);
  };

  const districtOptions = filters.province
    ? SRI_LANKAN_DISTRICTS_BY_PROVINCE[filters.province] || []
    : [];

  const handleReset = () => {
    const resetFilters: Filters = {
      search: '',
      category: '',
      condition: '',
      district: '',
      province: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-800">Filter Items</h2>
        <button
          onClick={handleReset}
          type="button"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-500">Search</span>
          <input
            type="text"
            placeholder="Title or keyword"
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-500">Category</span>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            {ITEM_CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-500">Condition</span>
          <select
            value={filters.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none"
          >
            <option value="">All Conditions</option>
            {ITEM_CONDITIONS.map((condition) => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-500">Province</span>
          <select
            value={filters.province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none"
          >
            <option value="">All Provinces</option>
            {SRI_LANKAN_PROVINCES.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-500">District</span>
          <select
            value={filters.district}
            onChange={(e) => handleChange('district', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-slate-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={!filters.province}
          >
            <option value="">All Districts</option>
            {districtOptions.map((district) => (
              <option key={district.value} value={district.value}>
                {district.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
};

export default ItemFilters;