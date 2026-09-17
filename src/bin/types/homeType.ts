import type { LucideIcon } from "lucide-react";


export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type ColorVariant = {
  label: string;
  hex: string;
};

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  categorySlugs: string[];
  rating?: number;
  isFavorite?: boolean;
  outOfStock?: boolean;

  description?: string;
  longDescription?: string;
  images?: string[];
  sizes?: string[];
  colors?: ColorVariant[];
  stock?: number;
  originalPrice?: number;
  isNew?: boolean;
  reviews?: Review[];
  reviewCount?: number;
  sku?: string;
  tags?: string[];
}


export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  bannerUrl: string;
  icon: LucideIcon;
  description: string;
};


export type Feature = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type WhyUsItem = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
};


export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void; 
  removeFromCart: (productId: string) => void;
  totalItems: number;
  totalPrice: number;
}

export interface FavoriteContextType {
  favorites: Product[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: Product) => void;
  totalFavorites: number;
}

export type FooterLink = {
  label: string;
  to: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  path: string;
  viewBox: string;
  isStroke?: boolean;
};