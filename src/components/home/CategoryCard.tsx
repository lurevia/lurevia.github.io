import type { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import type { Category } from "../../bin/types/homeType";

type CategoryCardProps = {
  category: Category;
  isFeatured?: boolean;
};

export const CategoryCard: FC<CategoryCardProps> = ({ category, isFeatured = false }) => {
  const { name, slug, imageUrl } = category;

  return (
    <Link
      to={`/categories/${slug}`}
      className={`group relative block overflow-hidden rounded-2xl bg-slate-100/90 border border-slate-100/60 p-6 flex-col justify-between transition-all duration-300 hover:border-slate-200/80 hover:shadow-xs ${
        isFeatured 
          ? "md:col-span-2 h-111 md:p-8" 
          : "md:col-span-1 h-52.5"
      }`}
    >
      <div className="space-y-1 text-left z-20">
        <span className="text-[10px] font-bold text-lurevia-orange uppercase tracking-wider block">
          {isFeatured ? "10% Offer" : "Collection"}
        </span>
        <h3 className={`font-black tracking-tight text-slate-900 uppercase leading-none ${
          isFeatured ? "text-2xl max-w-xs leading-tight" : "text-lg"
        }`}>
          {name.split(" ").map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </h3>
      </div>

      <div className="z-20 self-start pt-4">
        <Button
          variant="primary"
          className={`bg-slate-950! border-slate-950! hover:bg-slate-800! text-white! rounded-none! font-bold uppercase tracking-widest transition-all ${
            isFeatured ? "px-6! py-3! text-xs!" : "px-5! py-2.5! text-[10px]!"
          }`}
        >
          Shop Now
        </Button>
      </div>

      <div className={`absolute bottom-0 right-0 pointer-events-none overflow-hidden flex items-end justify-center ${
        isFeatured ? "w-[60%] h-full inset-y-0" : "w-auto h-[85%]"
      }`}>
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className={`object-contain transition-transform duration-500 group-hover:scale-103 ${
            isFeatured 
              ? "max-h-[95%] drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)]" 
              : "h-full w-auto"
          }`}
        />
      </div>
    </Link>
  );
};
