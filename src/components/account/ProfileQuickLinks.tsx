import { Bell, ChevronRight, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { VerificationStatus } from "../../api/verification";

type ProfileQuickLinksProps = {
  unreadCount: number;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
};

export const ProfileQuickLinks = ({
  unreadCount,
  isVerified,
  verificationStatus,
}: ProfileQuickLinksProps) => (
  <>
    {unreadCount > 0 && (
      <Link
        to="/compte/notifications"
        className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl hover:bg-orange-100/70 transition-colors"
      >
        <div className="p-2 bg-lurevia-orange rounded-lg shrink-0">
          <Bell size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-lurevia-dark">
            {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue
            {unreadCount > 1 ? "s" : ""}
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">
            Découvrez les mises à jour de vos commandes et rappels d’avis.
          </p>
        </div>
        <ChevronRight size={16} className="text-lurevia-orange shrink-0" />
      </Link>
    )}

    <Link
      to="/compte/verification"
      className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all"
    >
      <div
        className={`p-2 rounded-lg ${
          isVerified ? "bg-emerald-50" : "bg-orange-50"
        }`}
      >
        <ShieldCheck
          size={16}
          className={isVerified ? "text-emerald-600" : "text-lurevia-orange"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-lurevia-dark">
          Vérification du compte
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {isVerified
            ? "Compte vérifié"
            : verificationStatus === "PENDING"
              ? "Demande CIN en attente d’examen manuel"
              : "Soumettre mon numéro CIN"}
        </p>
      </div>
      <ChevronRight size={16} className="text-slate-400 shrink-0" />
    </Link>

    <Link
      to="/compte/avis"
      className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all"
    >
      <div className="p-2 bg-yellow-50 rounded-lg shrink-0">
        <Star size={16} className="text-lurevia-yellow fill-lurevia-yellow" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-lurevia-dark">
          Mes avis &amp; feedbacks
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Voir vos avis produits et vos feedbacks service
        </p>
      </div>
      <ChevronRight size={16} className="text-slate-400 shrink-0" />
    </Link>
  </>
);
