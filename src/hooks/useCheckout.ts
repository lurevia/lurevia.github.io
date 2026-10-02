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
import {
  buildInitialCheckoutState,
  INITIAL_SHIPPING,
  isPaymentValid,
  validateShippingAddress,
} from "./checkoutValidation";
import type { UseCheckoutReturn } from "./checkoutTypes";

export type { UseCheckoutReturn } from "./checkoutTypes";

/** Le serveur reste la source de vérité des prix et des commandes. */
export const useCheckout = (): UseCheckoutReturn => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { checkout } = useOrders();

  const [state, setState] = useState<CheckoutState>(buildInitialCheckoutState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Estimation locale ; les montants facturés viennent de l'API.
  const subtotal = totalPrice;
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

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

  const updateShipping = (
    field: keyof ShippingAddress,
    value: ShippingAddress[keyof ShippingAddress],
  ): void => {
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
        method === "mobile-money" &&
        !prev.mobileMoney.phoneNumber &&
        user?.phone
          ? { ...prev.mobileMoney, phoneNumber: user.phone }
          : prev.mobileMoney,
    }));

  const updateMobileMoney = (field: string, value: string): void =>
    setState((prev) => ({
      ...prev,
      mobileMoney: { ...prev.mobileMoney, [field]: value },
    }));

  const useSavedAddress = (address: Address): void => {
    setState((prev) => ({
      ...prev,
      addressId: address.id,
      shipping: {
        fullName: address.fullName,
        phone: address.phone,
        email: address.email,
        address: address.address,
        province: address.province,
        city: address.city,
        neighborhood: address.neighborhood,
        region: address.region,
        latitude: address.latitude,
        longitude: address.longitude,
        accuracyMeters: address.accuracyMeters,
        notes: address.notes ?? "",
      },
    }));
    setErrors({});
  };

  const clearSavedShipping = (): void => {
    setState((prev) => ({
      ...prev,
      shipping: INITIAL_SHIPPING,
      addressId: null,
    }));
    setErrors({});
  };

  const validateShipping = (): boolean => {
    const newErrors = validateShippingAddress(state.shipping);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean =>
    isPaymentValid(state.paymentMethod, state.mobileMoney.phoneNumber);

  const submitOrder = useCallback(async (): Promise<void> => {
    if (isSubmitting) return;

    setSubmitError(null);

    if (!state.paymentMethod || !validatePayment()) {
      setSubmitError("Veuillez compléter les informations de paiement.");
      return;
    }
    if (!user || user.role === "ADMIN") {
      setSubmitError(
        "Votre session a expiré. Reconnectez-vous pour valider la commande.",
      );
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
        deliveryMode: "HOME_DELIVERY",
        deliveryLatitude: state.shipping.latitude,
        deliveryLongitude: state.shipping.longitude,
        deliveryAccuracy: state.shipping.accuracyMeters,
        paymentMethod: state.paymentMethod,
        mobileMoney:
          state.paymentMethod === "mobile-money"
            ? state.mobileMoney
            : undefined,
      });

      setLastOrder(order);
      await clearCart();
      setState((prev) => ({ ...prev, step: 3 }));
    } catch (error) {
      setSubmitError(
        toErrorMessage(error, "La commande n'a pas pu être enregistrée."),
      );
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
