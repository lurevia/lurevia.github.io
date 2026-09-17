import { useState } from "react";
import { useCart } from "./useCart";
import type {
  CheckoutState,
  PaymentMethod,
  ShippingAddress,
  Order,
} from "../bin/types/checkoutType";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const SHIPPING_COST = 15_000;
const FREE_SHIPPING_THRESHOLD = 200_000;
const STORAGE_KEY = "lurevia_shipping";

const INITIAL_SHIPPING: ShippingAddress = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  region: "",
  notes: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Numéros malgaches : 034 12 345 67 ou +261 34 12 345 67 */
const isValidMalagasyPhone = (phone: string): boolean =>
  /^(\+261|0)[0-9]{9}$/.test(phone.replace(/\s/g, ""));

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/** Lit l'adresse sauvegardée, ou retourne l'adresse vide */
const readShippingFromStorage = (): ShippingAddress => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_SHIPPING;

    const parsed = JSON.parse(saved) as Partial<ShippingAddress>;
    return { ...INITIAL_SHIPPING, ...parsed };
  } catch {
    return INITIAL_SHIPPING;
  }
};

/** Construit l'état initial du checkout */
const buildInitialState = (): CheckoutState => ({
  step: 1,
  shipping: readShippingFromStorage(),
  paymentMethod: null,
  mobileMoney: { provider: "mvola", phoneNumber: "" },
  card: { number: "", holderName: "", expiry: "", cvv: "" },
});

// ─────────────────────────────────────────────────────────────────────────────
// TYPE DE RETOUR
// ─────────────────────────────────────────────────────────────────────────────

export type UseCheckoutReturn = {
  state: CheckoutState;
  errors: Partial<Record<keyof ShippingAddress, string>>;
  subtotal: number;
  shippingCost: number;
  total: number;

  // Navigation
  goToStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Form
  updateShipping: (field: keyof ShippingAddress, value: string) => void;
  selectPaymentMethod: (method: PaymentMethod) => void;
  updateMobileMoney: (field: string, value: string) => void;
  updateCard: (field: string, value: string) => void;

  // Reset
  clearSavedShipping: () => void;

  // Validation + submit
  validateShipping: () => boolean;
  validatePayment: () => boolean;
  submitOrder: () => void;
  lastOrder: Order | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useCheckout = (): UseCheckoutReturn => {
  const { cart, totalPrice, clearCart } = useCart();

  // ─── STATE INITIAL AVEC PERSISTANCE ───
  const [state, setState] = useState<CheckoutState>(buildInitialState);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});

  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // ─── CALCULS ───
  const subtotal = totalPrice;
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  // ─── NAVIGATION ───
  const goToStep = (step: 1 | 2 | 3): void =>
    setState((prev) => ({ ...prev, step }));

  const nextStep = (): void =>
    setState((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, 3) as 1 | 2 | 3,
    }));

  const prevStep = (): void =>
    setState((prev) => ({
      ...prev,
      step: Math.max(prev.step - 1, 1) as 1 | 2 | 3,
    }));

  // ─── FORM SHIPPING ───
  const updateShipping = (
    field: keyof ShippingAddress,
    value: string
  ): void => {
    setState((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ─── FORM PAYMENT ───
  const selectPaymentMethod = (method: PaymentMethod): void =>
    setState((prev) => ({ ...prev, paymentMethod: method }));

  const updateMobileMoney = (field: string, value: string): void =>
    setState((prev) => ({
      ...prev,
      mobileMoney: { ...prev.mobileMoney, [field]: value },
    }));

  const updateCard = (field: string, value: string): void =>
    setState((prev) => ({
      ...prev,
      card: { ...prev.card, [field]: value },
    }));

  const clearSavedShipping = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Impossible d'effacer l'adresse sauvegardée.", error);
    }

    setState((prev) => ({
      ...prev,
      shipping: INITIAL_SHIPPING,
    }));

    setErrors({});
  };

  const validateShipping = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};
    const { fullName, phone, email, address, city, region } = state.shipping;

    if (!fullName.trim()) newErrors.fullName = "Nom requis";

    if (!phone.trim()) {
      newErrors.phone = "Téléphone requis";
    } else if (!isValidMalagasyPhone(phone)) {
      newErrors.phone = "Numéro invalide (ex : 034 12 345 67)";
    }

    if (email.trim() && !isValidEmail(email)) {
      newErrors.email = "Email invalide";
    }

    if (!address.trim()) newErrors.address = "Adresse requise";
    if (!city.trim()) newErrors.city = "Ville requise";
    if (!region.trim()) newErrors.region = "Région requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── VALIDATION PAYMENT ───
  const validatePayment = (): boolean => {
    if (!state.paymentMethod) return false;

    if (state.paymentMethod === "mobile-money") {
      return isValidMalagasyPhone(state.mobileMoney.phoneNumber);
    }

    if (state.paymentMethod === "card") {
      const { number, holderName, expiry, cvv } = state.card;
      return (
        number.replace(/\s/g, "").length === 16 &&
        holderName.trim().length > 2 &&
        /^\d{2}\/\d{2}$/.test(expiry) &&
        cvv.length === 3
      );
    }

    return true;
  };

  // ─── SUBMIT + SAUVEGARDE ADRESSE ───
  const submitOrder = (): void => {
    if (!validatePayment()) return;
    if (!state.paymentMethod) return;

    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      shipping: { ...state.shipping },
      paymentMethod: state.paymentMethod,
      total,
      createdAt: new Date().toISOString(),
    };

    // 🔌 À remplacer par un appel API réel
    console.log("[CHECKOUT] Commande créée :", order);

    // 💾 Sauvegarde de l'adresse pour la prochaine commande
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shipping));
    } catch (error) {
      console.error("Impossible de sauvegarder l'adresse.", error);
    }

    setLastOrder(order);
    clearCart();
    setState((prev) => ({ ...prev, step: 3 }));
  };

  return {
    state,
    errors,
    subtotal,
    shippingCost,
    total,
    goToStep,
    nextStep,
    prevStep,
    updateShipping,
    selectPaymentMethod,
    updateMobileMoney,
    updateCard,
    clearSavedShipping,
    validateShipping,
    validatePayment,
    submitOrder,
    lastOrder,
  };
};