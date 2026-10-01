import { useEffect, useState } from "react";
import type { FC } from "react";

import { ProductGrid } from "../components/home/ProductGrid";
import { productsApi } from "../api/products";
import { ContentPage } from "./ContentPage";
import type { Product } from "../bin/types/homeType";

const POPULAR_LIMIT = 10;

export const Home: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const page = await productsApi.list(
          {
            page: 1,
            limit: POPULAR_LIMIT,
            sortBy: "popular",
            availability: "in-stock",
          },
          controller.signal
        );
        if (!controller.signal.aborted) setProducts(page.products);
      } catch {
        if (!controller.signal.aborted) setProducts([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <ContentPage slug="accueil" />
      <div className="mx-auto mt-10 max-w-7xl px-4 md:px-6">
        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  );
};
