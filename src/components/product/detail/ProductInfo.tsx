import type { FC } from "react";
import { Star, Package, CheckCircle2 } from "lucide-react";
import { formatAriary } from "../../../bin/utils/formatAriary";
import type { Product } from "../../../bin/types/homeType";

type ProductInfoProps = {
  product: Product;
};

export const ProductInfo: FC<ProductInfoProps> = ({ product }) => {
  const {
    title,
    price,
    originalPrice,
    rating = 0,
    reviewCount = 0,
    stock,
    sku,
    categorySlugs,
  } = product;

  const hasPromo = !!originalPrice && originalPrice > price;
  const discount = hasPromo
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  return (
    <div className="space-y-4 text-left">

      {categorySlugs && categorySlugs.length > 0 && (
        <p className="text-[10px] md:text-xs font-black text-lurevia-cyan uppercase tracking-widest">
          {categorySlugs[0].replace(/-/g, " ")}
        </p>
      )}

      <h1 className="text-xl md:text-3xl font-black text-lurevia-dark leading-tight uppercase tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-3 flex-wrap select-none">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < Math.round(rating)
                  ? "fill-lurevia-yellow text-lurevia-yellow"
                  : "text-slate-200"
              }
              strokeWidth={i < Math.round(rating) ? 1 : 2}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-slate-400 pt-0.5">
          {rating.toFixed(1)} <span className="font-medium text-slate-400/70">({reviewCount} avis)</span>
        </span>
      </div>

      <div className="flex items-baseline gap-3 flex-wrap pt-1">
        <span className="text-2xl md:text-3xl font-black text-lurevia-dark tracking-tight">
          {formatAriary(price)}
        </span>
        {hasPromo && (
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base text-slate-400 line-through font-medium">
              {formatAriary(originalPrice!)}
            </span>
            <span className="px-2 py-0.5 bg-orange-50 text-lurevia-orange text-[10px] font-black rounded-md border border-orange-100/50">
              -{discount}%
            </span>
          </div>
        )}
      </div>

      {product.description && (
        <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed max-w-xl">
          {product.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2.5 pt-2 select-none">
        {typeof stock === "number" && (
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${stock > 0
              ? "bg-emerald-50/50 border-emerald-100 text-emerald-600"
              : "bg-red-50/50 border-red-100 text-red-500"
            }`}>
            <Package size={12} strokeWidth={2.5} />
            <span>
              {stock > 0 ? `En stock (${stock})` : "Rupture de stock"}
            </span>
          </div>
        )}

        {sku && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400">
            <CheckCircle2 size={12} strokeWidth={2.5} />
            <span>Réf. {sku}</span>
          </div>
        )}
      </div>

    </div>
  );
};
