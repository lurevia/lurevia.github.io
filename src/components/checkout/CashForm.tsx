import type { FC } from "react";
import { Banknote, Info } from "lucide-react";

export const CashForm: FC = () => (
    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
        <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                <Banknote size={18} className="text-amber-700" />
            </div>
            <div>
                <p className="text-sm font-bold text-amber-900">
                    Paiement à la réception
                </p>
                <p className="text-xs text-amber-800/80 mt-1 leading-relaxed">
                    Vous paierez en espèces au moment de la livraison. Prévoyez le
                    montant exact si possible.
                </p>
            </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-amber-800/70 pt-2 border-t border-amber-100">
            <Info size={12} className="shrink-0 mt-0.5" />
            <span>
                Ce mode de paiement est disponible uniquement à Antananarivo et
                périphérie.
            </span>
        </div>
    </div>
);