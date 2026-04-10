import { useEffect, useState } from 'react';
import api from '../../common/api/axios.instance';
import { getApiErrorMessage } from '../../common/api/error-message';
import type { Item } from './types/item.types';
import type { ApiResponse } from '../../common/api/api.types';
import ItemCard from './components/ItemCard';
import ItemFilters from './components/ItemFilters';

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    condition: '',
    district: '',
    province: '',
  });

  const fetchItems = async (filtersData = filters) => {
    try {
      setError(null);
      const query = new URLSearchParams();

      Object.entries(filtersData).forEach(([key, value]) => {
        if (value) {
          query.append(key, value);
        }
      });

      const res = await api.get<ApiResponse<Item[]>>(
        `/items?${query.toString()}`
      );

      setItems(res.data.data);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Failed to fetch items'));
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchItems(newFilters);
  };

  if (loading) {
    return <div className="p-4">Loading items...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Available Items
      </h1>
      <ItemFilters onFilterChange={handleFilterChange} />

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;