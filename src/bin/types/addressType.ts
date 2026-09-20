import type { ShippingAddress } from "./checkoutType";

export interface Address extends ShippingAddress {
  id: string;
  userId: string;
  label: string;
  isDefault: boolean;
  createdAt: string;
}

/** Données acceptées par l'API pour créer ou modifier une adresse. */
export type AddressInput = Omit<Address, "id" | "userId" | "createdAt">;
