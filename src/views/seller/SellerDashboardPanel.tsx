import { useState } from "react";
import { BarChart3, Star, TrendingUp } from "lucide-react";
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
  const [metric, setMetric] = useState<"revenue" | "sales">("revenue");
  const daily = stats?.daily ?? [];
  const topProducts = stats?.topProducts ?? [];
  const maxDailyValue = Math.max(1, ...daily.map((day) => day[metric]));
  const summary = [
    { label: "Produits", value: stats?.products ?? 0 },
    { label: "Articles vendus", value: stats?.sales ?? 0 },
    { label: "Chiffre d'affaires", value: stats?.revenue ?? 0 },
    { label: "Commandes à traiter", value: stats?.pendingOrders ?? 0 },
    { label: "Avis", value: stats?.feedbackCount ?? 0 },
  ];

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
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

      <section className="rounded-2xl bg-white border border-slate-100 p-5 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-lurevia-orange">
              <BarChart3 size={17} />
              <p className="text-xs font-black uppercase tracking-wider">Performance</p>
            </div>
            <h2 className="mt-1 text-lg font-black text-lurevia-dark">Activité des 30 derniers jours</h2>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 p-1" aria-label="Mesure du graphique">
            <button
              type="button"
              aria-pressed={metric === "revenue"}
              onClick={() => setMetric("revenue")}
              className={`rounded-md px-3 py-1.5 text-xs font-bold ${metric === "revenue" ? "bg-lurevia-dark text-white" : "text-slate-500"}`}
            >
              Chiffre d’affaires
            </button>
            <button
              type="button"
              aria-pressed={metric === "sales"}
              onClick={() => setMetric("sales")}
              className={`rounded-md px-3 py-1.5 text-xs font-bold ${metric === "sales" ? "bg-lurevia-dark text-white" : "text-slate-500"}`}
            >
              Commandes
            </button>
          </div>
        </div>

        {daily.length > 0 ? (
          <div className="mt-7" role="img" aria-label={metric === "revenue" ? "Chiffre d’affaires quotidien sur 30 jours" : "Commandes quotidiennes sur 30 jours"}>
            <div className="flex h-44 items-end gap-1 border-b border-slate-200 px-1">
              {daily.map((day) => {
                const value = day[metric];
                const height = value > 0 ? Math.max(5, (value / maxDailyValue) * 100) : 2;
                return (
                  <div
                    key={day.date}
                    title={`${new Date(`${day.date}T12:00:00`).toLocaleDateString("fr-FR")}: ${metric === "revenue" ? formatSellerMoney(value) : `${value} commande(s)`}`}
                    className={`min-w-0 flex-1 rounded-t-sm ${metric === "revenue" ? "bg-lurevia-orange" : "bg-emerald-600"}`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-400">
              <span>{daily[0]?.date}</span>
              <span>{daily[Math.floor(daily.length / 2)]?.date}</span>
              <span>{daily.at(-1)?.date}</span>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-400">Les statistiques apparaîtront avec vos premières commandes.</p>
        )}
      </section>

      <section className="rounded-2xl bg-white border border-slate-100 p-5 mb-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={17} className="text-lurevia-orange" />
          <h2 className="font-black text-lurevia-dark">Produits les plus vendus</h2>
        </div>
        {topProducts.length ? (
          <div className="space-y-3">
            {topProducts.map((product, index) => {
              const maximum = topProducts[0]?.unitsSold || 1;
              return (
                <div key={product.id} className="grid grid-cols-[2rem_minmax(0,1fr)_4rem] items-center gap-3">
                  <span className="text-xs font-black text-slate-400">0{index + 1}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-700">{product.title}</p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-lurevia-orange" style={{ width: `${(product.unitsSold / maximum) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-right text-xs font-bold text-slate-500">{product.unitsSold} ventes</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400">Aucune vente enregistrée.</p>
        )}
      </section>

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
