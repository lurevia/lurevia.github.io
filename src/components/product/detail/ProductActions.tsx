import type { FC } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "../../ui/Button";
import { QuantitySelector } from "./QuantitySelector";

type ProductActionsProps = {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (value: number) => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  outOfStock: boolean;
};

export const ProductActions: FC<ProductActionsProps> = ({
  quantity,
  maxQuantity,
  onQuantityChange,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
  outOfStock,
}) => {
  return (
    <div className="space-y-4 text-left">

      <div className="flex items-center gap-3 w-full">
        <div className="shrink-0">
          <QuantitySelector
            value={quantity}
            max={maxQuantity}
            onChange={onQuantityChange}
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className={`border border-slate-200! w-11! h-11! p-0! rounded-xl! flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-none ${isFavorite
            ? "text-red-500! bg-red-50/40! border-red-100!"
            : "text-slate-400! hover:text-red-500!"
            }`}
        >
          <Heart
            size={18}
            className={isFavorite ? "fill-red-500" : ""}
          />
        </Button>
      </div>

      <div className="w-full pt-1.5 select-none">
        <Button
          type="button"
          variant="primary"
          icon={ShoppingCart}
          iconPosition="left"
          onClick={onAddToCart}
          disabled={outOfStock}
          className={`w-full! py-3.5! rounded-xl! font-bold text-xs uppercase tracking-widest shadow-md transition-all active:scale-98 ${outOfStock
            ? "bg-slate-200! text-slate-400! border-transparent! cursor-not-allowed shadow-none"
            : "bg-lurevia-orange! text-white! hover:opacity-95!"
            }`}
        >
          {outOfStock ? "Rupture de stock" : "Ajouter au panier"}
        </Button>
      </div>

    </div>
  );
};
