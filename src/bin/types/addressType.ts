import type { ShippingAddress } from "./checkoutType";

export interface Address extends ShippingAddress {
  id: string;
  userId: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
}