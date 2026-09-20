import type { FC } from "react";
import { ShieldCheck, Lock } from "lucide-react";

/**
 * Paiement par carte.
 *
 * Aucune donnée de carte (numéro, date, CVV) n'est saisie dans
 * l'application : les collecter ici placerait le site dans le périmètre
 * PCI-DSS et exposerait ces données à tout script chargé sur la page.
 * Le paiement est confirmé par le prestataire, qui renvoie au serveur un
 * jeton opaque — la carte ne transite jamais par Lurevia.
 */
export const CardForm: FC = () => (
  <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-white rounded-lg shrink-0">
        <ShieldCheck size={16} className="text-emerald-600" />
      </div>
      <div>
        <p className="text-xs font-black text-lurevia-dark uppercase tracking-wider">
          Paiement sécurisé par notre prestataire
        </p>
        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
          Après validation, vous serez redirigé vers la page sécurisée de notre
          prestataire de paiement pour saisir les informations de votre carte.
          Lurevia ne collecte ni ne conserve aucune donnée bancaire.
        </p>
      </div>
    </div>

    <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
      <Lock size={12} className="text-slate-400" />
      Connexion chiffrée de bout en bout
    </p>
  </div>
);
