import type { FC } from "react";
import { CategoryCard } from "../CategoryCard";
import { useCategories } from "../../../hooks/useCategories";

export const CategoryDesktop: FC = () => {
  const { categories } = useCategories();

  const [featured, ...others] = categories;

  if (!featured || others.length < 4) return null;

  const [topLeft, topRight, bottomLeft, bottomRight] = others;

  return (
    <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-2 h-130">
      <div className="col-span-5 row-span-2">
        <CategoryCard category={featured} isFeatured size="lg" />
      </div>

      <div className="col-span-4 row-span-1">
        <CategoryCard category={topLeft} size="md" />
      </div>
      <div className="col-span-3 row-span-1">
        <CategoryCard category={topRight} size="sm" />
      </div>

      <div className="col-span-3 row-span-1">
        <CategoryCard category={bottomLeft} size="sm" />
      </div>
      <div className="col-span-4 row-span-1">
        <CategoryCard category={bottomRight} size="md" />
      </div>
    </div>
  );
};