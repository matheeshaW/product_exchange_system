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
    <div className="border p-3 rounded mb-2">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Type: {swap.isDonation ? 'Donation' : 'Swap'}
        </p>
        <SwapStatusBadge status={swap.status} />
      </div>

      <p>
        Requested Item:{' '}
        {swap.requestedItem ? (
          <Link
            to={`/items/${swap.requestedItem.id}`}
            className="text-blue-600 underline hover:text-blue-700"
          >
            {swap.requestedItem.title}
          </Link>
        ) : (
          'Item unavailable'
        )}
      </p>

      <p>
        Offered Item:{' '}
        {swap.isDonation ? (
          'Donation (no return item)'
        ) : swap.offeredItem ? (
          <Link
            to={`/items/${swap.offeredItem.id}`}
            className="text-blue-600 underline hover:text-blue-700"
          >
            {swap.offeredItem.title}
          </Link>
        ) : (
          'Item unavailable'
        )}
      </p>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onOpenChat(swap.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Open Chat
        </button>

        {showActions && swap.status === 'PENDING' && (
          <>
            <button
              onClick={() => onAccept?.(swap.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Accept
            </button>

            <button
              onClick={() => onReject?.(swap.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </>
        )}

        {swap.status === 'ACCEPTED' && (
          <button
            onClick={() => onViewContact?.(swap.id)}
            className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
          >
            {loadingContact ? 'Loading Contacts...' : 'View Contacts'}
          </button>
        )}
      </div>

      {contact && (
        <div className="mt-3 rounded bg-gray-50 p-3 text-sm">
          <p className="font-semibold mb-1">Contact Details</p>
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
    </div>
  );
};

export default SwapCard;
