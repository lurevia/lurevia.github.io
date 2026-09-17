import type { FC } from "react";
import type { Product } from "../../bin/types/homeType";
import { ProductCard } from "../home/ProductCard";
import { ScrollReveal } from "../common/ScrollReveal";

type FavoritesGridProps = {
  products: Product[];
};

export const FavoritesGrid: FC<FavoritesGridProps> = ({ products }) => {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {products.map((product, i) => (
        <ScrollReveal key={product.id} delay={i * 60}>
          <ProductCard product={product} />
        </ScrollReveal>
      ))}
    </div>
  );
};