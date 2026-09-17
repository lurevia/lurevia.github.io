import { useContext } from "react";
import { CartContext } from "../context/cartContextDefinition";
import type { CartContextType } from "../bin/types/homeType";

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
};
