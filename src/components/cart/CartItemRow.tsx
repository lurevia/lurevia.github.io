import type { FC } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatAriary } from "../../bin/utils/formatAriary";
import type { CartItem } from "../../bin/types/homeType";

type CartItemRowProps = {
  item: CartItem;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onRemove: (productId: string) => void;
};

export const CartItemRow: FC<CartItemRowProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}) => {
  const { product, quantity } = item;
  const lineTotal = product.price * quantity;
  const maxStock = product.stock ?? 99;

  return (
    <article className="py-4 md:py-5 border-b border-slate-100 last:border-0">
      <div className="flex gap-3 md:gap-4">
        <Link
          to={`/produit/${product.id}`}
          className="shrink-0 w-18 h-18 md:w-24 md:h-24 rounded-xl overflow-hidden bg-slate-50"
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <Link
              to={`/produit/${product.id}`}
              className="text-sm md:text-base font-bold text-slate-800 hover:text-lurevia-orange transition-colors line-clamp-2 leading-tight"
            >
              {product.title}
            </Link>
            <p className="text-[11px] md:text-xs text-slate-400 mt-1 uppercase tracking-wider">
              {product.categorySlugs[0]?.replace(/-/g, " ") ?? "Produit"}
            </p>
          </div>

          <p className="hidden md:block text-sm font-black text-lurevia-dark mt-1.5">
            {formatAriary(product.price)}
          </p>

          <p className="md:hidden text-xs font-bold text-slate-500 mt-1">
            {formatAriary(product.price)} l’unité
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-3 md:mt-0">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden shrink-0">
            <button
              type="button"
              onClick={() => onDecrement(product.id)}
              disabled={quantity <= 1}
              aria-label="Diminuer la quantité"
              className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>

            <span className="w-11 h-11 md:w-10 md:h-9 flex items-center justify-center text-sm font-black text-slate-800 border-x border-slate-200 tabular-nums">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => onIncrement(product.id)}
              disabled={quantity >= maxStock}
              aria-label="Augmenter la quantité"
              className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <p className="text-base md:text-base font-black text-lurevia-dark whitespace-nowrap">
              {formatAriary(lineTotal)}
            </p>

            <button
              type="button"
              onClick={() => onRemove(product.id)}
              aria-label={`Supprimer ${product.title}`}
              className="w-11 h-11 md:w-9 md:h-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 rounded-full transition-colors shrink-0"
            >
              <Trash2 size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};