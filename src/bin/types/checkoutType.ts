export type PaymentMethod = "mobile-money" | "card" | "cash";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface MobileMoneyDetails {
  provider: "mvola" | "orange-money" | "airtel-money";
  phoneNumber: string;
}

export interface CheckoutState {
  step: 1 | 2 | 3;
  shipping: ShippingAddress;
  paymentMethod: PaymentMethod | null;
  mobileMoney: MobileMoneyDetails;
  addressId: string | null;
}
