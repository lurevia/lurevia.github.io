import type { FC } from "react";
import { X } from "lucide-react";
import type { FilterSidebarProps } from "./FilterSidebar";
import { FilterSidebar } from "./FilterSidebar";

type FilterDrawerProps = FilterSidebarProps & {
  isOpen: boolean;
  onClose: () => void;
};

export const FilterDrawer: FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  ...sidebarProps
}) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
            Filtres
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer les filtres"
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-800"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-4">
          <FilterSidebar {...sidebarProps} />
        </div>
      </aside>
    </>
  );
};