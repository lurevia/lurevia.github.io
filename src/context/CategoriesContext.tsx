import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Gift,
  Home,
  Shirt,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { CategoriesContext } from "./categoriesContextDefinition";
import { categoriesApi } from "../api/categories";
import { toErrorMessage } from "../api/http";
import { safeImageUrl } from "../bin/utils/security";
import type { Category } from "../bin/types/homeType";

/**
 * Catalogue de catégories servi par l'API.
 *
 * L'API renvoie un nom d'icône (`iconName`) et non un composant : on le
 * résout ici via une table blanche. Une valeur inconnue retombe sur une
 * icône neutre — aucune donnée serveur n'est utilisée pour charger
 * dynamiquement du code.
 */
const ICONS: Record<string, LucideIcon> = {
  ShoppingBag,
  Shirt,
  Sparkles,
  Home,
  Gift,
};

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await categoriesApi.list();
      setCategories(
        list.map((dto) => ({
          id: dto.id,
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          imageUrl: safeImageUrl(dto.imageUrl) ?? "",
          bannerUrl: safeImageUrl(dto.bannerUrl) ?? "",
          icon: ICONS[dto.iconName] ?? ShoppingBag,
        }))
      );
    } catch (err) {
      setCategories([]);
      setError(toErrorMessage(err, "Catégories indisponibles."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ categories, isLoading, error, refresh }),
    [categories, isLoading, error, refresh]
  );

  return (
    <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
  );
};
