import { api } from "./http";
import { toFeedback, toOrder, toProduct } from "./mappers";
import type { FeedbackDto, OrderDto, ProductDto } from "./dto";
import type { Order } from "../bin/types/orderType";
import type { Product } from "../bin/types/homeType";
import type { ServiceFeedback } from "../bin/types/feedbackType";

export type SellerStats = {
  products: number;
  sales: number;
  revenue: number;
  pendingOrders: number;
  daily: { date: string; sales: number; revenue: number }[];
  topProducts: { id: string; title: string; unitsSold: number; imageUrl: string | null }[];
  feedbackCount: number;
  feedbackAverage: number;
  reviewCount: number;
  reviewAverage: number;
};

export type SellerProductInput = {
  title: string;
  sku: string;
  description?: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isNew?: boolean;
  tags: string[];
  categoryIds: string[];
  images: string[];
  colors: { label: string; hex: string }[];
  sizes: string[];
};

export type SellerContractInput = {
  type: "PERCENTAGE" | "MONTHLY_FIXED";
  value: number;
  storeName: string;
  storeDescription: string;
  storeLogoUrl?: string;
  storeCoverUrl?: string;
  storeCategoryId: string;
};

export type SellerStoreCategory = { id: string; name: string; slug: string };

export type SellerProfile = {
  id: string;
  storeName: string;
  description: string;
  logoUrl: string | null;
  coverUrl: string | null;
  storeCategoryId: string | null;
  storeCategory: SellerStoreCategory | null;
  productCount?: number;
};

export type PublicSeller = SellerProfile & { productCount: number };
export type PublicSellerDetails = SellerProfile & { products: Product[] };
type PublicSellerProfileDto = Omit<SellerProfile, "description" | "logoUrl"> & {
  description: string | null;
  logoUrl: string | null;
  products: ProductDto[];
};
type SellerPage<T> = { items: T[]; pagination?: { totalItems: number; totalPages: number; page: number } };

const unwrapPage = <T,>(value: SellerPage<T> | { products?: SellerPage<T>; orders?: SellerPage<T> }): SellerPage<T> => {
  if ("products" in value && value.products) return value.products;
  if ("orders" in value && value.orders) return value.orders;
  return value as SellerPage<T>;
};

const sellerOrderDto = (value: OrderDto & Record<string, unknown>): OrderDto => ({
  ...value,
  status: String(value.status).toLowerCase(),
  paymentMethod: String(value.paymentMethod).toLowerCase() as OrderDto["paymentMethod"],
  shipping: value.shipping ?? {
    fullName: String(value.shippingFullName ?? ""),
    phone: String(value.shippingPhone ?? ""),
    email: String(value.shippingEmail ?? ""),
    address: String(value.shippingAddress ?? ""),
    city: String(value.shippingCity ?? ""),
    region: String(value.shippingRegion ?? ""),
    notes: value.shippingNotes ? String(value.shippingNotes) : undefined,
  },
  items: (value.items ?? []).map((item: Record<string, unknown>) => ({
    productId: String(item.productId),
    title: String(item.title ?? (item.product as Record<string, unknown> | undefined)?.title ?? "Produit"),
    imageUrl: item.imageUrl ? String(item.imageUrl) : null,
    price: Number(item.price ?? item.priceSnapshot ?? 0),
    quantity: Number(item.quantity ?? 0),
  })),
});

export const sellerApi = {
  async apply(input: SellerContractInput): Promise<void> {
    await api.post("/seller/apply", input);
  },
  async profile(signal?: AbortSignal): Promise<SellerProfile> {
    const data = await api.get<{ profile: SellerProfile }>("/seller/profile", { signal });
    return data.profile;
  },
  async updateProfile(input: Omit<SellerProfile, "id" | "productCount">): Promise<SellerProfile> {
    const data = await api.patch<{ profile: SellerProfile }>("/seller/profile", {
      storeName: input.storeName,
      storeDescription: input.description,
      storeLogoUrl: input.logoUrl,
      storeCoverUrl: input.coverUrl,
      storeCategoryId: input.storeCategoryId,
    });
    return data.profile;
  },
  async publicProfiles(search = "", page = 1, limit = 12, signal?: AbortSignal) {
    const data = await api.get<SellerPage<PublicSeller>>("/seller/public", {
      auth: false,
      signal,
      query: { search: search || undefined, page, limit },
    });
    return {
      sellers: data.items ?? [],
      totalItems: data.pagination?.totalItems ?? 0,
      totalPages: data.pagination?.totalPages ?? 1,
      page: data.pagination?.page ?? 1,
    };
  },
  async publicProfile(id: string, signal?: AbortSignal): Promise<PublicSellerDetails> {
    const data = await api.get<PublicSellerProfileDto>(`/seller/public/${encodeURIComponent(id)}`, {
      auth: false,
      signal,
    });
    return {
      ...data,
      description: data.description ?? "",
      logoUrl: data.logoUrl ?? null,
      products: (data.products ?? []).map(toProduct),
    };
  },
  async stats(signal?: AbortSignal): Promise<SellerStats> {
    const data = await api.get<{ stats: SellerStats }>("/seller/stats", { signal });
    return data.stats;
  },
  async feedback(signal?: AbortSignal): Promise<ServiceFeedback[]> {
    const data = await api.get<{ feedback: FeedbackDto[] }>("/seller/feedback", { signal });
    return (data.feedback ?? []).map(toFeedback);
  },
  async products(page = 1, limit = 50, signal?: AbortSignal): Promise<Product[]> {
    const data = await api.get<{ products: SellerPage<ProductDto> }>("/seller/products", { signal, query: { page, limit } });
    return (unwrapPage(data).items ?? []).map(toProduct);
  },
  async createProduct(input: SellerProductInput): Promise<Product> {
    const data = await api.post<{ product: ProductDto }>("/seller/products", input);
    return toProduct(data.product);
  },
  async updateProduct(id: string, input: Partial<SellerProductInput>): Promise<Product> {
    const data = await api.patch<{ product: ProductDto }>(`/seller/products/${encodeURIComponent(id)}`, input);
    return toProduct(data.product);
  },
  removeProduct(id: string): Promise<void> {
    return api.delete<void>(`/seller/products/${encodeURIComponent(id)}`);
  },
  async orders(page = 1, limit = 50, signal?: AbortSignal): Promise<Order[]> {
    const data = await api.get<{ orders: SellerPage<OrderDto> }>("/seller/orders", { signal, query: { page, limit } });
    return (unwrapPage(data).items ?? []).map((item) => toOrder(sellerOrderDto(item as OrderDto & Record<string, unknown>)));
  },
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const data = await api.patch<{ order: OrderDto }>(`/seller/orders/${encodeURIComponent(id)}/status`, { status });
    return toOrder(sellerOrderDto(data.order as OrderDto & Record<string, unknown>));
  },
};
