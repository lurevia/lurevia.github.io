import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, CheckCheck, Inbox, X, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Button } from "../ui/Button";

export const NotificationBell: FC = () => {
    const { isAuthenticated } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();

    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    /** Ferme le panneau si on change de page */
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    /** 🔒 Bloque le scroll du body quand ouvert sur mobile */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    /** Ferme le panneau si on clique ailleurs (desktop uniquement) */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    /** ⌨️ Ferme avec Échap */
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) setIsOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen]);

    if (!isAuthenticated) return null;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={`Notifications (${unreadCount})`}
                aria-expanded={isOpen}
                className="relative p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
                <Bell size={20} className="text-slate-700" />
                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-4 h-4 px-1 bg-lurevia-orange text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="md:hidden fixed inset-0 z-100 bg-white flex flex-col animate-fadeIn">
                    <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Fermer"
                            className="p-2 -ml-2 hover:bg-slate-100 rounded-full cursor-pointer"
                        >
                            <ArrowLeft size={20} className="text-slate-700" />
                        </button>

                        <h1 className="text-lg font-black text-lurevia-dark flex-1">
                            Notifications
                        </h1>

                        {unreadCount > 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                icon={CheckCheck}
                                onClick={markAllAsRead}
                                className="text-[11px]! text-lurevia-orange! hover:bg-orange-50! px-2! py-1! h-auto!"
                            >
                                Tout lire
                            </Button>
                        )}
                    </header>

                    {/* Compteur */}
                    {unreadCount > 0 && (
                        <div className="px-4 py-2 bg-orange-50/50 border-b border-orange-100">
                            <p className="text-[11px] font-bold text-lurevia-orange">
                                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                            </p>
                        </div>
                    )}

                    {/* Liste scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                                <div className="inline-flex p-6 bg-slate-50 rounded-full mb-4">
                                    <Inbox size={40} className="text-slate-300" strokeWidth={1.5} />
                                </div>
                                <p className="text-base font-black text-slate-600">
                                    Aucune notification
                                </p>
                                <p className="text-sm text-slate-400 mt-1 max-w-xs">
                                    Vous serez prévenu ici des mises à jour de vos commandes et
                                    rappels d’avis.
                                </p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {notifications.map((notif) => (
                                    <li key={notif.id}>
                                        <NotificationItem
                                            notification={notif}
                                            onClick={() => {
                                                markAsRead(notif.id);
                                                setIsOpen(false);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {isOpen && (
                <div
                    ref={panelRef}
                    className="hidden md:block absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fadeIn"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
                        <div>
                            <h3 className="text-sm font-black text-lurevia-dark">
                                Notifications
                            </h3>
                            {unreadCount > 0 && (
                                <p className="text-[11px] text-slate-500">
                                    {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    icon={CheckCheck}
                                    onClick={markAllAsRead}
                                    className="text-[10px]! text-lurevia-orange! hover:bg-orange-50! px-2! py-1! h-auto!"
                                >
                                    Tout lire
                                </Button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Fermer"
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Liste */}
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="inline-flex p-4 bg-slate-50 rounded-full mb-3">
                                <Inbox size={24} className="text-slate-300" />
                            </div>
                            <p className="text-xs font-bold text-slate-600">
                                Aucune notification
                            </p>
                            <p className="text-[11px] text-slate-400 mt-1">
                                Vous serez prévenu ici.
                            </p>
                        </div>
                    ) : (
                        <>
                            <ul className="max-h-96 overflow-y-auto divide-y divide-slate-100">
                                {notifications.slice(0, 6).map((notif) => (
                                    <li key={notif.id}>
                                        <NotificationItem
                                            notification={notif}
                                            onClick={() => {
                                                markAsRead(notif.id);
                                                setIsOpen(false);
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>

                            {notifications.length > 6 && (
                                <Link
                                    to="/compte/notifications"
                                    onClick={() => setIsOpen(false)}
                                    className="block text-center text-xs font-bold text-lurevia-orange py-3 border-t border-slate-100 hover:bg-orange-50/50 transition-colors"
                                >
                                    Voir toutes les notifications
                                </Link>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    );
};