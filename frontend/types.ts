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

export type BlogCategory = 'Home Buying Guides' | 'Hassle-Free Renting' | 'Legal & Documentation' | 'Investment Insights' | 'Zero Commission';

export interface BlogAuthor {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
}

export interface BlogPostSection {
  heading?: string;
  content: string;
  paragraphs?: string[];
  callout?: string;
  bulletPoints?: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: BlogAuthor;
  date: string;
  readTime: string;
  image: string;
  isFeatured?: boolean;
  tags: string[];
  sections: BlogPostSection[];
  keywords?: string;
}

