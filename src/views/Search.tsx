import type { FC } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_PRODUCTS } from "../bin/data/mock";
import { ProductCard } from "../components/home/ProductCard";

export const SearchPage: FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const results = query
    ? MOCK_PRODUCTS.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    )
    : [];

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
              Résultats pour <span className="text-lurevia-orange">"{query}"</span>
            </>
          ) : (
            "Recherche"
          )}
        </h1>

        {query && (
          <p className="text-sm text-slate-500 mt-1">
            {results.length} résultat{results.length > 1 ? "s" : ""} trouvé
            {results.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {!query ? (
        <EmptyMessage
          title="Saisissez un mot-clé"
          description="Utilisez la barre de recherche pour trouver un produit."
        />
      ) : results.length === 0 ? (
        <EmptyMessage
          title="Aucun produit trouvé"
          description={`Aucun résultat pour "${query}". Essayez un autre mot-clé.`}
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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