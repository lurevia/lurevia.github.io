import type { FC } from "react";
import { CategoryCard } from "../CategoryCard";
import { useCategories } from "../../../hooks/useCategories";

export const CategoryDesktop: FC = () => {
  const { categories } = useCategories();

  if (categories.length === 0) return null;

  return (
    <div className="hidden md:grid grid-cols-2 gap-3 lg:grid-cols-4">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={index === 0 ? "h-96 lg:col-span-2 lg:row-span-2" : "h-44"}
        >
          <CategoryCard
            category={category}
            isFeatured={index === 0}
            size={index === 0 ? "lg" : "md"}
          />
        </div>
      ))}
    </div>
  );
};