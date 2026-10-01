import type { ProductDto } from "./catalog";

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
