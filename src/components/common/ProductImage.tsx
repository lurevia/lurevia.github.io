import { useState } from "react";
import type { FC, ImgHTMLAttributes } from "react";
import { FALLBACK_IMAGE } from "../../bin/data/mock";

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | undefined;
};


export const ProductImage: FC<ProductImageProps> = ({
  src,
  alt,
  className = "",
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const finalSrc = !src || hasError ? FALLBACK_IMAGE : src;

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};