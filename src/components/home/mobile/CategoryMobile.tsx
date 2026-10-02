import { useRef } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "../../../hooks/useCategories";
import { safeImageUrl } from "../../../bin/utils/security";

const carouselButtonClass = [
  "flex h-8 w-8 items-center justify-center rounded-full border",
  "border-stone-200 bg-white text-stone-600 shadow-xs transition-all",
  "active:scale-90 active:bg-stone-100",
].join(" ");

export const CategoryMobile: FC = () => {
  const { categories } = useCategories();
  const carouselRef = useRef<HTMLDivElement>(null);

  /** Largeur d'une carte et de son espacement, en pixels. */
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
      <div className="mb-4 flex items-center justify-end px-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Catégorie précédente"
            className={carouselButtonClass}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Catégorie suivante"
            className={carouselButtonClass}
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
          {categories.slice(0, 5).map((category) => {
            const Icon = category.icon;
            const imageUrl = safeImageUrl(category.imageUrl);

            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug || category.id}`}
                className={[
                  "group relative h-52 w-40 shrink-0 snap-start overflow-hidden",
                  "rounded-2xl ring-1 ring-black/5 transition-all",
                  "active:ring-black/20",
                ].join(" ")}
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-200 via-blue-100 to-slate-200" />
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-active:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute inset-0 bg-lurevia-dark/0 group-active:bg-lurevia-dark/25 transition-colors duration-300" />

                <div className="relative z-10 h-full flex flex-col justify-between p-4">
                  <div className="flex items-start justify-between">
                    {Icon ? (
                      <div
                        className={[
                          "flex h-9 w-9 items-center justify-center rounded-full",
                          "border border-white/25 bg-white/15 backdrop-blur-md",
                          "transition-transform group-active:scale-110",
                        ].join(" ")}
                      >
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
