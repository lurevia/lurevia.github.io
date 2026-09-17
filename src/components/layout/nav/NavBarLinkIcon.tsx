import React from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type NavbarLinkIconProps = {
  to: string;
  icon: LucideIcon;
  label: string;
  badgeCount?: number;
  badgeColorClass?: string;
};

export const NavbarLinkIcon: React.FC<NavbarLinkIconProps> = ({
  to,
  icon: Icon,
  label,
  badgeCount = 0,
  badgeColorClass = "bg-slate-900",
}) => {
  return (
    <Link
      to={to}
      className="relative flex items-center justify-center group focus:outline-none"
      aria-label={label}
    >
      <div className="relative flex items-center justify-center w-11 h-11 rounded-full border border-slate-100 bg-slate-50/50 text-slate-700 transition-all duration-300 ease-out group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 group-hover:scale-105 shadow-xs">
        <Icon size={20} strokeWidth={1.5} className="transition-transform duration-300 group-hover:rotate-3" />
        
        {badgeCount > 0 && (
          <span className={`absolute -top-1 -right-1 text-white text-[9px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center ring-2 ring-white transition-transform duration-300 group-hover:scale-110 ${badgeColorClass}`}>
            {badgeCount}
          </span>
        )}
      </div>
    </Link>
  );
};
