import { createContext } from "react";
import type { AuthContextType } from "../bin/types/authType";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);