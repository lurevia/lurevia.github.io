import type { FC } from "react";
import { CategoryDropdown } from "./CategoryDropdown";
import { BottomNavItemLink } from "./BottomNavItemLink";
import { useBottomNav } from "../../../hooks/useBottomNav";

export const BottomNav: FC = () => {
  const {
    isDropdownOpen,
    orderedNavItems,
    activeItem,
    currentPath,
    toggleDropdown,
    closeDropdown,
  } = useBottomNav();

  return (
    <>
      <CategoryDropdown
        isOpen={isDropdownOpen}
        currentPath={currentPath}
        onClose={closeDropdown}
      />

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-t border-white/20 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.06)] overflow-visible">
        <nav
          className="flex justify-around items-center h-16 px-2 relative overflow-visible"
          aria-label="Navigation mobile"
        >
          {orderedNavItems.map((item) => (
            <BottomNavItemLink
              key={item.to}
              item={item}
              isActive={item.to === activeItem.to}
              onTriggerClick={toggleDropdown}
            />
          ))}
        </nav>
      </div>
    </>
  );
};