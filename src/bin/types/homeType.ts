import type { LucideIcon } from "lucide-react";

export type ColorVariant = {
  label: string;
  hex: string;
};

export interface Product {
  id: string;
  title: string;
  slug?: string;
  price: number;
  imageUrl: string;
  categorySlugs: string[];
  rating?: number;
  outOfStock?: boolean;

  description?: string;
  longDescription?: string;
  images?: string[];
  sizes?: string[];
  colors?: ColorVariant[];
  stock?: number;
  originalPrice?: number;
  isNew?: boolean;
  reviewCount?: number;
  sku?: string;
  tags?: string[];
  createdAt?: string;
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
  totalItems: number;
  totalPrice: number;
  isSyncing: boolean;
  error: string | null;

  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export interface FavoriteContextType {
  favorites: Product[];
  totalFavorites: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  clearFavorites: () => Promise<void>;
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
