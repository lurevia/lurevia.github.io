import type { FC } from "react";
import { FEATURES } from "../../../bin/utils/constant/constant";

export const FeatureDesktop: FC = () => {
  return (
    <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {FEATURES.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.id}
            className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-100 transition-all duration-300 hover:border-slate-200/80 hover:-translate-y-1 group shadow-xs"
          >
            <div className="shrink-0 p-3 bg-lurevia-cyan/10 rounded-full transition-colors duration-300 group-hover:bg-lurevia-dark group-hover:text-white">
              <Icon size={20} strokeWidth={1.5} className="text-lurevia-cyan transition-colors duration-300 group-hover:text-white" />
            </div>

            <div className="space-y-1 text-left">
              <h3 className="font-bold text-xs uppercase tracking-wider text-lurevia-dark font-sans">
                {feature.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
