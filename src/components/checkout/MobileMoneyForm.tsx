import type { FC } from "react";
import { Phone } from "lucide-react";
import { Input } from "../ui/Input";
import type { MobileMoneyDetails } from "../../bin/types/checkoutType";

type MobileMoneyFormProps = {
    value: MobileMoneyDetails;
    onChange: (field: string, value: string) => void;
};

const PROVIDERS = [
    { id: "mvola", label: "MVola", color: "#FFCC00" },
    { id: "orange-money", label: "Orange Money", color: "#FF7900" },
    { id: "airtel-money", label: "Airtel Money", color: "#E40000" },
] as const;

export const MobileMoneyForm: FC<MobileMoneyFormProps> = ({
    value,
    onChange,
}) => (
    <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                Opérateur
            </label>
            <div className="grid grid-cols-3 gap-2">
                {PROVIDERS.map((p) => {
                    const active = value.provider === p.id;
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => onChange("provider", p.id)}
                            aria-pressed={active}
                            className={`relative px-3 py-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer active:scale-95 ${active
                                ? "border-lurevia-orange bg-white shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                        >
                            <span
                                className="inline-block w-2 h-2 rounded-full mr-1.5"
                                style={{ backgroundColor: p.color }}
                            />
                            {p.label}
                        </button>
                    );
                })}
            </div>
        </div>

        <Input
            label="Numéro de téléphone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={value.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value)}
            placeholder="034 12 345 67"
            icon={<Phone size={16} />}
            hint="Vous recevrez une demande de confirmation sur ce numéro."
        />
    </div>
);