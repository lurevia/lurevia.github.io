import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import { CartContext } from "./cartContextDefinition";
import type { CartItem, Product } from "../bin/types/homeType";

const STORAGE_KEY = "lurevia_cart";

const readCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch (error) {
    console.error("Impossible de lire le panier enregistré.", error);
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(readCartFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    (product: Product, quantity: number = 1): void => {
      const qty = Math.max(1, quantity);
      const maxStock = product.stock ?? 99;

      setCart((prev) => {
        const existing = prev.find((item) => item.product.id === product.id);

        if (existing) {
          const newQty = Math.min(existing.quantity + qty, maxStock);
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQty }
              : item
          );
        }

        return [...prev, { product, quantity: Math.min(qty, maxStock) }];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string): void => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const setQuantity = useCallback(
    (productId: string, quantity: number): void => {
      setCart((prev) => {
        if (quantity <= 0) {
          return prev.filter((item) => item.product.id !== productId);
        }
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      });
    },
    []
  );

  const clearCart = useCallback((): void => {
    setCart([]);
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  const contextValue = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      totalItems,
      totalPrice,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};