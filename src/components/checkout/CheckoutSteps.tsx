import type { FC } from "react";
import { Check } from "lucide-react";

type CheckoutStepsProps = {
    currentStep: 1 | 2 | 3;
};

const STEPS = [
    { id: 1, label: "Livraison" },
    { id: 2, label: "Paiement" },
    { id: 3, label: "Confirmation" },
];

export const CheckoutSteps: FC<CheckoutStepsProps> = ({ currentStep }) => (
    <ol className="flex items-center justify-center gap-2 md:gap-4 mb-8">
        {STEPS.map((step, i) => {
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
                <li key={step.id} className="flex items-center gap-2 md:gap-4">
                    <div className="flex items-center gap-2">
                        <span
                            className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-black transition-colors ${isDone
                                    ? "bg-emerald-500 text-white"
                                    : isActive
                                        ? "bg-lurevia-orange text-white ring-4 ring-orange-100"
                                        : "bg-slate-100 text-slate-400"
                                }`}
                        >
                            {isDone ? <Check size={14} strokeWidth={3} /> : step.id}
                        </span>
                        <span
                            className={`text-xs md:text-sm font-bold ${isActive ? "text-lurevia-dark" : "text-slate-400"
                                } hidden sm:inline`}
                        >
                            {step.label}
                        </span>
                    </div>

                    {i < STEPS.length - 1 && (
                        <span
                            className={`w-6 md:w-12 h-0.5 rounded-full ${isDone ? "bg-emerald-500" : "bg-slate-200"
                                }`}
                        />
                    )}
                </li>
            );
        })}
    </ol>
);