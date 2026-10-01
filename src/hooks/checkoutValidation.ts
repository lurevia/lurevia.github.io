import type {
  CheckoutState,
  PaymentMethod,
  ShippingAddress,
} from "../bin/types/checkoutType";

export const isValidMalagasyPhone = (phone: string): boolean =>
  /^(\+261|0)[0-9]{9}$/.test(phone.replace(/\s/g, ""));

export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateShippingAddress = (
  shipping: ShippingAddress,
): Partial<Record<keyof ShippingAddress, string>> => {
  const errors: Partial<Record<keyof ShippingAddress, string>> = {};
  const { fullName, phone, email, address, city, region } = shipping;

  if (fullName.trim().length < 2) errors.fullName = "Nom requis";
  if (!phone.trim()) errors.phone = "Téléphone requis";
  else if (!isValidMalagasyPhone(phone)) {
    errors.phone = "Numéro invalide (ex : 034 12 345 67)";
  }
  if (!email.trim()) errors.email = "Email requis";
  else if (!isValidEmail(email)) errors.email = "Email invalide";
  if (address.trim().length < 3) errors.address = "Adresse requise";
  if (!city.trim()) errors.city = "Ville requise";
  if (!region.trim()) errors.region = "Région requise";

  return errors;
};

export const isPaymentValid = (
  paymentMethod: PaymentMethod | null,
  phoneNumber: string,
): boolean => {
  if (!paymentMethod) return false;
  return paymentMethod !== "mobile-money" || isValidMalagasyPhone(phoneNumber);
};

export const INITIAL_SHIPPING: ShippingAddress = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  region: "",
  notes: "",
};

export const buildInitialCheckoutState = (): CheckoutState => ({
  step: 1,
  shipping: INITIAL_SHIPPING,
  paymentMethod: null,
  mobileMoney: { provider: "mvola", phoneNumber: "" },
  addressId: null,
});
