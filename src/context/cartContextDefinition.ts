import { createContext } from "react";
import type { CartContextType } from "../bin/types/homeType";

export const CartContext = createContext<CartContextType | undefined>(undefined);
