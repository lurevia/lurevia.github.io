import type { FC } from "react";
import { ProductCard } from "../ProductCard";
import type { Product } from "../../../bin/types/homeType";


type ProductMobileProps = {
  products: Product[];
};

export const ProductMobile: FC<ProductMobileProps> = ({ products }) => {
  return (
    <div className="block md:hidden w-full overflow-x-auto overflow-y-hidden scrollbar-none snap-x snap-mandatory">
      <div className="flex gap-4 pb-3 w-max px-1">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="w-48 shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
