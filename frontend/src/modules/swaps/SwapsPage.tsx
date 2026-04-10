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
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Activity</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Swap Center</h1>
        <p className="mt-1 text-sm text-slate-600">
          Review incoming offers, manage your requests, and connect through chat when accepted.
        </p>
      </section>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {contactError && <p className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{contactError}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Incoming Requests</h2>

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
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-slate-900">My Requests</h2>

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
      </section>
    </div>
  );
};

export default SwapsPage;