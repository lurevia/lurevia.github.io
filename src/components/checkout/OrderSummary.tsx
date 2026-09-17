import type { FC } from "react";
import { useCart } from "../../hooks/useCart";
import { formatAriary } from "../../bin/utils/formatAriary";
import { ProductImage } from "../common/ProductImage";
import { Truck, ShieldCheck } from "lucide-react";

type OrderSummaryProps = {
    subtotal: number;
    shippingCost: number;
    total: number;
};

export const OrderSummary: FC<OrderSummaryProps> = ({
    subtotal,
    shippingCost,
    total,
}) => {
    const { cart } = useCart();
    const hasFreeShipping = shippingCost === 0;

    return (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:sticky md:top-24 space-y-5">
            <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider pb-3 border-b border-slate-100">
                Votre commande ({cart.length})
            </h2>

            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                    <li key={item.product.id} className="flex gap-3 items-center">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-50">
                                <ProductImage
                                    src={item.product.imageUrl}
                                    alt={item.product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="absolute -top-1.5 -right-1.5 bg-lurevia-dark text-white text-[10px] font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                                ×{item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 line-clamp-2">
                                {item.product.title}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                {formatAriary(item.product.price * item.quantity)}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                    <span>Sous-total</span>
                    <span className="font-bold text-slate-800">
                        {formatAriary(subtotal)}
                    </span>
                </div>
                <div className="flex justify-between text-slate-600">
                    <span>Livraison</span>
                    <span
                        className={`font-bold ${hasFreeShipping ? "text-emerald-600" : "text-slate-800"
                            }`}
                    >
                        {hasFreeShipping ? "Offerte" : formatAriary(shippingCost)}
                    </span>
                </div>
                <div className="flex justify-between items-baseline pt-3 mt-3 border-t border-slate-100">
                    <span className="text-xs font-black text-lurevia-dark uppercase tracking-wider">
                        Total
                    </span>
                    <span className="text-2xl font-black text-lurevia-dark">
                        {formatAriary(total)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    Paiement sécurisé
                </span>
                <span className="flex items-center gap-1">
                    <Truck size={12} className="text-lurevia-orange" />
                    Livraison 2-5j
                </span>
            </div>
        </div>
    );
};