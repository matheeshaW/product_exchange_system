import { Link } from 'react-router-dom';
import SwapStatusBadge from './SwapStatusBadge';
import type { Swap, SwapContact } from '../types/swap.types';

interface Props {
  swap: Swap;
  showActions?: boolean;
  onAccept?: (swapId: string) => void;
  onReject?: (swapId: string) => void;
  onOpenChat: (swapId: string) => void;
  onViewContact?: (swapId: string) => void;
  contact?: SwapContact | null;
  loadingContact?: boolean;
}

const SwapCard = ({
  swap,
  showActions = false,
  onAccept,
  onReject,
  onOpenChat,
  onViewContact,
  contact = null,
  loadingContact = false,
}: Props) => {
  return (
    <article className="mb-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Type: {swap.isDonation ? 'Donation' : 'Swap'}
        </p>
        <SwapStatusBadge status={swap.status} />
      </div>

      <p className="text-sm text-slate-700">
        Requested Item:{' '}
        {swap.requestedItem ? (
          <Link
            to={`/items/${swap.requestedItem.id}`}
            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
          >
            {swap.requestedItem.title}
          </Link>
        ) : (
          'Item unavailable'
        )}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        Offered Item:{' '}
        {swap.isDonation ? (
          'Donation (no return item)'
        ) : swap.offeredItem ? (
          <Link
            to={`/items/${swap.offeredItem.id}`}
            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:text-slate-700"
          >
            {swap.offeredItem.title}
          </Link>
        ) : (
          'Item unavailable'
        )}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onOpenChat(swap.id)}
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white transition hover:bg-slate-800"
        >
          Open Chat
        </button>

        {showActions && swap.status === 'PENDING' && (
          <>
            <button
              onClick={() => onAccept?.(swap.id)}
              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white transition hover:bg-emerald-700"
            >
              Accept
            </button>

            <button
              onClick={() => onReject?.(swap.id)}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white transition hover:bg-rose-700"
            >
              Reject
            </button>
          </>
        )}

        {swap.status === 'ACCEPTED' && (
          <button
            onClick={() => onViewContact?.(swap.id)}
            className="rounded-lg bg-slate-600 px-3 py-1.5 text-sm text-white transition hover:bg-slate-700"
          >
            {loadingContact ? 'Loading Contacts...' : 'View Contacts'}
          </button>
        )}
      </div>

      {contact && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          <p className="mb-1 font-semibold text-slate-900">Contact Details</p>
          <p>
            Requester: {contact.requester.name || 'N/A'} ({contact.requester.email || 'N/A'})
            {contact.requester.phone ? ` - ${contact.requester.phone}` : ''}
          </p>
          <p>
            Owner: {contact.owner.name || 'N/A'} ({contact.owner.email || 'N/A'})
            {contact.owner.phone ? ` - ${contact.owner.phone}` : ''}
          </p>
        </div>
      )}
    </article>
  );
};

export default SwapCard;
