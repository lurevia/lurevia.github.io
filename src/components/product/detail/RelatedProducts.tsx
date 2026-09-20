import { useEffect, useState } from "react";
import type { FC } from "react";

import { productsApi } from "../../../api/products";
import { ProductCard } from "../../home/ProductCard";
import { ScrollReveal } from "../../common/ScrollReveal";
import type { Product } from "../../../bin/types/homeType";

type RelatedProductsProps = {
  currentProduct: Product;
  limit?: number;
};

/** Suggestions calculées par l'API (`/products/:id/related`). */
export const RelatedProducts: FC<RelatedProductsProps> = ({
  currentProduct,
  limit = 4,
}) => {
  const [related, setRelated] = useState<Product[]>([]);
  const productId = currentProduct.id;

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const results = await productsApi.getRelated(productId, limit, controller.signal);
        if (!controller.signal.aborted) setRelated(results);
      } catch {
        if (!controller.signal.aborted) setRelated([]);
      }
    };

    void load();
    return () => controller.abort();
  }, [productId, limit]);

  if (related.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-lurevia-dark">Vous aimerez aussi</h2>
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
