import type { Item } from '../../items/types/item.types';

export interface UpdateMyItemPayload {
  title?: string;
  description?: string;
  category?: string;
  condition?: string;
  keepImageUrls?: string[];
  newImages?: File[];
}

export type MyItem = Item;
