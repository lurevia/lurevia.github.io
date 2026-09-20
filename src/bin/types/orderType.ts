import type { ShippingAddress, PaymentMethod, MobileMoneyDetails } from "./checkoutType";

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

/**
 * Ligne de commande : instantané (snapshot) du produit au moment de
 * l'achat, renvoyé tel quel par l'API. Le prix affiché dans l'historique
 * reste donc celui payé, même si le produit change de prix ensuite.
 */
export interface OrderItem {
  productId: string;
  title: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod;
  transactions: Transaction[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

/**
 * Charge utile du checkout.
 *
 * Aucune donnée de carte bancaire n'y figure volontairement : l'API
 * refuse tout numéro de carte ou CVV (conformité PCI-DSS). Un paiement
 * par carte passe par un prestataire tiers qui renvoie un jeton opaque.
 */
export interface CheckoutPayload {
  addressId?: string;
  shipping?: ShippingAddress;
  paymentMethod: PaymentMethod;
  mobileMoney?: MobileMoneyDetails;
  paymentToken?: string;
}
