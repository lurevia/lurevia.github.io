import { useMemo } from "react";
import { useCart } from "./useCart";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "../bin/config/env";

export type CartSummaryData = {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  hasFreeShipping: boolean;
};

/**
 * Récapitulatif du panier.
 *
 * Attention : ces montants sont **indicatifs**. Le total réellement
 * facturé est recalculé par l'API au moment du checkout, à partir des
 * prix en base — le client ne peut donc pas influencer le prix payé.
 */
export const useCartPage = () => {
  const { cart, removeFromCart, addToCart, setQuantity, clearCart, totalItems, totalPrice, isSyncing } =
    useCart();

  const summary: CartSummaryData = useMemo(() => {
    const subtotal = totalPrice;
    const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = hasFreeShipping || subtotal === 0 ? 0 : SHIPPING_COST;

    return {
      subtotal,
      shipping,
      total: subtotal + shipping,
      itemCount: totalItems,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping: Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0),
      hasFreeShipping,
    };
  }, [totalPrice, totalItems]);

  return {
    cart,
    summary,
    isEmpty: cart.length === 0,
    isSyncing,
    removeFromCart,
    addToCart,
    setQuantity,
    clearCart,
  };
};
