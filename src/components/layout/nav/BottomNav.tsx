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

      <div className="glass-strong md:hidden fixed bottom-0 left-0 right-0 z-50 border-x-0 border-b-0 pb-safe overflow-visible">
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