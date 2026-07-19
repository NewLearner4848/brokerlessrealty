export interface Property {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  savingsText?: string;
  address: string;
  city: string;
  type: 'House' | 'Apartment' | 'Condo' | 'Land' | 'Villa' | 'Heritage House';
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  description: string;
  features: string[];
  images: string[];
  isFeatured?: boolean;
  created_at?: string;
}
