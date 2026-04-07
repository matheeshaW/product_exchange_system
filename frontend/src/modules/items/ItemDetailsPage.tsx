import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../common/api/axios.instance';
import type { Item } from './types/item.types';
import type { ApiResponse } from '../../common/api/api.types';

const ItemDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get<ApiResponse<Item[]>>('/items');

        const found = res.data.data.find((i) => i.id === id);

        setItem(found || null);
      } catch (err) {
        console.error('Failed to fetch item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;

  if (!item) return <div className="p-4">Item not found</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* IMAGE */}
      <img
        src={item.images?.[0] || 'https://via.placeholder.com/400'}
        alt={item.title}
        className="w-full h-80 object-cover rounded mb-4"
      />

      {/* DETAILS */}
      <h1 className="text-2xl font-bold mb-2">{item.title}</h1>

      <p className="text-gray-600 mb-2">
        {item.category} • {item.condition}
      </p>

      <p className="mb-4">{item.description}</p>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Request Swap
        </button>

        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Request Donation
        </button>
      </div>
    </div>
  );
};

export default ItemDetailsPage;