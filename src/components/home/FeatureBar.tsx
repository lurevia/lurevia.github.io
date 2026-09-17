import type { FC } from "react";
import { FeatureDesktop } from "./desktop/FeatureDesktop";
import { FeatureMobile } from "./mobile/FeatureMobile";


export const FeatureBar: FC = () => {
  return (
    <section className="bg-transparent max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">
      <FeatureMobile />

      <FeatureDesktop />
    </section>
  );
};
