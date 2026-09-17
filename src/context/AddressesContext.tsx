import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AddressesContext } from "./addressesContextDefinition";
import { useAuth } from "../hooks/useAuth";
import type { Address } from "../bin/types/addressType";

const STORAGE_KEY = "lurevia_addresses";

const readStorage = (): Address[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Address[]) : [];
  } catch {
    return [];
  }
};

export const AddressesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [all, setAll] = useState<Address[]>(readStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error("Impossible de sauvegarder les adresses.", e);
    }
  }, [all]);

  const addresses = useMemo(
    () =>
      user
        ? all
            .filter((a) => a.userId === user.id)
            .sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
        : [],
    [all, user]
  );

  const addAddress = useCallback(
    (data: Omit<Address, "id" | "userId" | "createdAt">) => {
      if (!user) return;
      const newAddress: Address = {
        ...data,
        id: `addr-${Date.now()}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };
      setAll((prev) => {
        // Si cette adresse est par défaut, retirer le flag des autres
        const cleaned = data.isDefault
          ? prev.map((a) => (a.userId === user.id ? { ...a, isDefault: false } : a))
          : prev;
        return [...cleaned, newAddress];
      });
    },
    [user]
  );

  const updateAddress = useCallback(
    (id: string, data: Partial<Address>) => {
      setAll((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...data } : a))
      );
    },
    []
  );

  const removeAddress = useCallback((id: string) => {
    setAll((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback(
    (id: string) => {
      if (!user) return;
      setAll((prev) =>
        prev.map((a) =>
          a.userId === user.id ? { ...a, isDefault: a.id === id } : a
        )
      );
    },
    [user]
  );

  const value = useMemo(
    () => ({ addresses, addAddress, updateAddress, removeAddress, setDefaultAddress }),
    [addresses, addAddress, updateAddress, removeAddress, setDefaultAddress]
  );

  return (
    <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>
  );
};