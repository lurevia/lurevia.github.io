import { useMemo } from "react";
import { useCart } from "./useCart";

/** Règles business */
const FREE_SHIPPING_THRESHOLD = 200_000;
const SHIPPING_COST = 15_000;
const VAT_RATE = 0.2;  

export type CartSummaryData = {
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  hasFreeShipping: boolean;
};

export const useCartPage = () => {
  const { cart, removeFromCart, addToCart, totalItems, totalPrice } = useCart();

  const summary: CartSummaryData = useMemo(() => {
    const subtotal = totalPrice;
    const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = hasFreeShipping || subtotal === 0 ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    return {
      subtotal,
      shipping,
      vat: total * VAT_RATE,
      total,
      itemCount: totalItems,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountToFreeShipping: Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0),
      hasFreeShipping,
    };
  }, [totalPrice, totalItems]);

  const isEmpty = cart.length === 0;

  return {
    cart,
    summary,
    isEmpty,
    removeFromCart,
    addToCart,
  };
};