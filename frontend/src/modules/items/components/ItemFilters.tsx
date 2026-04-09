import { useState } from 'react';

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
      <input
        type="text"
        placeholder="Category"
        value={filters.category}
        onChange={(e) => handleChange('category', e.target.value)}
        className="border p-2 rounded"
      />

      {/* CONDITION */}
      <select
        value={filters.condition}
        onChange={(e) => handleChange('condition', e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">All Conditions</option>
        <option value="NEW">NEW</option>
        <option value="USED">USED</option>
      </select>

      {/* DISTRICT */}
      <input
        type="text"
        placeholder="District"
        value={filters.district}
        onChange={(e) => handleChange('district', e.target.value)}
        className="border p-2 rounded"
      />

      {/* PROVINCE */}
      <input
        type="text"
        placeholder="Province"
        value={filters.province}
        onChange={(e) => handleChange('province', e.target.value)}
        className="border p-2 rounded"
      />
    </div>
  );
};

export default ItemFilters;