import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, User, type LucideIcon } from "lucide-react";
import { useCart } from "../../../hooks/useCart";
import { useFavorite } from "../../../hooks/useFavorite";
import { NAV_LINKS } from "../../../bin/utils/constant/constant";

type BottomNavItem = {
    to: string;
    label: string;
    icon: LucideIcon;
    badge?: number | null;
};

export const BottomNav: React.FC = () => {
    const location = useLocation();
    const { totalItems } = useCart();
    const { totalFavorites } = useFavorite();

    const baseLinks: BottomNavItem[] = NAV_LINKS
        .filter(link => link.to === "/" || link.to === "/categories")
        .map(link => ({
            to: link.to,
            label: link.label,
            icon: link.icon,
            badge: undefined
        }));

    const rawItems: BottomNavItem[] = [
        ...baseLinks,
        { to: "/panier", label: "Panier", icon: ShoppingCart, badge: totalItems },
        { to: "/favoris", label: "Favoris", icon: Heart, badge: totalFavorites },
        { to: "/compte", label: "Compte", icon: User, badge: undefined },
    ];

    const activeItem = rawItems.find(item => item.to === location.pathname) || rawItems[0];
    const inactiveItems = rawItems.filter(item => item.to !== activeItem.to);

    const orderedNavItems: BottomNavItem[] = [
        inactiveItems[0],
        inactiveItems[1],
        activeItem,
        inactiveItems[2],
        inactiveItems[3],
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-t border-white/20 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.06)] overflow-visible">
            <nav className="flex justify-around items-center h-16 px-2 relative overflow-visible">
                {orderedNavItems.map((item) => {
                    if (!item) return null;

                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    const hasBadge = typeof item.badge === 'number' && item.badge > 0;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 ease-in-out overflow-visible"
                        >
                            <div className={`relative flex items-center justify-center transition-all duration-500 ease-in-out ${
                                isActive 
                                    ? "bg-amber-600 text-white w-12 h-12 rounded-full -translate-y-3 shadow-lg shadow-amber-600/30 border-4 border-gray-50 z-10 scale-110" 
                                    : "text-slate-400 hover:text-slate-600"
                            }`}>
                                <Icon 
                                    size={isActive ? 20 : 22} 
                                    strokeWidth={isActive ? 2.5 : 2} 
                                />
                                {hasBadge && (
                                    <span className={`absolute flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ring-2 transition-all duration-300 ${
                                        isActive 
                                          ? "-top-1 -right-1 bg-slate-900 text-white ring-amber-600" 
                                          : "-top-1 -right-1.5 bg-amber-600 text-white ring-white"
                                    }`}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            <span className={`tracking-wide transition-all duration-300 text-[10px] ${
                                isActive 
                                    ? "opacity-0 h-0 -mt-2 invisible pointer-events-none" 
                                    : "text-slate-400 mt-1"
                            }`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
