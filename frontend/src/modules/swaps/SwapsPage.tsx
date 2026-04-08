import { useNavigate } from 'react-router-dom';
import SwapCard from './components/SwapCard';
import { useSwapContact } from './hooks/use-swap-contact';
import { useSwaps } from './hooks/use-swaps';

const SwapsPage = () => {
  const navigate = useNavigate();
  const {
    contactsBySwapId,
    loadingSwapId,
    error: contactError,
    loadContact,
  } = useSwapContact();
  const {
    loading,
    error,
    incoming,
    outgoing,
    updateStatus,
  } = useSwaps();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Swaps</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {contactError && <p className="mb-4 text-sm text-red-600">{contactError}</p>}

      <h2 className="text-xl font-semibold mt-4 mb-2">
        Incoming Requests
      </h2>

      {incoming.length === 0 && (
        <p className="text-sm text-gray-500 mb-4">No incoming requests.</p>
      )}

      {incoming.map((swap) => (
        <SwapCard
          key={swap.id}
          swap={swap}
          showActions
          onAccept={(id) => updateStatus(id, 'ACCEPTED')}
          onReject={(id) => updateStatus(id, 'REJECTED')}
          onOpenChat={(id) => navigate(`/chat/${id}`)}
          onViewContact={loadContact}
          contact={contactsBySwapId[swap.id] || null}
          loadingContact={loadingSwapId === swap.id}
        />
      ))}

      <h2 className="text-xl font-semibold mt-4 mb-2">
        My Requests
      </h2>

      {outgoing.length === 0 && (
        <p className="text-sm text-gray-500 mb-4">No outgoing requests.</p>
      )}

      {outgoing.map((swap) => (
        <SwapCard
          key={swap.id}
          swap={swap}
          onOpenChat={(id) => navigate(`/chat/${id}`)}
          onViewContact={loadContact}
          contact={contactsBySwapId[swap.id] || null}
          loadingContact={loadingSwapId === swap.id}
        />
      ))}
    </div>
  );
};

export default SwapsPage;