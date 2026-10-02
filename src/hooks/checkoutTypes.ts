import type {
  CheckoutState,
  PaymentMethod,
  ShippingAddress,
} from "../bin/types/checkoutType";
import type { Address } from "../bin/types/addressType";
import type { Order } from "../bin/types/orderType";

export type UseCheckoutReturn = {
  state: CheckoutState;
  errors: Partial<Record<keyof ShippingAddress, string>>;
  submitError: string | null;
  isSubmitting: boolean;
  subtotal: number;
  shippingCost: number;
  total: number;
  goToStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateShipping: (field: keyof ShippingAddress, value: ShippingAddress[keyof ShippingAddress]) => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  updateMobileMoney: (field: string, value: string) => void;
  useSavedAddress: (address: Address) => void;
  clearSavedShipping: () => void;
  validateShipping: () => boolean;
  validatePayment: () => boolean;
  submitOrder: () => Promise<void>;
  lastOrder: Order | null;
};
