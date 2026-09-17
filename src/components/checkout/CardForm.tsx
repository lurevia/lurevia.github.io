import type { FC } from "react";
import { CreditCard, Lock } from "lucide-react";
import { Input } from "../ui/Input";
import type { CardDetails } from "../../bin/types/checkoutType";

type CardFormProps = {
    value: CardDetails;
    onChange: (field: string, value: string) => void;
};

export const CardForm: FC<CardFormProps> = ({ value, onChange }) => {
    const handleNumberChange = (v: string) => {
        const clean = v.replace(/\D/g, "").slice(0, 16);
        const formatted = clean.replace(/(.{4})/g, "$1 ").trim();
        onChange("number", formatted);
    };

    const handleExpiryChange = (v: string) => {
        const clean = v.replace(/\D/g, "").slice(0, 4);
        const formatted =
            clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
        onChange("expiry", formatted);
    };

    return (
        <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <Input
                label="Numéro de carte"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                value={value.number}
                onChange={(e) => handleNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                icon={<CreditCard size={16} />}
                className="font-mono tracking-wider"
            />

            <Input
                label="Titulaire"
                type="text"
                autoComplete="cc-name"
                value={value.holderName}
                onChange={(e) => onChange("holderName", e.target.value.toUpperCase())}
                placeholder="MAHERY RAKOTO"
            />

            <div className="grid grid-cols-2 gap-3">
                <Input
                    label="Expiration"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={value.expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="font-mono"
                />

                <Input
                    label="CVV"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={value.cvv}
                    onChange={(e) =>
                        onChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))
                    }
                    placeholder="123"
                    maxLength={3}
                    icon={<Lock size={16} />}
                    className="font-mono"
                />
            </div>
        </div>
    );
};