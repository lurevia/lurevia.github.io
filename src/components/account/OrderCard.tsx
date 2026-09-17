import type { FC } from "react";
import { Link } from "react-router-dom";
import { Package, Truck, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { OrderStatus, Order } from "../../bin/types/orderType";
import { formatAriary } from "../../bin/utils/formatAriary";
import { ProductImage } from "../common/ProductImage";


type OrderCardProps = {
  order: Order;
};

const STATUS_META: Record<
  OrderStatus,
  { label: string; icon: typeof Package; color: string }
> = {
  pending: { label: "En attente", icon: Clock, color: "text-amber-600 bg-amber-50" },
  paid: { label: "Payée", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  shipped: { label: "Expédiée", icon: Truck, color: "text-blue-600 bg-blue-50" },
  delivered: { label: "Livrée", icon: CheckCircle2, color: "text-emerald-700 bg-emerald-100" },
  cancelled: { label: "Annulée", icon: XCircle, color: "text-red-600 bg-red-50" },
};

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const meta = STATUS_META[order.status];
  const Icon = meta.icon;

  return (
    <article className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-black text-slate-800 font-mono">
            {order.id}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${meta.color}`}
          >
            <Icon size={10} />
            {meta.label}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>

      <ul className="p-4 space-y-3">
        {order.items.map((item) => (
          <li key={item.product.id} className="flex gap-3 items-center">
            <Link
              to={`/produit/${item.product.id}`}
              className="w-12 h-12 rounded-lg overflow-hidden bg-slate-50 shrink-0"
            >
              <ProductImage
                src={item.product.imageUrl}
                alt={item.product.title}
                className="w-full h-full object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/produit/${item.product.id}`}
                className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-lurevia-orange"
              >
                {item.product.title}
              </Link>
              <p className="text-[11px] text-slate-500">
                {item.quantity} × {formatAriary(item.product.price)}
              </p>
            </div>
            <span className="text-xs font-black text-slate-800 whitespace-nowrap">
              {formatAriary(item.product.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 p-4 border-t border-slate-100 bg-slate-50/30">
        <div className="text-[11px] text-slate-500">
          <p className="font-bold text-slate-700">{order.shipping.city}, {order.shipping.region}</p>
          <p className="uppercase tracking-wider text-[10px] mt-0.5">
            {order.paymentMethod.replace("-", " ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Total
          </p>
          <p className="text-base font-black text-lurevia-dark">
            {formatAriary(order.total)}
          </p>
        </div>
      </div>
    </article>
  );
};