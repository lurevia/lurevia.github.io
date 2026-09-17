import { FALLBACK_IMAGE } from "../data/mock";
import type { Product } from "../types/homeType";


export const getProductImages = (product: Product): string[] => {
  if (product.images && product.images.length > 0) {
    return product.images;
  }
  if (product.imageUrl) {
    return [product.imageUrl];
  }
  return [FALLBACK_IMAGE];
};

export const getProductMainImage = (product: Product): string => {
  return getProductImages(product)[0] ?? FALLBACK_IMAGE;
};