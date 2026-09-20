import { useState } from "react";
import type { FC, ImgHTMLAttributes } from "react";
import { FALLBACK_IMAGE } from "../../bin/utils/constant/assets";
import { safeImageUrl } from "../../bin/utils/security";

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | undefined;
};

/**
 * Image de produit tolérante aux pannes : toute URL absente, invalide ou
 * au protocole non autorisé (`javascript:`, `data:text/html`…) retombe sur
 * l'image de repli. Les URLs venant de l'API sont donc toujours filtrées
 * avant d'atteindre l'attribut `src`.
 */
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
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
