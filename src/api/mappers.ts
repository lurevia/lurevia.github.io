import { FALLBACK_IMAGE } from "../bin/utils/constant/assets";
import { safeImageUrl, sanitizeText } from "../bin/utils/security";
import type { Product } from "../bin/types/homeType";
import type { User } from "../bin/types/authType";
import type { Address } from "../bin/types/addressType";
import type { Order, OrderItem, OrderStatus, Transaction, TransactionStatus } from "../bin/types/orderType";
import type { PaymentMethod } from "../bin/types/checkoutType";
import type { ProductReview } from "../bin/types/reviewType";
import type { ServiceFeedback, ServiceFeedbackCategory } from "../bin/types/feedbackType";
import type { AppNotification, NotificationType } from "../bin/types/notificationType";
import type {
  AddressDto,
  FeedbackDto,
  NotificationDto,
  OrderDto,
  OrderItemDto,
  ProductDto,
  ReviewDto,
  TransactionDto,
  UserDto,
} from "./dto";

/**
 * Traduction des réponses de l'API vers les types utilisés par l'interface.
 *
 * Ces fonctions jouent aussi un rôle de barrière : toute chaîne affichée
 * est nettoyée et toute URL d'image validée, pour qu'un contenu hostile
 * stocké en base (nom d'utilisateur, URL d'avatar) ne puisse pas
 * dégrader l'interface.
 */

const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];
const TRANSACTION_STATUSES: TransactionStatus[] = ["success", "pending", "failed"];
const PAYMENT_METHODS: PaymentMethod[] = ["mobile-money", "card", "cash"];
const FEEDBACK_CATEGORIES: ServiceFeedbackCategory[] = [
  "delivery",
  "payment",
  "support",
  "website",
  "other",
];

export const toProduct = (dto: ProductDto): Product => {
  const images = (dto.images ?? [])
    .map((url) => safeImageUrl(url))
    .filter((url): url is string => typeof url === "string");

  return {
    id: dto.id,
    title: sanitizeText(dto.title, 200),
    slug: dto.slug,
    price: dto.price,
    originalPrice: dto.originalPrice ?? undefined,
    imageUrl: safeImageUrl(dto.imageUrl) ?? images[0] ?? FALLBACK_IMAGE,
    images: images.length > 0 ? images : undefined,
    categorySlugs: dto.categorySlugs ?? [],
    rating: dto.rating,
    reviewCount: dto.reviewCount,
    outOfStock: dto.outOfStock,
    stock: dto.stock,
    isNew: dto.isNew,
    description: dto.description ? sanitizeText(dto.description, 500) : undefined,
    longDescription: dto.longDescription ? sanitizeText(dto.longDescription, 5_000) : undefined,
    sizes: dto.sizes ?? [],
    colors: dto.colors ?? [],
    sku: dto.sku,
    tags: dto.tags ?? [],
    createdAt: dto.createdAt,
  };
};

export const toUser = (dto: UserDto): User => ({
  id: dto.id,
  fullName: sanitizeText(dto.fullName, 120),
  email: dto.email ?? undefined,
  phone: dto.phone ?? undefined,
  avatarUrl: safeImageUrl(dto.avatarUrl),
  role: dto.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
  primaryIdentifier: dto.primaryIdentifier === "PHONE" ? "phone" : "email",
  createdAt: dto.createdAt,
  lastLoginAt: dto.lastLoginAt ?? undefined,
});

export const toAddress = (dto: AddressDto): Address => ({
  id: dto.id,
  userId: dto.userId,
  label: sanitizeText(dto.label, 60),
  fullName: sanitizeText(dto.fullName, 120),
  phone: sanitizeText(dto.phone, 20),
  email: sanitizeText(dto.email, 150),
  address: sanitizeText(dto.address, 255),
  city: sanitizeText(dto.city, 100),
  region: sanitizeText(dto.region, 100),
  notes: dto.notes ? sanitizeText(dto.notes, 500) : undefined,
  isDefault: Boolean(dto.isDefault),
  createdAt: dto.createdAt,
});

