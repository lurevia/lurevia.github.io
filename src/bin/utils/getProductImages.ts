import { FALLBACK_IMAGE } from "./constant/assets";
import { safeImageUrl } from "./security";
import type { Product } from "../types/homeType";

export const getProductImages = (product: Product): string[] => {
  const images = (product.images ?? [])
    .map((url) => safeImageUrl(url))
    .filter((url): url is string => typeof url === "string");

  if (images.length > 0) return images;

  const main = safeImageUrl(product.imageUrl);
  return main ? [main] : [FALLBACK_IMAGE];
};

export const getProductMainImage = (product: Product): string =>
  getProductImages(product)[0] ?? FALLBACK_IMAGE;
