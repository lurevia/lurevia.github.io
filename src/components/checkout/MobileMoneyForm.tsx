import type { FC } from "react";
import { Phone } from "lucide-react";
import { Input } from "../ui/Input";
import { PaymentLogo, MOBILE_MONEY_PROVIDERS } from "./PaymentLogo";
import type { MobileMoneyDetails } from "../../bin/types/checkoutType";

type MobileMoneyFormProps = {
    value: MobileMoneyDetails;
    onChange: (field: string, value: string) => void;
};

/**
 * MobileMoneyForm
 *
 * Formulaire de saisie des informations de paiement par mobile money
 * (MVola, Orange Money, Airtel Money). L'opérateur est sélectionné via
 * des cartes affichant le logo officiel de chaque marque (avec repli
 * automatique tant que l'asset n'est pas fourni, voir `PaymentLogo`).
 * Le numéro de téléphone est pré-rempli en amont, dans `useCheckout`,
 * à partir du numéro enregistré sur le compte de l'utilisateur connecté.
 *
 * @param value État courant des détails de paiement mobile money
 * @param onChange Gestionnaire générique de mise à jour d'un champ
 */
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
                {MOBILE_MONEY_PROVIDERS.map((p) => {
                    const active = value.provider === p.id;
                    return (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => onChange("provider", p.id)}
                            aria-pressed={active}
                            className={`flex flex-col items-center justify-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all cursor-pointer active:scale-95 ${active
                                ? "border-lurevia-orange bg-white shadow-sm"
                                : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                        >
                            <PaymentLogo provider={p.id} className="h-6 max-w-22" />
                            <span className="text-[10px] font-bold text-slate-600">{p.label}</span>
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
