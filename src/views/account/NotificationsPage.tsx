import { useMemo, useState } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import {
    Bell,
    CheckCheck,
    Inbox,
    Package,
    Star,
    Truck,
    CheckCircle2,
    Tag,
    ArrowLeft,
} from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationItem } from "../../components/notifications/NotificationItem";
import { Button } from "../../components/ui/Button";
import type { NotificationType } from "../../bin/types/notificationType";

type Filter = "all" | "unread" | "review_pending" | "orders";

const TABS: { id: Filter; label: string; icon: typeof Bell }[] = [
    { id: "all", label: "Tout", icon: Bell },
    { id: "unread", label: "Non lues", icon: Inbox },
    { id: "review_pending", label: "Avis", icon: Star },
    { id: "orders", label: "Commandes", icon: Package },
];

export const NotificationsPage: FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();
    const [filter, setFilter] = useState<Filter>("all");

    const filtered = useMemo(() => {
        switch (filter) {
            case "unread":
                return notifications.filter((n) => !n.read);

            case "review_pending":
                return notifications.filter((n) => n.type === "review_pending");

            case "orders":
                return notifications.filter(
                    (n) =>
                        n.type === "order_shipped" || n.type === "order_delivered"
                );

            case "all":
            default:
                return notifications;
        }
    }, [notifications, filter]);

    const counts: Record<Filter, number> = useMemo(
        () => ({
            all: notifications.length,
            unread: unreadCount,
            review_pending: notifications.filter(
                (n) => n.type === "review_pending"
            ).length,
            orders: notifications.filter(
                (n) =>
                    n.type === "order_shipped" || n.type === "order_delivered"
            ).length,
        }),
        [notifications, unreadCount]
    );

    return (
        <>
            <Link
                to="/compte"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark transition-colors uppercase tracking-wider"
            >
                <ArrowLeft size={14} />
                Retour au compte
            </Link>

            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
                        Notifications
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {notifications.length === 0
                            ? "Aucune notification pour le moment"
                            : unreadCount > 0
                                ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""} sur ${notifications.length
                                }`
                                : `${notifications.length} notification${notifications.length > 1 ? "s" : ""
                                }`}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={CheckCheck}
                        onClick={() => void markAllAsRead()}
                        className="text-lurevia-orange! hover:bg-orange-50! text-[11px]!"
                    >
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="flex gap-1 overflow-x-auto pb-1">
                    {TABS.map((t) => {
                        const active = filter === t.id;
                        const count = counts[t.id];
                        const Icon = t.icon;

                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setFilter(t.id)}
                                disabled={count === 0 && t.id !== "all"}
                                className={`inline-flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer disabled:opacity-30 ${active
                                        ? "bg-lurevia-dark text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                <Icon size={12} />
                                {t.label}
                                {count > 0 && (
                                    <span
                                        className={`ml-0.5 ${active ? "opacity-70" : "opacity-60"
                                            }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {notifications.length === 0 ? (
                <EmptyNotifications />
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                    Aucune notification dans ce filtre.
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {filtered.map((notif) => (
                        <NotificationItem
                            key={notif.id}
                            notification={notif}
                            onClick={() => void markAsRead(notif.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

const EmptyNotifications: FC = () => (
    <div className="text-center py-16 md:py-20 max-w-md mx-auto">
        <div className="inline-flex p-6 bg-slate-50 rounded-full mb-5">
            <Bell size={40} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-black text-lurevia-dark">
            Aucune notification
        </h2>
        <p className="text-sm text-slate-500 mt-2">
            Vous recevrez ici les mises à jour de vos commandes et les rappels pour
            laisser un avis sur vos achats.
        </p>
        <Link to="/boutique" className="inline-block mt-5">
            <Button
                variant="primary"
                className="rounded-full! px-6! py-3!"
            >
                Découvrir la boutique
            </Button>
        </Link>
    </div>
);

export const NOTIFICATION_ICONS = {
    order_shipped: Truck,
    order_delivered: CheckCircle2,
    review_pending: Star,
    promo: Tag,
} as const satisfies Record<NotificationType, typeof Bell>;