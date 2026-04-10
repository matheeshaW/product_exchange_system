export interface SelectOption {
  value: string;
  label: string;
}

export const ITEM_CONDITIONS: SelectOption[] = [
  { value: 'NEW', label: 'New' },
  { value: 'LIKE_NEW', label: 'Like New' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'USED', label: 'Used' },
];

export const ITEM_CATEGORIES: SelectOption[] = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'CLOTHING', label: 'Clothing' },
  { value: 'BOOKS', label: 'Books' },
  { value: 'SPORTS', label: 'Sports & Outdoors' },
  { value: 'KITCHEN', label: 'Kitchen & Dining' },
  { value: 'HOME_DECOR', label: 'Home & Decor' },
  { value: 'TOYS', label: 'Toys & Games' },
  { value: 'OTHER', label: 'Other' },
];

export const SRI_LANKAN_PROVINCES: SelectOption[] = [
  { value: 'Western', label: 'Western' },
  { value: 'Central', label: 'Central' },
  { value: 'Southern', label: 'Southern' },
  { value: 'Northern', label: 'Northern' },
  { value: 'Eastern', label: 'Eastern' },
  { value: 'North Western', label: 'North Western' },
  { value: 'North Central', label: 'North Central' },
  { value: 'Uva', label: 'Uva' },
  { value: 'Sabaragamuwa', label: 'Sabaragamuwa' },
];

export const SRI_LANKAN_DISTRICTS_BY_PROVINCE: Record<string, SelectOption[]> = {
  Western: [
    { value: 'Colombo', label: 'Colombo' },
    { value: 'Gampaha', label: 'Gampaha' },
    { value: 'Kalutara', label: 'Kalutara' },
  ],
  Central: [
    { value: 'Kandy', label: 'Kandy' },
    { value: 'Matale', label: 'Matale' },
    { value: 'Nuwara Eliya', label: 'Nuwara Eliya' },
  ],
  Southern: [
    { value: 'Galle', label: 'Galle' },
    { value: 'Matara', label: 'Matara' },
    { value: 'Hambantota', label: 'Hambantota' },
  ],
  Northern: [
    { value: 'Jaffna', label: 'Jaffna' },
    { value: 'Kilinochchi', label: 'Kilinochchi' },
    { value: 'Mannar', label: 'Mannar' },
    { value: 'Mullaitivu', label: 'Mullaitivu' },
    { value: 'Vavuniya', label: 'Vavuniya' },
  ],
  Eastern: [
    { value: 'Trincomalee', label: 'Trincomalee' },
    { value: 'Batticaloa', label: 'Batticaloa' },
    { value: 'Ampara', label: 'Ampara' },
  ],
  'North Western': [
    { value: 'Kurunegala', label: 'Kurunegala' },
    { value: 'Puttalam', label: 'Puttalam' },
  ],
  'North Central': [
    { value: 'Anuradhapura', label: 'Anuradhapura' },
    { value: 'Polonnaruwa', label: 'Polonnaruwa' },
  ],
  Uva: [
    { value: 'Badulla', label: 'Badulla' },
    { value: 'Monaragala', label: 'Monaragala' },
  ],
  Sabaragamuwa: [
    { value: 'Ratnapura', label: 'Ratnapura' },
    { value: 'Kegalle', label: 'Kegalle' },
  ],
};
