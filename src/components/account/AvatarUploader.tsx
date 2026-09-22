import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    User as UserIcon,
    Package,
    Heart,
    MapPin,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useFavorite } from "../../hooks/useFavorite";
import { useOrders } from "../../hooks/useOrders";
import { Button } from "../ui/Button";
import { initialsOf } from "../../bin/utils/security";
import { buildImageUrl } from "../../bin/utils/images";

const NAV_ITEMS = [
    { to: "/compte", label: "Profil", icon: UserIcon, exact: true },
    { to: "/compte/commandes", label: "Commandes", icon: Package },
    { to: "/compte/favoris", label: "Favoris", icon: Heart },
    { to: "/compte/adresses", label: "Adresses", icon: MapPin },
];

export const AccountSidebar: FC = () => {
    const { user, logout } = useAuth();
    const { totalFavorites } = useFavorite();
    const { orders } = useOrders();
    const location = useLocation();

    if (!user) return null;

    const initials = initialsOf(user.fullName);

    return (
        <aside className="bg-white border border-slate-100 rounded-2xl p-5 space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                {user.avatarUrl ? (
                    <img
                        src={buildImageUrl(user.avatarUrl)}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-lurevia-dark text-white flex items-center justify-center font-black text-sm shrink-0">
                        {initials || "?"}
                    </div>
                )}
                <div className="min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate">
                        {user.fullName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                        {user.email ?? user.phone}
                    </p>
                </div>
            </div>

            <nav>
                <ul className="space-y-1">
                    {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
                        const active = exact
                            ? location.pathname === to
                            : location.pathname.startsWith(to);

                        const badge =
                            to === "/compte/favoris"
                                ? totalFavorites
                                : to === "/compte/commandes"
                                    ? orders.length
                                    : 0;

                        return (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${active
                                            ? "bg-lurevia-dark text-white"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-lurevia-dark"
                                        }`}
                                >
                                    <Icon size={16} />
                                    <span className="flex-1">{label}</span>
                                    {badge > 0 && (
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${active
                                                    ? "bg-white text-lurevia-dark"
                                                    : "bg-lurevia-orange text-white"
                                                }`}
                                        >
                                            {badge}
                                        </span>
                                    )}
                                    {active && <ChevronRight size={14} />}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="pt-4 border-t border-slate-100">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    icon={LogOut}
                    onClick={() => void logout()}
                    className="w-full! justify-start! text-slate-400! hover:text-red-500! hover:bg-red-50!"
                >
                    Se déconnecter
                </Button>
            </div>
        </aside>
    );
};