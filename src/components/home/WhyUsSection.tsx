import type { FC } from "react";
import { WhyUsDesktop } from "./desktop/WhyUsDesktop";
import { WhyUsMobile } from "./mobile/WhyUsMobile";


export const WhyUsSection: FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">

      <div className="text-center mb-6 md:mb-10 space-y-1">
        <h2 className="text-lg md:text-2xl font-black tracking-tight text-lurevia-dark uppercase">
          Pourquoi Lurevia ?
        </h2>
        <p className="text-xs font-medium text-slate-500 tracking-wide max-w-xl mx-auto px-2">
          Quatre engagements simples qui guident chacune de nos décisions pour Madagascar.
        </p>
      </div>
      <WhyUsMobile />

      <WhyUsDesktop />

    </section>
  );
};
