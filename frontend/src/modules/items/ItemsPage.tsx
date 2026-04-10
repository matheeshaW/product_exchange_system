import { useEffect, useState } from 'react';
import api from '../../common/api/axios.instance';
import { getApiErrorMessage } from '../../common/api/error-message';
import type { Item } from './types/item.types';
import type { ApiResponse } from '../../common/api/api.types';
import ItemCard from './components/ItemCard';
import ItemFilters from './components/ItemFilters';
import EmptyState from '../../common/components/EmptyState';

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
    return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">Loading items...</div>;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Marketplace</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Discover Items</h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse available listings and request swaps or donations in a few clicks.
        </p>
      </section>

      <ItemFilters onFilterChange={handleFilterChange} />

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
      )}

      {items.length === 0 ? (
        <EmptyState message="No items match your filters yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsPage;