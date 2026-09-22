import { useState } from "react";
import type { FC, ImgHTMLAttributes } from "react";
import { FALLBACK_IMAGE } from "../../bin/utils/constant/assets";
import { safeImageUrl } from "../../bin/utils/security";
import { buildImageUrl } from "../../bin/utils/images";

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
  const safeSrc = safeImageUrl(src);
  const finalSrc = !safeSrc || hasError ? FALLBACK_IMAGE : safeSrc;

  return (
    <img
      src={buildImageUrl(finalSrc)}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
