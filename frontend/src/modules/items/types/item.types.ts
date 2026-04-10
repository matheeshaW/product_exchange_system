// ITEM
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  ownerId: string;
  status: 'AVAILABLE' | 'SWAPPED';
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
  images?: string[]; 
}