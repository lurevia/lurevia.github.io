import { ArrowLeft, CheckCheck, Inbox } from "lucide-react";
import type { AppNotification } from "../../bin/types/notificationType";
import { NotificationItem } from "./NotificationItem";
import { Button } from "../ui/Button";

type MobileNotificationPanelProps = {
  notifications: AppNotification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onClose: () => void;
};

export const MobileNotificationPanel = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: MobileNotificationPanelProps) => (
  <div className="md:hidden fixed inset-0 z-100 bg-white flex flex-col animate-fadeIn">
    <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white sticky top-0 z-10">
      <button
        type="button"
        onClick={onClose}
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
          onClick={() => void onMarkAllAsRead()}
          className="text-[11px]! text-lurevia-orange! hover:bg-orange-50! px-2! py-1! h-auto!"
        >
          Tout lire
        </Button>
      )}
    </header>

    {unreadCount > 0 && (
      <div className="px-4 py-2 bg-orange-50/50 border-b border-orange-100">
        <p className="text-[11px] font-bold text-lurevia-orange">
          {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
        </p>
      </div>
    )}

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
            Vous serez prévenu ici des mises à jour de vos commandes et rappels
            d’avis.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem
                notification={notification}
                onClick={() => {
                  void onMarkAsRead(notification.id);
                  onClose();
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);
