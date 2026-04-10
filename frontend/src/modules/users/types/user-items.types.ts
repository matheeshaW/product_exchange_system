import type { Item } from '../../items/types/item.types';

export interface UpdateMyItemPayload {
  title?: string;
  description?: string;
  category?: string;
  condition?: string;
}

export type MyItem = Item;
