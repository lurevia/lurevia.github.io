import { useCallback, useState } from "react";
import { useCart } from "./useCart";
import { useAuth } from "./useAuth";
import { useOrders } from "./useOrders";
import { toErrorMessage } from "../api/http";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "../bin/config/env";
import type {
  CheckoutState,
  PaymentMethod,
  ShippingAddress,
} from "../bin/types/checkoutType";
import type { Address } from "../bin/types/addressType";
import type { Order } from "../bin/types/orderType";

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/** Numéros malgaches : 034 12 345 67 ou +261 34 12 345 67 */
const isValidMalagasyPhone = (phone: string): boolean =>
  /^(\+261|0)[0-9]{9}$/.test(phone.replace(/\s/g, ""));

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const INITIAL_SHIPPING: ShippingAddress = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  region: "",
  notes: "",
};

const buildInitialState = (): CheckoutState => ({
  step: 1,
  shipping: INITIAL_SHIPPING,
  paymentMethod: null,
  mobileMoney: { provider: "mvola", phoneNumber: "" },
  addressId: null,
});

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

  updateShipping: (field: keyof ShippingAddress, value: string) => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  updateMobileMoney: (field: string, value: string) => void;
  useSavedAddress: (address: Address) => void;
  clearSavedShipping: () => void;

  validateShipping: () => boolean;
  validatePayment: () => boolean;
  submitOrder: () => Promise<void>;
  lastOrder: Order | null;
};

/**
 * Tunnel de commande.
 *
 * Deux changements de sécurité par rapport à la version précédente :
 *
 * 1. **Aucune donnée de carte bancaire n'est saisie ni transmise.**
 *    Collecter un PAN et un CVV dans une SPA place l'application dans le
 *    périmètre PCI-DSS ; le paiement par carte doit passer par le champ
 *    hébergé d'un prestataire qui renvoie un jeton opaque.
 * 2. **La commande est créée par l'API** à partir du panier serveur : le
 *    client n'envoie ni prix, ni total, ni statut.
 *
 * L'adresse de livraison n'est plus mémorisée dans le localStorage :
 * elle est pré-remplie depuis le carnet d'adresses du compte.
 */
export const useCheckout = (): UseCheckoutReturn => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { checkout } = useOrders();

  const [state, setState] = useState<CheckoutState>(buildInitialState);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Estimation locale ; les montants facturés viennent de l'API.
  const subtotal = totalPrice;
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  const goToStep = (step: 1 | 2 | 3): void => setState((prev) => ({ ...prev, step }));

  const nextStep = (): void =>
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 3) as 1 | 2 | 3 }));

  const prevStep = (): void =>
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) as 1 | 2 | 3 }));

  const updateShipping = (field: keyof ShippingAddress, value: string): void => {
    setState((prev) => ({
      ...prev,
      // Saisie manuelle : on n'utilise plus l'adresse enregistrée.
      addressId: null,
      shipping: { ...prev.shipping, [field]: value },
    }));

    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const selectPaymentMethod = (method: PaymentMethod): void =>
    setState((prev) => ({
      ...prev,
      paymentMethod: method,
      mobileMoney:
        method === "mobile-money" && !prev.mobileMoney.phoneNumber && user?.phone
          ? { ...prev.mobileMoney, phoneNumber: user.phone }
          : prev.mobileMoney,
    }));

  const updateMobileMoney = (field: string, value: string): void =>
    setState((prev) => ({ ...prev, mobileMoney: { ...prev.mobileMoney, [field]: value } }));

  const useSavedAddress = (address: Address): void => {
    setState((prev) => ({
      ...prev,
      addressId: address.id,
      shipping: {
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        address: address.address,
        city: address.city,
        region: address.region,
        notes: address.notes ?? "",
      },
    }));
    setErrors({});
  };

  const clearSavedShipping = (): void => {
    setState((prev) => ({ ...prev, shipping: INITIAL_SHIPPING, addressId: null }));
    setErrors({});
  };

  const validateShipping = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    const { fullName, phone, email, address, city, region } = state.shipping;

    if (fullName.trim().length < 2) newErrors.fullName = "Nom requis";

    if (!phone.trim()) newErrors.phone = "Téléphone requis";
    else if (!isValidMalagasyPhone(phone)) newErrors.phone = "Numéro invalide (ex : 034 12 345 67)";

    // L'API exige un email valide pour la confirmation de commande.
    if (!email.trim()) newErrors.email = "Email requis";
    else if (!isValidEmail(email)) newErrors.email = "Email invalide";

    if (address.trim().length < 3) newErrors.address = "Adresse requise";
    if (!city.trim()) newErrors.city = "Ville requise";
    if (!region.trim()) newErrors.region = "Région requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    if (!state.paymentMethod) return false;

    if (state.paymentMethod === "mobile-money") {
      return isValidMalagasyPhone(state.mobileMoney.phoneNumber);
    }

    // "card" et "cash" : aucune donnée sensible n'est saisie ici.
    return true;
  };

  const submitOrder = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;

    setSubmitError(null);

    if (!state.paymentMethod || !validatePayment()) {
      setSubmitError("Veuillez compléter les informations de paiement.");
      return;
    }
    if (!user) {
      setSubmitError("Votre session a expiré. Reconnectez-vous pour valider la commande.");
      return;
    }
    if (cart.length === 0) {
      setSubmitError("Votre panier est vide.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await checkout({
        addressId: state.addressId ?? undefined,
        shipping: state.addressId ? undefined : state.shipping,
        paymentMethod: state.paymentMethod,
        mobileMoney:
          state.paymentMethod === "mobile-money" ? state.mobileMoney : undefined,
      });

      setLastOrder(order);
      await clearCart();
      setState((prev) => ({ ...prev, step: 3 }));
    } catch (error) {
      setSubmitError(toErrorMessage(error, "La commande n'a pas pu être enregistrée."));
    } finally {
      setIsSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length, checkout, clearCart, isSubmitting, state, user]);

  return {
    state,
    errors,
    submitError,
    isSubmitting,
    subtotal,
    shippingCost,
    total,
    goToStep,
    nextStep,
    prevStep,
    updateShipping,
    selectPaymentMethod,
    updateMobileMoney,
    useSavedAddress,
    clearSavedShipping,
    validateShipping,
    validatePayment,
    submitOrder,
    lastOrder,
  };
};
