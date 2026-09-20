import type { FC } from "react";
import { CategoryCard } from "../CategoryCard";
import { useCategories } from "../../../hooks/useCategories";


export const CategoryDesktop: FC = () => {
  const { categories } = useCategories();
  const leftSideCategories = categories.slice(0, 2);
  const centerFeaturedCategory = categories[2];
  const rightSideCategories = categories.slice(3, 5);

  return (
    <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
      <div className="md:col-span-1 flex flex-col gap-6">
        {leftSideCategories.map((category) => (
          <CategoryCard key={category.id} category={category} isFeatured={false} />
        ))}
      </div>
      
      {centerFeaturedCategory && (
        <CategoryCard 
          category={centerFeaturedCategory} 
          isFeatured={true} 
        />
      )}
      
      <div className="md:col-span-1 flex flex-col gap-6">
        {rightSideCategories.map((category) => (
          <CategoryCard key={category.id} category={category} isFeatured={false} />
        ))}
      </div>
    </div>
  );
};
