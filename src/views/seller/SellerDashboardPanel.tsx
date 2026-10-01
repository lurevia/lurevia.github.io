import { Star } from "lucide-react";
import type { SellerStats } from "../../api/seller";
import type { ServiceFeedback } from "../../bin/types/feedbackType";
import { formatSellerMoney } from "./sellerDisplay";

type SellerDashboardPanelProps = {
  stats: SellerStats | null;
  feedback: ServiceFeedback[];
};

export const SellerDashboardPanel = ({
  stats,
  feedback,
}: SellerDashboardPanelProps) => {
  const summary = [
    { label: "Produits", value: stats?.products ?? 0 },
    { label: "Ventes", value: stats?.sales ?? 0 },
    { label: "Chiffre d'affaires", value: stats?.revenue ?? 0 },
    { label: "Avis", value: stats?.feedbackCount ?? 0 },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {summary.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-2xl bg-white border border-slate-100 p-5"
          >
            <p className="text-xs font-bold text-slate-400">{label}</p>
            <p className="mt-2 text-xl font-black text-lurevia-dark">
              {label === "Chiffre d'affaires"
                ? formatSellerMoney(Number(value))
                : value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-white border border-slate-100 p-5">
        <h2 className="font-black text-lurevia-dark mb-4">
          Derniers retours clients
        </h2>
        {feedback.length === 0 ? (
          <p className="text-sm text-slate-400">Aucun retour pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {feedback.slice(0, 6).map((item) => (
              <article key={item.id} className="border-b border-slate-100 pb-3">
                <div className="flex justify-between">
                  <b className="text-sm">{item.userName}</b>
                  <span className="flex items-center gap-1 text-xs font-bold text-lurevia-orange">
                    <Star size={13} fill="currentColor" />
                    {item.overallRating}/5
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{item.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};