const toOrderItem = (dto: OrderItemDto): OrderItem => ({
  productId: dto.productId,
  title: sanitizeText(dto.title, 200),
  imageUrl: safeImageUrl(dto.imageUrl) ?? FALLBACK_IMAGE,
  price: dto.price,
  quantity: dto.quantity,
});

const toPaymentMethod = (value: string): PaymentMethod =>
  PAYMENT_METHODS.includes(value as PaymentMethod) ? (value as PaymentMethod) : "cash";

export const toTransaction = (dto: TransactionDto): Transaction => ({
  id: dto.id,
  orderId: dto.orderId,
  amount: dto.amount,
  method: toPaymentMethod(dto.method),
  status: TRANSACTION_STATUSES.includes(dto.status as TransactionStatus)
    ? (dto.status as TransactionStatus)
    : "pending",
  date: dto.date,
});

export const toOrder = (dto: OrderDto): Order => ({
  id: dto.id,
  userId: dto.userId,
  status: ORDER_STATUSES.includes(dto.status as OrderStatus)
    ? (dto.status as OrderStatus)
    : "pending",
  paymentMethod: toPaymentMethod(dto.paymentMethod),
  shipping: {
    fullName: sanitizeText(dto.shipping?.fullName, 120),
    phone: sanitizeText(dto.shipping?.phone, 20),
    email: sanitizeText(dto.shipping?.email, 150),
    address: sanitizeText(dto.shipping?.address, 255),
    city: sanitizeText(dto.shipping?.city, 100),
    region: sanitizeText(dto.shipping?.region, 100),
    notes: dto.shipping?.notes ? sanitizeText(dto.shipping.notes, 500) : undefined,
  },
  items: (dto.items ?? []).map(toOrderItem),
  transactions: (dto.transactions ?? []).map(toTransaction),
  subtotal: dto.subtotal,
  shippingCost: dto.shippingCost,
  total: dto.total,
  createdAt: dto.createdAt,
});

export const toReview = (dto: ReviewDto): ProductReview => ({
  id: dto.id,
  productId: dto.productId,
  userId: dto.userId,
  userName: sanitizeText(dto.userName ?? "Client Lurevia", 120) || "Client Lurevia",
  userAvatar: safeImageUrl(dto.userAvatar),
  rating: dto.rating,
  title: dto.title ? sanitizeText(dto.title, 120) : undefined,
  comment: sanitizeText(dto.comment, 2_000),
  isVerifiedPurchase: Boolean(dto.isVerifiedPurchase),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export const toFeedback = (dto: FeedbackDto): ServiceFeedback => ({
  id: dto.id,
  userId: dto.userId,
  userName: sanitizeText(dto.userName ?? "Client Lurevia", 120) || "Client Lurevia",
  userAvatar: safeImageUrl(dto.userAvatar),
  overallRating: dto.overallRating,
  criteria: dto.criteria,
  category: FEEDBACK_CATEGORIES.includes(dto.category) ? dto.category : "other",
  comment: sanitizeText(dto.comment, 2_000),
  teamResponse: dto.teamResponse ? sanitizeText(dto.teamResponse, 2_000) : undefined,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

const NOTIFICATION_TYPES: Record<string, NotificationType> = {
  REVIEW_PENDING: "review_pending",
  ORDER_SHIPPED: "order_shipped",
  ORDER_DELIVERED: "order_delivered",
  PROMO: "promo",
};

export const toNotification = (dto: NotificationDto): AppNotification => ({
  id: dto.id,
  type: NOTIFICATION_TYPES[dto.type] ?? "promo",
  title: sanitizeText(dto.title, 150),
  message: sanitizeText(dto.message, 500),
  actionUrl: dto.actionUrl,
  imageUrl: safeImageUrl(dto.imageUrl),
  read: Boolean(dto.read),
  createdAt: dto.createdAt,
});
