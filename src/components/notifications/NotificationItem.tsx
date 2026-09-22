import type { FC } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Truck,
  CheckCircle2,
  Tag,
  ShieldAlert,    // 🆕
} from "lucide-react";
import type { AppNotification } from "../../bin/types/notificationType";
import { ProductImage } from "../common/ProductImage";
import { safeInternalPath } from "../../bin/utils/security";

type NotificationItemProps = {
  notification: AppNotification;
  onClick: () => void;
};

const TYPE_ICONS = {
  review_pending: Star,
  order_shipped: Truck,
  order_delivered: CheckCircle2,
  promo: Tag,
  account_verification: ShieldAlert,
};

const TYPE_COLORS = {
  review_pending: "text-lurevia-yellow bg-yellow-50",
  order_shipped: "text-blue-600 bg-blue-50",
  order_delivered: "text-emerald-600 bg-emerald-50",
  promo: "text-lurevia-orange bg-orange-50",
  account_verification: "text-amber-600 bg-amber-50",
};

export const NotificationItem: FC<NotificationItemProps> = ({
  notification,
  onClick,
}) => {
  const Icon = TYPE_ICONS[notification.type];
  const colorClass = TYPE_COLORS[notification.type];

  return (
    <Link
      to={safeInternalPath(notification.actionUrl)}
      onClick={onClick}
      className={`flex items-start gap-3 p-3 transition-colors ${
        notification.read
          ? "hover:bg-slate-50"
          : "bg-orange-50/30 hover:bg-orange-50/60"
      }`}
    >
      {notification.imageUrl ? (
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-50 shrink-0">
          <ProductImage
            src={notification.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
          <Icon size={16} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-xs ${
              notification.read
                ? "font-bold text-slate-700"
                : "font-black text-lurevia-dark"
            }`}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-1.5 h-1.5 bg-lurevia-orange rounded-full shrink-0" />
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-snug">
          {notification.message}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          {new Date(notification.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>
    </Link>
  );
};