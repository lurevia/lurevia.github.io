import React from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../../../bin/utils/constant/constant";

type NavbarSidebarProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export const NavbarSidebar: React.FC<NavbarSidebarProps> = ({ isMenuOpen, toggleMenu }) => {
  const location = useLocation();

  return (
    <>
      {isMenuOpen && (
        <div 
          className="fixed inset-0 top-20 bg-black/5 z-30 transition-opacity duration-300" 
          onClick={toggleMenu} 
        />
      )}

      <div
        className={`fixed top-20 right-0 w-[30%] min-w-70 max-w-xs h-[calc(100vh-80px)] bg-lurevia-dark border-l border-white/10 text-white shadow-2xl transition-transform duration-300 ease-in-out z-40 overflow-y-auto no-scrollbar flex flex-col justify-between ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="mb-6 px-2 flex flex-col items-center border-b border-white/10 pb-4">
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-lurevia-cyan uppercase">Lurevia</h4>
            <p className="text-[9px] font-medium tracking-widest text-lurevia-yellow uppercase mt-0.5">Be Authentic</p>
          </div>

          <ul className="space-y-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={toggleMenu}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                      isActive
                        ? "bg-lurevia-orange text-white shadow-lg"
                        : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {Icon && <Icon size={16} className={isActive ? "text-white" : "text-lurevia-cyan"} strokeWidth={2} />}
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/10 text-center">
          <p className="text-[9px] tracking-widest text-white/40 uppercase">Lurevia Horizon — 2026</p>
        </div>
      </div>
    </>
  );
};
