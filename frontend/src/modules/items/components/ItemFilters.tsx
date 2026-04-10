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

  return (
    <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-5 gap-2">
      
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        className="border p-2 rounded"
      />

      {/* CATEGORY */}
      <select
        value={filters.category}
        onChange={(e) => handleChange('category', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Categories</option>
        {ITEM_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      {/* CONDITION */}
      <select
        value={filters.condition}
        onChange={(e) => handleChange('condition', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Conditions</option>
        {ITEM_CONDITIONS.map((condition) => (
          <option key={condition.value} value={condition.value}>
            {condition.label}
          </option>
        ))}
      </select>

      {/* PROVINCE */}
      <select
        value={filters.province}
        onChange={(e) => handleProvinceChange(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Provinces</option>
        {SRI_LANKAN_PROVINCES.map((province) => (
          <option key={province.value} value={province.value}>
            {province.label}
          </option>
        ))}
      </select>

      {/* DISTRICT */}
      <select
        value={filters.district}
        onChange={(e) => handleChange('district', e.target.value)}
        className="border p-2 rounded"
        disabled={!filters.province}
      >
        <option value="">All Districts</option>
        {districtOptions.map((district) => (
          <option key={district.value} value={district.value}>
            {district.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemFilters;