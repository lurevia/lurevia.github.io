import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { ChevronRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { useFavorite } from "../hooks/useFavorite";
import { useProductDetail } from "../hooks/useProductDetail";

import { ProductActions } from "../components/product/detail/ProductActions";
import { ProductGallery } from "../components/product/detail/ProductGallery";
import { ProductInfo } from "../components/product/detail/ProductInfo";
import { ProductTabs } from "../components/product/detail/ProductTabs";
import { RelatedProducts } from "../components/product/detail/RelatedProducts";
import { VariantSelector } from "../components/product/detail/VariantSelector";

export const ProductDetail: FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  /** 🎯 Flag : on doit ouvrir l'onglet Avis */
  const [openReviews, setOpenReviews] = useState(false);

  /** 🎯 Flag : on doit ouvrir automatiquement le formulaire d'avis */
  const [autoOpenReviewForm, setAutoOpenReviewForm] = useState(false);

  const {
    product,
    selectedImage,
    selectedSize,
    selectedColor,
    quantity,
    setSelectedImage,
    setSelectedSize,
    setSelectedColor,
    setQuantity,
    resetSelection,
  } = useProductDetail();

  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorite();

  // ─────────────────────────────────────────────────────────────────────────
  // 🎯 Détection de #reviews et ?review=1
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const hashWantsReviews = location.hash === "#reviews";
    const queryWantsReview = searchParams.get("review") === "1";

    if (hashWantsReviews || queryWantsReview) {
      setOpenReviews(true);
    }

    if (queryWantsReview) {
      setAutoOpenReviewForm(true);
    }

    // Scroll vers la section avis après le rendu
    if (hashWantsReviews || queryWantsReview) {
      const timer = setTimeout(() => {
        document.getElementById("reviews")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location.hash, searchParams]);

  // Garde : produit introuvable → redirection
  if (!product) {
    return <Navigate to="/boutique" replace />;
  }

  const isFav = isFavorite(product.id);
  const images = product.images?.length ? product.images : [product.imageUrl];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    resetSelection();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-10">
      {/* Fil d'Ariane */}
      <nav
        aria-label="Fil d’Ariane"
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider"
      >
        <Link to="/" className="hover:text-lurevia-dark transition-colors">
          Accueil
        </Link>
        <ChevronRight size={12} />
        <Link
          to="/boutique"
          className="hover:text-lurevia-dark transition-colors"
        >
          Boutique
        </Link>
        <ChevronRight size={12} />
        <span className="text-lurevia-dark truncate">{product.title}</span>
      </nav>

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galerie */}
        <ProductGallery
          images={images}
          title={product.title}
          isFavorite={isFav}
          onToggleFavorite={() => toggleFavorite(product)}
          isNew={product.isNew}
          onSale={!!product.originalPrice}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
        />

        {/* Infos + actions */}
        <div className="space-y-6">
          <ProductInfo product={product} />

          <VariantSelector
            sizes={product.sizes}
            colors={product.colors}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSelectSize={setSelectedSize}
            onSelectColor={setSelectedColor}
          />

          <ProductActions
            quantity={quantity}
            maxQuantity={product.stock ?? 99}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onToggleFavorite={() => toggleFavorite(product)}
            isFavorite={isFav}
            outOfStock={product.outOfStock ?? false}
          />

          {/* Réassurance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100">
            <ReassuranceItem
              icon={Truck}
              title="Livraison 2-5j"
              subtitle="Partout à Madagascar"
            />
            <ReassuranceItem
              icon={ShieldCheck}
              title="Paiement sécurisé"
              subtitle="Mobile Money & carte"
            />
            <ReassuranceItem
              icon={RefreshCw}
              title="Retour 14 jours"
              subtitle="Satisfait ou remboursé"
            />
          </div>
        </div>
      </div>

      <ProductTabs
        product={product}
        initialTab={openReviews ? "reviews" : "description"}
        autoOpenReviewForm={autoOpenReviewForm}
      />

      {/* Produits similaires */}
      <RelatedProducts currentProduct={product} />

      {/* Espace pour la BottomNav mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
};

const ReassuranceItem: FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-2.5 text-left">
    <div className="p-2 bg-slate-50 rounded-lg shrink-0">
      <Icon size={16} className="text-lurevia-orange" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-slate-800">{title}</p>
      <p className="text-[11px] text-slate-500">{subtitle}</p>
    </div>
  </div>
);