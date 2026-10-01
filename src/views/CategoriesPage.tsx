import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { CategoryCard } from "../components/home/CategoryCard";

export const CategoriesPage = () => {
  const { categories, isLoading, error } = useCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16">
      <header className="mb-8 border-b border-blue-100 pb-6 md:mb-10">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
          Explorez Lurevia
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
          Toutes les catégories
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Parcourez tous les univers et découvrez les produits proposés par nos
          vendeurs.
        </p>
      </header>

      {isLoading && (
        <p className="py-16 text-center text-sm text-slate-600" role="status">
          Chargement des catégories…
        </p>
      )}
      {error && (
        <p
          className="border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      )}
      {!isLoading && !error && categories.length === 0 && (
        <p className="border border-blue-100 bg-blue-50 p-6 text-sm text-slate-700">
          Aucune catégorie n’est disponible pour le moment.
        </p>
      )}

      {!isLoading && !error && categories.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((category) => (
            <div key={category.id} className="aspect-[4/5] min-h-44">
              <CategoryCard category={category} size="md" />
            </div>
          ))}
        </div>
      )}

      <Link
        to="/boutique"
        className={[
          "mt-10 inline-flex items-center gap-2 border-b border-blue-700",
          "pb-1 text-sm font-bold text-blue-700 transition-colors",
          "hover:text-blue-900",
        ].join(" ")}
      >
        Voir tous les produits <ArrowRight size={16} />
      </Link>
    </section>
  );
};
