import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "../components/ui/Button";
import { Pagination } from "../components/Shop/Pagination";
import { ProductCard } from "../components/home/ProductCard";
import { ShopHeader } from "../components/Shop/ShopHeader";
import { SortDropdown } from "../components/Shop/SortDropdown";
import { CATEGORIES } from "../bin/utils/constant/constant";
import { useProductCatalog } from "../hooks/useProductCatalog";
import { FilterSidebar, FilterDrawer } from "../components/Shop/filter";
import { ScrollReveal } from "../components/common/ScrollReveal";

export const ProductCatalog: React.FC = () => {
  const {
    isGlobalShop,
    currentCategoryInfo,
    filters,
    currentPage,
    filteredProducts,
    paginatedProducts,
    categoryCounts,
    totalPages,
    changeFilters,
    changeSortBy,
    resetFilters,
    changePage,
  } = useProductCatalog();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const activeFilterCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.availability !== "all" ? 1 : 0);

  const handleResetAndClose = () => {
    resetFilters();
    setIsFilterDrawerOpen(false);
  };

  return (
    <div className="w-full space-y-6 md:space-y-10 pb-24 text-left">
      <ShopHeader
        title={currentCategoryInfo.title}
        description={currentCategoryInfo.description}
        productCount={filteredProducts.length}
        imageUrl={currentCategoryInfo.imageUrl}
        breadcrumb={currentCategoryInfo.breadcrumb}
      />

      <div className="flex lg:hidden items-center justify-between border-b border-slate-100 pb-3 gap-3">
        <Button
          type="button"
          variant="primary"
          icon={SlidersHorizontal}
          onClick={() => setIsFilterDrawerOpen(true)}
          className="bg-white! text-lurevia-dark! border-slate-200! px-4! h-10! rounded-full! shadow-none! shrink-0"
        >
          Filtres
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-lurevia-orange text-white text-[10px] rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <SortDropdown value={filters.sortBy} onChange={changeSortBy} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <aside className="hidden lg:block lg:col-span-1 sticky top-24">
          <ScrollReveal delay={100} direction="left">
            <FilterSidebar
              filters={filters}
              onChange={changeFilters}
              onReset={resetFilters}
              categoryCounts={categoryCounts}
              categories={CATEGORIES}
              isGlobalShop={isGlobalShop}
            />
          </ScrollReveal>
        </aside>

        <div className="lg:col-span-3 space-y-8">
          <div className="hidden lg:flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold text-slate-400 tracking-wide">
            <span>
              {filteredProducts.length} produit
              {filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </span>
            <SortDropdown value={filters.sortBy} onChange={changeSortBy} />
          </div>

          {paginatedProducts.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <ScrollReveal key={currentPage} delay={150}>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal delay={200}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={changePage}
            />
          </ScrollReveal>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onChange={changeFilters}
        onReset={handleResetAndClose}
        categoryCounts={categoryCounts}
        categories={CATEGORIES}
        isGlobalShop={isGlobalShop}
      />
    </div>
  );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="text-center py-20 text-slate-400">
    <p className="text-base font-bold text-slate-600">
      Aucun produit trouvé
    </p>
    <p className="text-xs mt-1">
      Essayez d’ajuster vos filtres pour élargir la recherche.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="mt-4 px-4 py-2 text-xs font-bold text-lurevia-orange bg-orange-50 hover:bg-orange-100 rounded-full transition-colors"
    >
      Réinitialiser les filtres
    </button>
  </div>
);