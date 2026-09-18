import { useMemo, useState } from "react";
import type { ReactNode } from "react";
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
import { useAuth } from "./useAuth";
import { NAV_LINKS } from "../bin/utils/constant/constant";
import { UserAvatar } from "../components/account/UserAvatar";

export type BottomNavItem = {
  to: string;
  label: string;
  icon?: LucideIcon;
  customIcon?: ReactNode;
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
  const { isAuthenticated, user } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  /** 1. Construit les items de la barre */
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

    /** 🎯 Item "Compte" qui s'adapte à l'état de connexion */
    const accountItem: BottomNavItem =
      isAuthenticated && user
        ? {
            to: "/compte",
            label: user.fullName.split(" ")[0],
            customIcon: <UserAvatar size={22} />,
            badge: undefined,
          }
        : {
            to: "/auth",
            label: "Compte",
            icon: User,
            badge: undefined,
          };

    return [
      ...baseItem,
      {
        to: "/categories",
        label: "Catégories",
        icon: Layers,
        badge: undefined,
        isTrigger: true,
      },
      {
        to: "/panier",
        label: "Panier",
        icon: ShoppingCart,
        badge: totalItems,
      },
      {
        to: "/favoris",
        label: "Favoris",
        icon: Heart,
        badge: totalFavorites,
      },
      accountItem,
    ];
  }, [totalItems, totalFavorites, isAuthenticated, user]);

  /** 2. Détecte l'item actif selon l'URL */
  const activeItem = useMemo(() => {
    const found = rawItems.find((item) => {
      if (item.to === "/categories") {
        return location.pathname.startsWith("/categories");
      }
      if (item.to === "/compte") {
        return location.pathname.startsWith("/compte");
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