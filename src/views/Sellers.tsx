import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Store } from "lucide-react";
import { sellerApi, type PublicSeller } from "../api/seller";
import { toErrorMessage } from "../api/http";
import { safeImageUrl, sanitizeText } from "../bin/utils/security";

export const SellersPage: FC = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sellers, setSellers] = useState<PublicSeller[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      setError("");
      void sellerApi.publicProfiles(search.trim(), page, 24, controller.signal)
        .then((result) => {
          setSellers(result.sellers);
          setTotalPages(result.totalPages);
        })
        .catch((requestError: unknown) => {
          if (!controller.signal.aborted) {
            setError(toErrorMessage(requestError, "Impossible de charger les boutiques."));
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [search, page]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-black uppercase tracking-widest text-lurevia-orange">Marketplace Lurevia</p>
        <h1 className="text-3xl font-black text-lurevia-dark">Boutiques des vendeurs</h1>
        <p className="max-w-2xl text-sm text-slate-500">
          Découvrez les boutiques de vendeurs vérifiés et leurs produits disponibles.
        </p>
      </header>

      <label className="flex max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-lurevia-cyan">
        <Search size={18} className="text-slate-400" />
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Rechercher une boutique ou une présentation"
          aria-label="Rechercher une boutique"
          className="w-full bg-transparent text-sm outline-none"
        />
      </label>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : loading ? (
        <p role="status" className="py-16 text-center text-sm text-slate-500">Chargement des boutiques…</p>
      ) : sellers.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">Aucune boutique ne correspond à cette recherche.</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellers.map((seller) => (
              <Link
                key={seller.id}
                to={`/vendeurs/${seller.id}`}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <SellerLogo seller={seller} />
                <div className="min-w-0">
                  <h2 className="truncate font-black text-lurevia-dark">{sanitizeText(seller.storeName, 100)}</h2>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {sanitizeText(seller.description, 1000)}
                  </p>
                  <p className="mt-3 text-xs font-bold text-lurevia-orange">
                    {seller.productCount} produit{seller.productCount === 1 ? "" : "s"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
              >
                Précédent
              </button>
              <span className="text-sm text-slate-500">{page} / {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export const SellerLogo: FC<{ seller: Pick<PublicSeller, "storeName" | "logoUrl"> }> = ({ seller }) => {
  const logo = safeImageUrl(seller.logoUrl);
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-50 text-lurevia-orange">
      {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Store size={26} />}
    </div>
  );
};
