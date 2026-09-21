import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "../../bin/types/homeType";

type CategoryCardProps = {
  category: Category;
  isFeatured?: boolean;
  /** 🆕 Taille visuelle */
  size?: "sm" | "md" | "lg";
};

export const CategoryCard: FC<CategoryCardProps> = ({
  category,
  isFeatured = false,
  size = "md",
}) => {
  const { name, slug, imageUrl, icon: Icon } = category;

  const config = {
    sm: {
      padding: "p-3",
      title: "text-xs md:text-sm",
      iconBox: "w-8 h-8",
      iconSize: 14,
    },
    md: {
      padding: "p-4",
      title: "text-sm md:text-base",
      iconBox: "w-9 h-9",
      iconSize: 16,
    },
    lg: {
      padding: "p-6 md:p-8",
      title: "text-xl md:text-3xl",
      iconBox: "w-12 h-12",
      iconSize: 24,
    },
  }[size];

  return (
    <Link
      to={`/categories/${slug}`}
      className="group relative block w-full h-full overflow-hidden rounded-md ring-1 ring-black/5 transition-all duration-500 hover:ring-black/20"
    >
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isFeatured
            ? "bg-linear-to-t from-black/85 via-black/35 to-black/5"
            : "bg-linear-to-t from-black/80 via-black/25 to-transparent"
        }`}
      />

      <div className="absolute inset-0 bg-lurevia-dark/0 group-hover:bg-lurevia-dark/20 transition-colors duration-500" />

      <div
        className={`relative z-10 h-full flex flex-col justify-between ${config.padding}`}
      >
        <div className="flex items-start justify-between">
          {Icon ? (
            <div
              className={`${config.iconBox} flex items-center justify-center rounded-full backdrop-blur-md bg-white/15 border border-white/25 transition-all duration-300 group-hover:bg-white/25 group-hover:scale-110`}
            >
              <Icon
                size={config.iconSize}
                className="text-white"
                strokeWidth={2.2}
              />
            </div>
          ) : (
            <span />
          )}

          <div className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
            <ArrowUpRight size={16} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Titre en bas */}
        <div>
          <h3
            className={`font-black text-white uppercase tracking-wider leading-tight ${config.title} drop-shadow-md`}
          >
            {name}
          </h3>
          <div className="mt-2 h-0.5 w-0 group-hover:w-8 bg-white rounded-full transition-all duration-500 ease-out" />
        </div>
      </div>
    </Link>
  );
};