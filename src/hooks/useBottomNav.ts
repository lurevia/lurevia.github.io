import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  User,
  Layers,
  type LucideIcon,
} from "lucide-react";

import { useCart } from "./useCart";
import { useFavorite } from "./useFavorite";
import { NAV_LINKS } from "../bin/utils/constant/constant";

export type BottomNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number | null;
  isTrigger?: boolean;
};

export type UseBottomNavReturn = {
  isDropdownOpen: boolean;
  activeItem: BottomNavItem;
  orderedNavItems: BottomNavItem[];
  currentPath: string;
  toggleDropdown: () => void;
  closeDropdown: () => void;
};

export const useBottomNav = (): UseBottomNavReturn => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorite();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const rawItems = useMemo<BottomNavItem[]>(() => {
    const homeLink = NAV_LINKS.find((link) => link.to === "/");
    const baseItem: BottomNavItem[] = homeLink
      ? [
          {
            to: homeLink.to,
            label: homeLink.label,
            icon: homeLink.icon,
            badge: undefined,
          },
        ]
      : [];

    return [
      ...baseItem,
      {
        to: "/categories",
        label: "Catégories",
        icon: Layers,
        badge: undefined,
        isTrigger: true,
      },
      { to: "/panier", label: "Panier", icon: ShoppingCart, badge: totalItems },
      {
        to: "/favoris",
        label: "Favoris",
        icon: Heart,
        badge: totalFavorites,
      },
      { to: "/compte", label: "Compte", icon: User, badge: undefined },
    ];
  }, [totalItems, totalFavorites]);

  const activeItem = useMemo(() => {
    const found = rawItems.find((item) => {
      if (item.to === "/categories") {
        return location.pathname.startsWith("/categories");
      }
      return location.pathname === item.to;
    });
    return found ?? rawItems[0];
  }, [rawItems, location.pathname]);

  const orderedNavItems = useMemo<BottomNavItem[]>(() => {
    const others = rawItems.filter((item) => item.to !== activeItem.to);
    return [
      others[0],
      others[1],
      activeItem,
      others[2],
      others[3],
    ].filter(Boolean);
  }, [rawItems, activeItem]);

  const toggleDropdown = (): void => setIsDropdownOpen((prev) => !prev);
  const closeDropdown = (): void => setIsDropdownOpen(false);

  return {
    isDropdownOpen,
    activeItem,
    orderedNavItems,
    currentPath: location.pathname,
    toggleDropdown,
    closeDropdown,
  };
};