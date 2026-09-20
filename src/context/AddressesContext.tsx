import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AddressesContext } from "./addressesContextDefinition";
import { addressesApi } from "../api/addresses";
import { toErrorMessage } from "../api/http";
import { useAuth } from "../hooks/useAuth";
import type { Address, AddressInput } from "../bin/types/addressType";

/**
 * Carnet d'adresses.
 *
 * Les adresses contiennent des données personnelles (nom, téléphone,
 * adresse postale) : elles ne sont plus stockées dans le navigateur mais
 * lues à la demande auprès de l'API, qui n'expose que celles de
 * l'utilisateur authentifié.
 */
export const AddressesProvider = ({ children }: { children: ReactNode }) => {
  const { user, isReady } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortAddresses = (list: Address[]): Address[] =>
    [...list].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

  const refresh = useCallback(async (): Promise<void> => {
    if (!user) {
      setAddresses([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      setAddresses(sortAddresses(await addressesApi.list()));
    } catch (err) {
      setError(toErrorMessage(err, "Impossible de charger vos adresses."));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isReady) return;
    void refresh();
  }, [isReady, refresh]);

  const addAddress = useCallback(
    async (input: AddressInput): Promise<void> => {
      await addressesApi.create(input);
      await refresh();
    },
    [refresh]
  );

  const updateAddress = useCallback(
    async (id: string, data: Partial<AddressInput>): Promise<void> => {
      await addressesApi.update(id, data);
      await refresh();
    },
    [refresh]
  );

  const removeAddress = useCallback(
    async (id: string): Promise<void> => {
      await addressesApi.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    },
    []
  );

  const setDefaultAddress = useCallback(
    async (id: string): Promise<void> => {
      await addressesApi.setDefault(id);
      await refresh();
    },
    [refresh]
  );

  const value = useMemo(
    () => ({
      addresses,
      isLoading,
      error,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      refresh,
    }),
    [addresses, isLoading, error, addAddress, updateAddress, removeAddress, setDefaultAddress, refresh]
  );

  return (
    <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>
  );
};
