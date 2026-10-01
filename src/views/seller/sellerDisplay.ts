import type { SellerProductInput } from "../../api/seller";

export type SellerTab = "dashboard" | "products" | "orders" | "store";

export const SELLER_ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const EMPTY_SELLER_PRODUCT: SellerProductInput = {
  title: "",
  sku: "",
  price: 0,
  stock: 0,
  tags: [],
  categoryIds: [],
  images: [],
  colors: [],
  sizes: [],
};

export const formatSellerMoney = (amount: number): string =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MGA",
    maximumFractionDigits: 0,
  }).format(amount);
