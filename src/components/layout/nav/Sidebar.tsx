import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react"; // Pour la petite flèche qui tourne
import { CATEGORIES, NAV_LINKS } from "../../../bin/utils/constant/constant";

type NavbarSidebarProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export const NavbarSidebar: React.FC<NavbarSidebarProps> = ({ isMenuOpen, toggleMenu }) => {
  const location = useLocation();
  
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  return (
    <>
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 md:top-20 bg-slate-950/20 backdrop-blur-xs z-30" onClick={toggleMenu} />
      )}

      <div className={`fixed top-16 md:top-20 left-0 w-[75%] min-w-70 max-w-xs h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] bg-white/80 backdrop-blur-lg border-r border-slate-100 text-slate-800 shadow-2xl transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <div className="mb-6 px-2 flex flex-col items-center border-b border-slate-100 pb-4">
            <h4 className="text-[11px] font-black tracking-[0.2em] text-lurevia-dark uppercase">Lurevia</h4>
            <p className="text-[9px] font-bold tracking-widest text-lurevia-orange uppercase mt-0.5">Be Authentic</p>
          </div>

          <ul className="space-y-1.5">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              const Icon = link.icon;

              if (link.to === "/categories") {
                return (
                  <li key={link.to} className="space-y-1">
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase text-slate-600 hover:bg-slate-50 hover:text-lurevia-dark cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Icon size={16} className="text-lurevia-cyan" strokeWidth={2.5} />
                        <span>{link.label}</span>
                      </div>
                      {isCategoriesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isCategoriesOpen && (
                      <ul className="pl-8 space-y-1 animate-fadeIn">
                        {CATEGORIES.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              to={`/categories/${cat.slug}`}
                              onClick={toggleMenu}
                              className={`block px-4 py-2 rounded-lg text-[11px] font-bold tracking-wide uppercase transition-all ${
                                location.pathname === `/categories/\${cat.slug}`
                                  ? "text-lurevia-orange bg-orange-50/50"
                                  : "text-slate-500 hover:text-lurevia-dark hover:bg-slate-50"
                              }`}
                            >
                              • {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={toggleMenu}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 ${
                      isActive ? "bg-lurevia-orange text-white shadow-lg shadow-lurevia-orange/20" : "text-slate-600 hover:bg-slate-50 hover:text-lurevia-dark"
                    }`}
                  >
                    {Icon && <Icon size={16} className={isActive ? "text-white" : "text-lurevia-cyan"} strokeWidth={2.5} />}
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
          <p className="text-[9px] tracking-widest text-slate-400 font-bold uppercase">Lurevia Horizon — 2026</p>
        </div>
      </div>
    </>
  );
};
