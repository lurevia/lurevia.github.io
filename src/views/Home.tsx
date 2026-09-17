import React from "react";
import { HeroBanner } from "../components/home/HeroBanner";
import { FeatureBar } from "../components/home/FeatureBar";
import { CategorySection } from "../components/home/CategorySection";
import { ProductGrid } from "../components/home/ProductGrid";
import { ArtisanBanner } from "../components/home/ArtisanBanner";
import { WhyUsSection } from "../components/home/WhyUsSection";
import { PartnerBanner } from "../components/home/PartnerBanner";
import { MOCK_PRODUCTS } from "../bin/data/mock";
import { ScrollReveal } from "../components/common/ScrollReveal";

export const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      <ScrollReveal delay={100}>
        <HeroBanner />
      </ScrollReveal>
      <ScrollReveal delay={150}>
        <FeatureBar />
      </ScrollReveal>
      <ScrollReveal delay={200}>
        <CategorySection />
      </ScrollReveal>

      <ScrollReveal delay={250}>
        <ProductGrid products={MOCK_PRODUCTS} />
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
  );
};
