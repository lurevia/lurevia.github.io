import { useRef } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";
import { buildImageUrl } from "../../../bin/utils/images";

export const CategoryMobile: FC = () => {
  const { categories } = useCategories();
  const carouselRef = useRef<HTMLDivElement>(null);

  /** 🎯 Largeur d'une carte + gap (en px) */
  const CARD_WIDTH = 168; // 160px + 8px de gap

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -CARD_WIDTH : CARD_WIDTH,
      behavior: "smooth",
    });
  };

  if (categories.length === 0) return null;

  return (
    <div className="block md:hidden w-full">
      {/* ─── En-tête : titre + flèches ─── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-black tracking-tight text-lurevia-dark uppercase">
            Catégories
          </h2>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Explorez nos univers
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Catégorie précédente"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 active:scale-90 active:bg-slate-100 transition-all shadow-xs"
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Catégorie suivante"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 active:scale-90 active:bg-slate-100 transition-all shadow-xs"
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="w-full overflow-x-auto overflow-y-hidden scrollbar-none snap-x snap-mandatory scroll-smooth"
      >
        <div className="flex gap-2 pb-2 w-max px-1">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug || category.id}`}
                className="group relative snap-start shrink-0 w-40 h-52 overflow-hidden rounded-md ring-1 ring-black/5 active:ring-black/20 transition-all"
              >
                <img
                  src={buildImageUrl(category.imageUrl)}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-active:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute inset-0 bg-lurevia-dark/0 group-active:bg-lurevia-dark/25 transition-colors duration-300" />

                <div className="relative z-10 h-full flex flex-col justify-between p-4">
                  <div className="flex items-start justify-between">
                    {Icon ? (
                      <div className="w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md bg-white/15 border border-white/25 transition-transform group-active:scale-110">
                        <Icon
                          size={16}
                          className="text-white"
                          strokeWidth={2.2}
                        />
                      </div>
                    ) : (
                      <span />
                    )}

                    <div className="opacity-0 group-active:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight
                        size={16}
                        className="text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-white uppercase tracking-wider leading-tight text-sm drop-shadow-md">
                      {category.name}
                    </h3>
                    <div className="mt-2 h-0.5 w-0 group-active:w-8 bg-white rounded-full transition-all duration-500" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};