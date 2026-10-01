import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../bin/types/homeType";
import { formatSellerMoney } from "./sellerDisplay";

type SellerProductListProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onRemove: (productId: string) => void;
};

export const SellerProductList = ({
  products,
  onEdit,
  onRemove,
}: SellerProductListProps) => (
  <div className="grid md:grid-cols-2 gap-4">
    {products.map((product) => (
      <div
        key={product.id}
        className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-4"
      >
        <img
          src={product.imageUrl}
          alt=""
          className="h-16 w-16 rounded-xl object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="font-black truncate">{product.title}</p>
          <p className="text-sm text-slate-500">
            {formatSellerMoney(product.price)} · Stock {product.stock ?? 0}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="p-2 text-slate-500"
          aria-label="Modifier"
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="p-2 text-red-500"
          aria-label="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ))}
  </div>
);
