import type { FC } from "react";
import { FEATURES } from "../../../bin/utils/constant/constant";

export const FeatureMobile: FC = () => {
  return (
    <div className="block md:hidden w-full overflow-x-auto overflow-y-hidden scrollbar-none snap-x snap-mandatory">
      <div className="flex gap-4 pb-3 w-max px-1">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-xs w-64 shrink-0 snap-start"
            >
              <div className="shrink-0 p-2.5 bg-lurevia-cyan/10 rounded-full text-lurevia-cyan">
                <Icon size={18} strokeWidth={2} />
              </div>

              <div className="space-y-0.5 text-left min-w-0">
                <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-lurevia-dark font-sans truncate">
                  {feature.title}
                </h3>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
