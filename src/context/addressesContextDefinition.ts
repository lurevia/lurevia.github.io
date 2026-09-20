import { createContext } from "react";
import type { Address, AddressInput } from "../bin/types/addressType";

export interface AddressesContextType {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;

  addAddress: (address: AddressInput) => Promise<void>;
  updateAddress: (id: string, data: Partial<AddressInput>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const AddressesContext = createContext<AddressesContextType | undefined>(
  undefined
);
