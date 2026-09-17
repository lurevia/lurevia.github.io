import React from "react";
import { User, ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useFavorite } from "../../hooks/useFavorite";
import { NavbarSearch } from "./nav/Search";
import { NavbarLinkIcon } from "./nav/NavBarLinkIcon";

export const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorite();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shrink-0">
        <nav className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 flex items-center justify-between h-16 md:h-20 gap-2">

          <Link to="/" className="flex items-center gap-1 md:gap-3 shrink-0 group">
            <img
              src="/images/logo.jpeg"
              alt="Lurevia"
              className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center -space-y-1">
              <span className="text-sm sm:text-base md:text-xl font-black tracking-tight text-slate-900 font-sans">
                Lurevia
              </span>
              <span className="text-[7px] md:text-[9px] font-bold tracking-[0.25em] text-slate-400 uppercase hidden sm:block">
                Be Authentic
              </span>
            </div>
          </Link>

          <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4">
            <NavbarSearch />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            <NavbarLinkIcon
              to="/favoris"
              icon={Heart}
              label="Favorites"
              badgeCount={totalFavorites}
              badgeColorClass="bg-lurevia-orange"
            />

            <NavbarLinkIcon
              to="/compte"
              icon={User}
              label="Account"
            />

            <NavbarLinkIcon
              to="/panier"
              icon={ShoppingCart}
              label="Cart"
              badgeCount={totalItems}
              badgeColorClass="bg-lurevia-yellow text-lurevia-dark"
            />
          </div>
        </nav>
      </header>
    </>
  );
};
