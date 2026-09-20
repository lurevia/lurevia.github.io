import { useState } from "react";
import type { FC } from "react";
import { Package, Receipt } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { OrderCard } from "../../components/account/OrderCard";
import { formatAriary } from "../../bin/utils/formatAriary";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import type { OrderStatus } from "../../bin/types/orderType";

const TABS: { id: OrderStatus | "all"; label: string }[] = [
    { id: "all", label: "Tout" },
    { id: "pending", label: "En attente" },
    { id: "paid", label: "Payées" },
    { id: "shipped", label: "Expédiées" },
    { id: "delivered", label: "Livrées" },
    { id: "cancelled", label: "Annulées" },
];

export const OrdersPage: FC = () => {
    const { orders, transactions, isLoading, error } = useOrders();
    const [tab, setTab] = useState<OrderStatus | "all">("all");

    const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);

    return (
        <>
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
                    Mes commandes
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    {orders.length} commande{orders.length > 1 ? "s" : ""} passée
                    {orders.length > 1 ? "s" : ""}
                </p>
            </div>

            {orders.length > 0 && (
                <div className="flex gap-1 overflow-x-auto pb-1">
                    {TABS.map((t) => {
                        const active = tab === t.id;
                        const count =
                            t.id === "all"
                                ? orders.length
                                : orders.filter((o) => o.status === t.id).length;

                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setTab(t.id)}
                                disabled={count === 0 && t.id !== "all"}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 ${active
                                        ? "bg-lurevia-dark text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {t.label}
                                {count > 0 && (
                                    <span className={`ml-1.5 ${active ? "opacity-70" : "opacity-60"}`}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-16" role="status">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
                    <span className="sr-only">Chargement des commandes</span>
                </div>
            ) : error ? (
                <div className="text-center py-16 text-slate-400 text-sm">{error}</div>
            ) : orders.length === 0 ? (
                <EmptyOrders />
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                    Aucune commande dans ce filtre.
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}

            {transactions.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
                    <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider flex items-center gap-2">
                        <Receipt size={16} />
                        Historique des transactions
                    </h2>

                    <ul className="divide-y divide-slate-100">
                        {transactions.map((t) => (
                            <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 font-mono truncate">
                                        #{t.id.slice(-8).toUpperCase()}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        {new Date(t.date).toLocaleDateString("fr-FR")} ·{" "}
                                        {t.method.replace("-", " ")}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-black text-slate-800">
                                        {formatAriary(t.amount)}
                                    </p>
                                    <p
                                        className={`text-[10px] font-black uppercase ${t.status === "success"
                                                ? "text-emerald-600"
                                                : t.status === "pending"
                                                    ? "text-amber-600"
                                                    : "text-red-500"
                                            }`}
                                    >
                                        {t.status}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
};

const EmptyOrders: FC = () => (
    <div className="text-center py-16 md:py-20 max-w-md mx-auto">
        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-5">
            <Package size={40} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-black text-lurevia-dark">
            Aucune commande pour l’instant
        </h2>
        <p className="text-sm text-slate-500 mt-2">
            Vos commandes apparaîtront ici dès que vous en aurez passé une.
        </p>
        <Link to="/boutique" className="inline-block mt-5">
            <Button variant="primary" className="rounded-full! px-6! py-3!">
                Découvrir la boutique
            </Button>
        </Link>
    </div>
);