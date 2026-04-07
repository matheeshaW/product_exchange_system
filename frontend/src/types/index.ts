export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// USER
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
}

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

