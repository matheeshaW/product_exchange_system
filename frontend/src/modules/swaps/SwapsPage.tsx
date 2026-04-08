import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../common/api/axios.instance';
import type { ApiResponse } from '../../common/api/api.types';
import { AuthContext } from '../../context/AuthContext';

interface Swap {
  id: string;
  requesterId: string;
  ownerId: string;
  requestedItemId: string;
  offeredItemId: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  isDonation: boolean;
  requestedItem: {
    id: string;
    title: string;
  } | null;
  offeredItem: {
    id: string;
    title: string;
  } | null;
}

const SwapsPage = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = auth?.user?.id;

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const res = await api.get<ApiResponse<Swap[]>>('/swaps');

        setSwaps(res.data.data);
      } catch (err) {
        console.error('Failed to fetch swaps');
        setError('Failed to load swaps');
      } finally {
        setLoading(false);
      }
    };

    fetchSwaps();
  }, []);

  const updateStatus = async (
    id: string,
    status: 'ACCEPTED' | 'REJECTED',
  ) => {
    try {
      await api.patch(`/swaps/${id}`, { status });

      setSwaps((prev) =>
        prev.map((swap) =>
          swap.id === id ? { ...swap, status } : swap,
        ),
      );
    } catch (err) {
      console.error('Failed to update swap');
      setError('Failed to update swap');
    }
  };

  const incoming = swaps.filter((swap) => swap.ownerId === userId);
  const outgoing = swaps.filter((swap) => swap.requesterId === userId);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Swaps</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <h2 className="text-xl font-semibold mt-4 mb-2">
        Incoming Requests
      </h2>

      {incoming.length === 0 && (
        <p className="text-sm text-gray-500 mb-4">No incoming requests.</p>
      )}

      {incoming.map((swap) => (
        <div
          key={swap.id}
          className="border p-3 rounded mb-2"
        >
          <p>Status: {swap.status}</p>
          <p>Type: {swap.isDonation ? 'Donation' : 'Swap'}</p>
          <p>Requested Item: {swap.requestedItem?.title || 'Item unavailable'}</p>
          <p>
            Offered Item:{' '}
            {swap.isDonation
              ? 'Donation (no return item)'
              : (swap.offeredItem?.title || 'Item unavailable')}
          </p>

          <button
            onClick={() => navigate(`/chat/${swap.id}`)}
            className="bg-blue-500 text-white px-2 py-1 rounded mt-2 mr-2"
          >
            Open Chat
          </button>

          {swap.status === 'PENDING' && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => updateStatus(swap.id, 'ACCEPTED')}
                className="bg-green-500 text-white px-2 py-1 rounded"
              >
                Accept
              </button>

              <button
                onClick={() => updateStatus(swap.id, 'REJECTED')}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}

      <h2 className="text-xl font-semibold mt-4 mb-2">
        My Requests
      </h2>

      {outgoing.length === 0 && (
        <p className="text-sm text-gray-500 mb-4">No outgoing requests.</p>
      )}

      {outgoing.map((swap) => (
        <div
          key={swap.id}
          className="border p-3 rounded mb-2"
        >
          <p>Status: {swap.status}</p>
          <p>Type: {swap.isDonation ? 'Donation' : 'Swap'}</p>
          <p>Requested Item: {swap.requestedItem?.title || 'Item unavailable'}</p>
          <p>
            Offered Item:{' '}
            {swap.isDonation
              ? 'Donation (no return item)'
              : (swap.offeredItem?.title || 'Item unavailable')}
          </p>

          <button
            onClick={() => navigate(`/chat/${swap.id}`)}
            className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
          >
            Open Chat
          </button>
        </div>
      ))}
    </div>
  );
};

export default SwapsPage;