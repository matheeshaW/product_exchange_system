import { useNavigate } from 'react-router-dom';
import EmptyState from '../../common/components/EmptyState';
import Spinner from '../../common/components/Spinner';
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

  if (loading) return <Spinner />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Swaps</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {contactError && <p className="mb-4 text-sm text-red-600">{contactError}</p>}

      <h2 className="text-xl font-semibold mt-4 mb-2">
        Incoming Requests
      </h2>

      {incoming.length === 0 && (
        <EmptyState message="No incoming requests" />
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
        <EmptyState message="No outgoing requests" />
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