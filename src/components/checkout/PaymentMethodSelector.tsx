import type { FC } from "react";
import { Smartphone, CreditCard, Banknote, Check } from "lucide-react";
import type { PaymentMethod } from "../../bin/types/checkoutType";

type PaymentMethodSelectorProps = {
    value: PaymentMethod | null;
    onChange: (method: PaymentMethod) => void;
};

const METHODS: {
    id: PaymentMethod;
    label: string;
    description: string;
    icon: typeof Smartphone;
}[] = [
        {
            id: "mobile-money",
            label: "Mobile Money",
            description: "MVola, Orange Money, Airtel Money",
            icon: Smartphone,
        },
        {
            id: "card",
            label: "Carte bancaire",
            description: "Visa, Mastercard",
            icon: CreditCard,
        },
        {
            id: "cash",
            label: "Paiement à la livraison",
            description: "Payez en espèces à la réception",
            icon: Banknote,
        },
    ];

export const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = ({
    value,
    onChange,
}) => (
    <div className="space-y-3">
        <h3 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
            Méthode de paiement
        </h3>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup">
            {METHODS.map((method) => {
                const Icon = method.icon;
                const isActive = value === method.id;

                return (
                    <li key={method.id}>
                        <button
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => onChange(method.id)}
                            className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${isActive
                                    ? "border-lurevia-orange bg-orange-50/50 shadow-sm"
                                    : "border-slate-200 hover:border-slate-300 active:bg-slate-50"
                                }`}
                        >
                            {isActive && (
                                <span className="absolute top-2 right-2 w-5 h-5 bg-lurevia-orange rounded-full flex items-center justify-center">
                                    <Check size={12} strokeWidth={3} className="text-white" />
                                </span>
                            )}

                            <div
                                className={`p-2 rounded-lg inline-flex mb-2 ${isActive
                                        ? "bg-lurevia-orange text-white"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                <Icon size={18} strokeWidth={2.5} />
                            </div>

                            <p className="text-sm font-black text-slate-800">
                                {method.label}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {method.description}
                            </p>
                        </button>
                    </li>
                );
            })}
        </ul>
    </div>
);