// ITEM
export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  ownerId: string;
  createdAt: string;
  images?: string[]; 
}