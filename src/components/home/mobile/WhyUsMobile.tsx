import type { FC } from "react";
import { WHY_US_ITEMS } from "../../../bin/utils/constant/constant";

export const WhyUsMobile: FC = () => {
    return (
        <div className="grid grid-cols-2 gap-4 md:hidden">
            {WHY_US_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.id}
                        className="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-slate-100 shadow-xs"
                    >
                        <div className="p-2.5 bg-lurevia-cyan/10 text-lurevia-cyan rounded-full mb-3">
                            <Icon size={18} strokeWidth={2} />
                        </div>

                        <h3 className="font-extrabold text-[10px] uppercase tracking-wider text-lurevia-dark font-sans">
                            {item.title}
                        </h3>

                        <p className="text-[10px] font-medium text-slate-500 mt-1.5 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};
