import type { SwapStatus } from '../types/swap.types';

interface Props {
  status: SwapStatus;
}

const STATUS_CLASS_MAP: Record<SwapStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const SwapStatusBadge = ({ status }: Props) => {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${STATUS_CLASS_MAP[status]}`}
    >
      {status}
    </span>
  );
};

export default SwapStatusBadge;
