import type { FC } from "react";
import { FEATURES } from "../../../bin/utils/constant/constant";

export const FeatureDesktop: FC = () => {
  return (
    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-b border-slate-200/60">
      {FEATURES.map((feature, index) => {
        const Icon = feature.icon;
        const number = String(index + 1).padStart(2, "0");

        return (
          <div
            key={feature.id}
            className="group relative flex flex-col items-start text-left gap-4 p-6 lg:p-8 transition-colors duration-300 hover:bg-slate-50/60 border-r border-slate-200/60 last:border-r-0 nth-2:border-r-0 lg:nth-2:border-r"
          >
            <span
              aria-hidden="true"
              className="absolute top-4 right-4 text-4xl lg:text-5xl font-black text-slate-100 group-hover:text-lurevia-cyan/20 transition-colors duration-300 select-none"
            >
              {number}
            </span>

            <div className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-lurevia-cyan/10 text-lurevia-cyan transition-all duration-300 group-hover:bg-lurevia-cyan group-hover:text-white group-hover:scale-110 group-hover:-rotate-6">
              <Icon size={20} strokeWidth={1.8} />
            </div>

            <div className="space-y-1.5 relative z-10">
              <h3 className="font-black text-xs uppercase tracking-widest text-lurevia-dark font-sans">
                {feature.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>

            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-lurevia-cyan group-hover:w-full transition-all duration-500 ease-out" />
          </div>
        );
      })}
    </div>
  );
};