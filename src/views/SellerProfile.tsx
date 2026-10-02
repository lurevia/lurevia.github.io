import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { sellerApi, type PublicSellerDetails } from "../api/seller";
import { toErrorMessage } from "../api/http";
import { ProductCard } from "../components/home/ProductCard";
import { SellerLogo } from "./Sellers";
import { sanitizeText } from "../bin/utils/security";
import { useSeoMetadata } from "../hooks/useSeoMetadata";
import { useAuth } from "../hooks/useAuth";

export const SellerProfilePage: FC = () => {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const [seller, setSeller] = useState<PublicSellerDetails | null>(null);
  const [error, setError] = useState("");

  useSeoMetadata({
    title: seller ? `${seller.storeName} | Boutiques Lurevia` : "Boutiques Lurevia",
    description: seller?.description ?? "Découvrez les boutiques et les créations locales sur Lurevia.",
    canonicalPath: seller ? `/vendeurs/${encodeURIComponent(seller.id)}` : "/vendeurs",
    image: seller?.coverUrl ?? seller?.logoUrl ?? undefined,
    structuredData: seller ? {
      "@context": "https://schema.org",
      "@type": "Store",
      name: seller.storeName,
      description: seller.description,
      image: seller.coverUrl ?? seller.logoUrl ?? undefined,
      url: `${window.location.origin}/vendeurs/${encodeURIComponent(seller.id)}`,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Produits de ${seller.storeName}`,
        itemListElement: seller.products.map((product) => ({
          "@type": "Offer",
          url: `${window.location.origin}/produit/${encodeURIComponent(product.slug ?? product.id)}`,
          itemOffered: { "@type": "Product", name: product.title },
        })),
      },
    } : undefined,
  });

  useEffect(() => {
    const controller = new AbortController();
    setSeller(null);
    setError("");
    void sellerApi.publicProfile(id, controller.signal)
      .then(setSeller)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(toErrorMessage(requestError, "Cette boutique n'est pas disponible."));
        }
      });
    return () => controller.abort();
  }, [id]);

  if (error) {
    return <main className="mx-auto max-w-5xl px-4 py-12 text-center text-sm text-slate-500">{error}</main>;
  }
  if (!seller) {
    return <main className="mx-auto max-w-5xl px-4 py-12 text-center text-sm text-slate-500">Chargement de la boutique…</main>;
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10">
      <Link to="/vendeurs" className="inline-flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
        <ArrowLeft size={14} /> Toutes les boutiques
      </Link>
      <header className="overflow-hidden rounded-3xl border border-slate-100 bg-white">
        <div className="relative h-44 bg-slate-200 md:h-64">
          {seller.coverUrl && (
            <img
              src={seller.coverUrl}
              alt={`Couverture de ${sanitizeText(seller.storeName, 100)}`}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/35 to-transparent" />
        </div>
        <div className="relative flex flex-wrap items-end gap-4 px-5 pb-5 md:px-8 md:pb-8">
          <div className="-mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md md:-mt-16 md:h-32 md:w-32">
            {seller.logoUrl ? (
              <img src={seller.logoUrl} alt={`Logo de ${seller.storeName}`} className="h-full w-full object-cover" />
            ) : (
              <SellerLogo seller={seller} />
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="text-2xl font-black text-lurevia-dark md:text-3xl">{sanitizeText(seller.storeName, 100)}</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {seller.storeCategory?.name ?? "Boutique Lurevia"} · {seller.products.length} produit{seller.products.length === 1 ? "" : "s"}
            </p>
          </div>
          {user?.id === seller.id && (
            <Link to="/vendeur" className="rounded-xl bg-lurevia-dark px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
              Gérer ma boutique
            </Link>
          )}
          <p className="w-full max-w-4xl whitespace-pre-line text-sm leading-relaxed text-slate-600">
            {sanitizeText(seller.description, 1000)}
          </p>
        </div>
      </header>
      <section>
        <h2 className="mb-5 text-xl font-black text-lurevia-dark">Produits de la boutique</h2>
        {seller.products.length === 0 ? (
          <p className="py-12 text-center text-sm text-slate-500">Cette boutique n’a pas encore de produit disponible.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
            {seller.products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </section>
    </main>
  );
};
