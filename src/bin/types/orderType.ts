import type { CartItem } from "./homeType";
import type { ShippingAddress, PaymentMethod } from "./checkoutType";

export type OrderStatus =
  | "pending"
  | "paid"
  | "shipped"
  | "delivered"
  | "cancelled";

export type TransactionStatus = "success" | "pending" | "failed";

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  date: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}