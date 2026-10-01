import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { productsApi } from "../api/products";
import { sellerApi, type PublicSeller } from "../api/seller";
import { toErrorMessage } from "../api/http";
import { PRODUCTS_PER_PAGE } from "../bin/config/env";
import { ProductCard } from "../components/home/ProductCard";
import { SellerLogo } from "./Sellers";
import type { Product } from "../bin/types/homeType";

const MAX_QUERY_LENGTH = 150;

export const SearchPage: FC = () => {
  const [searchParams] = useSearchParams();
  // La requête vient de l'URL : on la borne avant tout affichage ou envoi.
  const query = (searchParams.get("q") ?? "").trim().slice(0, MAX_QUERY_LENGTH);

  const [results, setResults] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<PublicSeller[]>([]);
  const [totalSellers, setTotalSellers] = useState(0);
  const [activeType, setActiveType] = useState<"products" | "sellers">("products");
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSellers([]);
      setTotalItems(0);
      setTotalSellers(0);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    const load = async () => {
      try {
        const [page, sellerPage] = await Promise.all([
          productsApi.list({ search: query, page: 1, limit: PRODUCTS_PER_PAGE }, controller.signal),
          sellerApi.publicProfiles(query, 1, 24, controller.signal),
        ]);
        if (controller.signal.aborted) return;
        setResults(page.products);
        setTotalItems(page.totalItems);
        setSellers(sellerPage.sellers);
        setTotalSellers(sellerPage.totalItems);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(toErrorMessage(err, "La recherche a échoué."));
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <Link
        to="/boutique"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark transition-colors uppercase tracking-wider"
      >
        <ArrowLeft size={14} />
        Retour à la boutique
      </Link>

      <div>
        <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
          {query ? (
            <>
              Résultats pour <span className="text-lurevia-orange">“{query}”</span>
            </>
          ) : (
            "Recherche"
          )}
        </h1>

        {query && !isLoading && (
          <p className="text-sm text-slate-500 mt-1">
            {totalItems} résultat{totalItems > 1 ? "s" : ""} trouvé
            {totalItems > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!query ? (
        <EmptyMessage
          title="Saisissez un mot-clé"
          description="Utilisez la barre de recherche pour trouver un produit."
        />
      ) : isLoading ? (
        <div className="flex justify-center py-20" role="status">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
          <span className="sr-only">Recherche en cours</span>
        </div>
      ) : error ? (
        <EmptyMessage title="Recherche indisponible" description={error} />
      ) : (
        <>
          <div className="flex gap-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveType("products")}
              className={`border-b-2 px-4 py-3 text-sm font-bold ${activeType === "products" ? "border-lurevia-orange text-lurevia-dark" : "border-transparent text-slate-500"}`}
            >
              Produits ({totalItems})
            </button>
            <button
              type="button"
              onClick={() => setActiveType("sellers")}
              className={`border-b-2 px-4 py-3 text-sm font-bold ${activeType === "sellers" ? "border-lurevia-orange text-lurevia-dark" : "border-transparent text-slate-500"}`}
            >
              Boutiques ({totalSellers})
            </button>
          </div>
          {activeType === "products" && results.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
              {results.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : activeType === "sellers" && sellers.length > 0 ? (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sellers.map((seller) => (
                  <Link
                    key={seller.id}
                    to={`/vendeurs/${seller.id}`}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 hover:shadow-md"
                  >
                    <SellerLogo seller={seller} />
                    <div className="min-w-0">
                      <h2 className="truncate font-black text-lurevia-dark">{seller.storeName}</h2>
                      <p className="mt-1 line-clamp-3 text-xs text-slate-500">{seller.description}</p>
                      <p className="mt-2 text-xs font-bold text-lurevia-orange">
                        {seller.productCount} produit{seller.productCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to={`/vendeurs?search=${encodeURIComponent(query)}`} className="text-sm font-bold text-lurevia-orange hover:underline">
                Voir toutes les boutiques correspondant à cette recherche
              </Link>
            </div>
          ) : (
        <EmptyMessage
          title={activeType === "products" ? "Aucun produit trouvé" : "Aucune boutique trouvée"}
          description="Essayez un autre mot-clé ou découvrez toutes les boutiques."
        />
          )}
        </>
      )}
    </div>
  );
};

const EmptyMessage: FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="text-center py-20 text-slate-400">
    <p className="text-base font-bold text-slate-600">{title}</p>
    <p className="text-xs mt-1">{description}</p>
  </div>
);
