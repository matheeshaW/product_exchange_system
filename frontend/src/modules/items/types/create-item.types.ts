export interface ItemFormData {
  title: string;
  description: string;
  category: string;
  condition: string;
}

export interface CreateItemPayload extends ItemFormData {
  images: File[];
}

export interface CreateItemResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    description: string;
    category: string;
    condition: string;
    ownerId: string;
    images: string[];
    createdAt: string;
  };
}

export interface ItemCondition {
  value: string;
  label: string;
}

export interface ItemCategory {
  value: string;
  label: string;
}
