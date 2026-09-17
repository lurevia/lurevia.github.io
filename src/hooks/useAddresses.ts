import { useContext } from "react";
import { AddressesContext } from "../context/addressesContextDefinition";

export const useAddresses = () => {
  const ctx = useContext(AddressesContext);
  if (!ctx) throw new Error("useAddresses doit être utilisé dans un AddressesProvider");
  return ctx;
};