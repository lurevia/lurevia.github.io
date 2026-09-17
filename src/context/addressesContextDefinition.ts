import { createContext } from "react";
import type { Address } from "../bin/types/addressType";

export interface AddressesContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id" | "userId" | "createdAt">) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

export const AddressesContext = createContext<AddressesContextType | undefined>(
  undefined
);