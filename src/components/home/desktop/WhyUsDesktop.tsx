import type { FC } from "react";
import { WHY_US_ITEMS } from "../../../bin/utils/constant/constant";

export const WhyUsDesktop: FC = () => {
    return (
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.id}
                        className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-slate-100/80 transition-all duration-300 hover:border-slate-200/80 hover:-translate-y-1 group shadow-xs"
                    >
                        <div className="p-3 bg-lurevia-cyan/10 text-lurevia-cyan rounded-full mb-4 transition-colors duration-300 group-hover:bg-lurevia-dark group-hover:text-white">
                            <Icon size={22} strokeWidth={1.5} className="transition-transform duration-300 group-hover:scale-105" />
                        </div>

                        <h3 className="font-bold text-xs uppercase tracking-wider text-lurevia-dark font-sans">
                            {item.title}
                        </h3>

                        <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed max-w-60">
                            {item.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
