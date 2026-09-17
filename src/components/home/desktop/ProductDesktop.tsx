import { type FC, useState } from "react";
import { ProductCard } from "../ProductCard";
import type { Product } from "../../../bin/types/homeType";

type ProductDesktopProps = {
  products: Product[];
  carouselRef: React.RefObject<HTMLDivElement | null>;
};

export const ProductDesktop: FC<ProductDesktopProps> = ({ products, carouselRef }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const cardWidth = 324;

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const index = Math.round(scrollLeft / cardWidth);
      if (index !== activeIndex && index >= 0 && index < products.length) {
        setActiveIndex(index);
      }
    }
  };

  const scrollToProduct = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="hidden md:block relative">
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-2 -mx-2 items-stretch scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="w-75 shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-4">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToProduct(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex 
                  ? "w-6 bg-lurevia-cyan" 
                  : "w-1.5 bg-slate-200 hover:bg-slate-400"
              }`}
              aria-label={`Aller au produit ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
