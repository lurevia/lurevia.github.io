/**
 * Contrats de données renvoyés par l'API Lurevia.
 *
 * Ces types décrivent le format « fil » (wire format) exact du backend.
 * Ils sont volontairement séparés des types métier du frontend
 * (`bin/types/*`) : les mappers de `api/mappers.ts` font la traduction,
 * ce qui isole l'interface d'un changement de contrat côté serveur.
 */

export type PaginationDto = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PaginatedDto<T> = {
  items: T[];
  pagination: PaginationDto;
};

export type UserDto = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  primaryIdentifier: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

export type AuthSessionDto = {
  user: UserDto;
  accessToken: string;
};

export type ProductDto = {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string | null;
  longDescription: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  outOfStock: boolean;
  isNew: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
  images: string[];
  colors: { label: string; hex: string }[];
  sizes: string[];
  categorySlugs: string[];
  createdAt: string;
};

export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  bannerUrl: string;
  iconName: string;
};

export type CartDto = {
  items: { product: ProductDto; quantity: number }[];
  totalItems: number;
  totalPrice: number;
};

export type AddressDto = {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  notes: string | null;
  isDefault: boolean;
  createdAt: string;
};

export type OrderItemDto = {
  productId: string;
  title: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
};

export type TransactionDto = {
  id: string;
  orderId: string;
  amount: number;
  method: "mobile-money" | "card" | "cash";
  status: string;
  date: string;
};

export type OrderDto = {
  id: string;
  userId: string;
  status: string;
  paymentMethod: "mobile-money" | "card" | "cash";
  shipping: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    region: string;
    notes?: string;
  };
  items: OrderItemDto[];
  transactions: TransactionDto[];
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
};

export type ReviewDto = {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RatingDto = {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

export type EligibilityDto = {
  canReview: boolean;
  reason: "eligible" | "already_reviewed" | "not_purchased" | "waiting" | "not_logged_in";
  availableAt?: string;
  daysRemaining?: number;
};

export type FeedbackDto = {
  id: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  overallRating: number;
  criteria?: Record<string, number>;
  category: "delivery" | "payment" | "support" | "website" | "other";
  comment: string;
  teamResponse?: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationDto = {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string;
  imageUrl?: string;
  read: boolean;
  createdAt: string;
};

export type SearchSuggestionDto = {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
};
