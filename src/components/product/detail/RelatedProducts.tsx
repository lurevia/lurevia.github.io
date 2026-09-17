import { useMemo } from "react";
import type { FC } from "react";
import { MOCK_PRODUCTS } from "../../../bin/data/mock";
import { ProductCard } from "../../home/ProductCard";
import { ScrollReveal } from "../../common/ScrollReveal";
import type { Product } from "../../../bin/types/homeType";

type RelatedProductsProps = {
  currentProduct: Product;
  limit?: number;
};

export const RelatedProducts: FC<RelatedProductsProps> = ({
  currentProduct,
  limit = 4,
}) => {
  const related = useMemo(() => {
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.id !== currentProduct.id &&
        p.categorySlugs.some((s) => currentProduct.categorySlugs.includes(s))
    ).slice(0, limit);
  }, [currentProduct, limit]);

  if (related.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-lurevia-dark">
          Vous aimerez aussi
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          D’autres créations de la même catégorie.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {related.map((product, i) => (
          <ScrollReveal key={product.id} delay={i * 80}>
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};