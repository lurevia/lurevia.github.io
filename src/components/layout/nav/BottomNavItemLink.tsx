import type { FC } from "react";
import { Link } from "react-router-dom";
import type { BottomNavItem } from "../../../hooks/useBottomNav";

type BottomNavItemLinkProps = {
    item: BottomNavItem;
    isActive: boolean;
    onTriggerClick: (e: React.MouseEvent) => void;
};

export const BottomNavItemLink: FC<BottomNavItemLinkProps> = ({
    item,
    isActive,
    onTriggerClick,
}) => {
    const Icon = item.icon;
    const hasBadge = typeof item.badge === "number" && item.badge > 0;
    const isCategoryTab = item.isTrigger === true;

    const handleClick = (e: React.MouseEvent) => {
        if (isCategoryTab) {
            e.preventDefault();
            onTriggerClick(e);
        }
    };

    return (
        <Link
            to={item.to}
            onClick={handleClick}
            className="relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 ease-in-out overflow-visible"
        >
            <div
                className={`relative flex items-center justify-center transition-all duration-500 ease-in-out ${isActive
                        ? "bg-amber-600 text-white w-12 h-12 rounded-full -translate-y-3 shadow-lg shadow-amber-600/30 border-4 border-gray-50 z-10 scale-110"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />

                {hasBadge && (
                    <span
                        className={`absolute flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ring-2 transition-all duration-300 ${isActive
                                ? "-top-1 -right-1 bg-slate-900 text-white ring-amber-600"
                                : "-top-1 -right-1.5 bg-amber-600 text-white ring-white"
                            }`}
                    >
                        {item.badge}
                    </span>
                )}
            </div>

            <span
                className={`tracking-wide transition-all duration-300 text-[10px] ${isActive
                        ? "opacity-0 h-0 -mt-2 invisible pointer-events-none"
                        : "text-slate-400 mt-1"
                    }`}
            >
                {item.label}
            </span>
        </Link>
    );
};