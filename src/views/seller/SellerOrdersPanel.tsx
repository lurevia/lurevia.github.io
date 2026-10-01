import type { Order } from "../../bin/types/orderType";
import { SELLER_ORDER_STATUSES, formatSellerMoney } from "./sellerDisplay";

type SellerOrdersPanelProps = {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: string) => void;
};

export const SellerOrdersPanel = ({
  orders,
  onUpdateStatus,
}: SellerOrdersPanelProps) => {
  if (orders.length === 0) {
    return <p className="text-sm text-slate-400">Aucune commande.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-wrap items-center gap-4 justify-between rounded-2xl bg-white border border-slate-100 p-4"
        >
          <div>
            <p className="font-black">Commande #{order.id.slice(-8)}</p>
            <p className="text-sm text-slate-500">
              {order.items.length} article(s) · {formatSellerMoney(order.total)}
            </p>
          </div>
          <select
            value={order.status.toUpperCase()}
            onChange={(event) => onUpdateStatus(order.id, event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold"
          >
            {SELLER_ORDER_STATUSES.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};
