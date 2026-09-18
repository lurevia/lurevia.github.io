import { useState } from "react";
import type { FC } from "react";
import { ShoppingCart, Heart, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "../../hooks/useCart";
import { useFavorite } from "../../hooks/useFavorite";
import { useUIOverlay } from "../../context/UIContext";
import { NotificationBell } from "../notifications/NotificationBell";

import { Button } from "../ui/Button";
import { NavbarSearch } from "./nav/Search";
import { NavbarLinkIcon } from "./nav/NavBarLinkIcon";
import { NavbarAccount } from "./nav/NavbarAccount";
import { NavbarSidebar } from "./nav/Sidebar";

export const Navbar: FC = () => {
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorite();
  const { setOverlay } = useUIOverlay();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    const next = !isMenuOpen;
    setIsMenuOpen(next);
    setOverlay(next);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shrink-0">
        <nav className="max-w-7xl mx-auto px-3 md:px-6 flex items-center justify-between h-16 md:h-20 gap-2 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            className="shrink-0 z-20"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>

          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:ml-4 flex flex-col justify-center shrink-0 group select-none z-10"
          >
            <span className="text-lg sm:text-2xl md:text-3xl font-black font-serif italic tracking-wide bg-linear-to-r from-lurevia-dark to-lurevia-orange bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105 origin-left">
              Lurevia
            </span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center max-w-md mx-6">
            <NavbarSearch variant="desktop" />
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-3 shrink-0 z-20">
            <NotificationBell />

            <div className="hidden xs:block">
              <NavbarLinkIcon
                to="/favoris"
                icon={Heart}
                label="Favoris"
                badgeCount={totalFavorites}
                badgeColorClass="bg-lurevia-orange"
              />
            </div>

            <div className="hidden md:block">
              <NavbarAccount />
            </div>

            <NavbarLinkIcon
              to="/panier"
              icon={ShoppingCart}
              label="Panier"
              badgeCount={totalItems}
              badgeColorClass="bg-lurevia-yellow text-lurevia-dark"
            />
          </div>
        </nav>

        <div className="px-3 pb-3 md:hidden w-full">
          <NavbarSearch variant="mobile" />
        </div>
      </header>

      <NavbarSidebar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </>
  );
};