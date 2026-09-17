import { useMemo } from "react";
import type { FC } from "react";
import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { Button } from "../../ui/Button";

// 🎯 ÉTAPE 1 : Alignement strict des props avec les données fournies par useProductDetail() [INDEX]
type ProductGalleryProps = {
  images: string[];
  title: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare?: () => void;
  isNew?: boolean;
  onSale?: boolean;
  selectedImage: string; // Recueille l'image active globale [INDEX]
  onSelectImage: (url: string) => void; // Recueille le setter global [INDEX]
};

export const ProductGallery: FC<ProductGalleryProps> = ({
  images,
  title,
  isFavorite,
  onToggleFavorite,
  onShare,
  isNew = false,
  onSale = false,
  selectedImage,
  onSelectImage,
}) => {
  const currentIndex = useMemo(() => {
    const idx = images.indexOf(selectedImage);
    return idx === -1 ? 0 : idx;
  }, [images, selectedImage]);

  const currentImage = images[currentIndex] || selectedImage || images[0];

  const goNext = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    onSelectImage(images[nextIndex]);
  };

  const goPrev = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onSelectImage(images[prevIndex]);
  };

  return (
    <div className="space-y-4 text-left">
      <div className="relative group rounded-3xl overflow-hidden bg-slate-50 aspect-square border border-slate-100/60 shadow-xs">
        <img
          src={currentImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 animate-fadeIn"
        />

        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 select-none">
          {isNew && (
            <span className="px-3 py-1 bg-lurevia-dark text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
              Nouveau
            </span>
          )}
          {onSale && (
            <span className="px-3 py-1 bg-lurevia-orange text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
              Promo
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            aria-label={
              isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"
            }
            className="bg-white/90! backdrop-blur-sm! shadow-md! hover:bg-white! w-9! h-9! p-0! rounded-full! flex items-center justify-center cursor-pointer transition-transform active:scale-95"
          >
            <Heart
              size={16}
              className={
                isFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-slate-700"
              }
            />
          </Button>

          {onShare && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              icon={Share2}
              onClick={onShare}
              aria-label="Partager"
              className="bg-white/90! backdrop-blur-sm! shadow-md! hover:bg-white! w-9! h-9! p-0! rounded-full! flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            />
          )}
        </div>

        {/* Flèches de carrousel groupées tactiles */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer active:scale-90"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {images.map((img, i) => {
            const isCurrentActive = i === currentIndex;
            
            return (
              <button
                key={img}
                type="button"
                onClick={() => onSelectImage(img)}
                aria-label={`Voir l’image ${i + 1}`}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  isCurrentActive
                    ? "border-lurevia-orange scale-98 ring-2 ring-orange-100"
                    : "border-slate-100 opacity-80 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`${title} ${i + 1}`}
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
