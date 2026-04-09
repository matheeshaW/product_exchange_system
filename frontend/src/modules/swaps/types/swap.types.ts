export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface SwapItemSummary {
  id: string;
  title: string;
}

export interface Swap {
  id: string;
  requesterId: string;
  ownerId: string;
  requestedItemId: string;
  offeredItemId: string | null;
  status: SwapStatus;
  isDonation: boolean;
  requestedItem: SwapItemSummary | null;
  offeredItem: SwapItemSummary | null;
}

export interface SwapContact {
  requester: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
  owner: {
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}
