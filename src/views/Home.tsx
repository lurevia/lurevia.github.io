import { useEffect, useState } from "react";
import type { FC } from "react";

import { HeroBanner } from "../components/home/HeroBanner";
import { FeatureBar } from "../components/home/FeatureBar";
import { CategorySection } from "../components/home/CategorySection";
import { ProductGrid } from "../components/home/ProductGrid";
import { ArtisanBanner } from "../components/home/ArtisanBanner";
import { WhyUsSection } from "../components/home/WhyUsSection";
import { PartnerBanner } from "../components/home/PartnerBanner";
import { ScrollReveal } from "../components/common/ScrollReveal";
import { productsApi } from "../api/products";
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

      <div className="relative w-full bg-white">
        <HeroBanner />
      </div>

        <div className="max-w-7xl mx-auto px-2 md:px-12">
          <FeatureBar />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-16 mt-12">
        <ScrollReveal delay={200}>
          <CategorySection />
        </ScrollReveal>

        <ScrollReveal delay={250}>
          <ProductGrid products={products} isLoading={isLoading} />
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <ArtisanBanner />
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <WhyUsSection />
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <PartnerBanner />
        </ScrollReveal>
      </div>
    </div>
  );
};
