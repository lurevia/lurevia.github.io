import { useEffect, useState } from "react";
import type { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { sellerApi, type PublicSellerDetails } from "../api/seller";
import { toErrorMessage } from "../api/http";
import { ProductCard } from "../components/home/ProductCard";
import { SellerLogo } from "./Sellers";
import { sanitizeText } from "../bin/utils/security";

export const SellerProfilePage: FC = () => {
  const { id = "" } = useParams();
  const [seller, setSeller] = useState<PublicSellerDetails | null>(null);
  const [error, setError] = useState("");

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
      <header className="flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 md:p-8">
        <SellerLogo seller={seller} />
        <div>
          <h1 className="text-2xl font-black text-lurevia-dark">{sanitizeText(seller.storeName, 100)}</h1>
          <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-slate-600">
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
