import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";

import { productsApi } from "../../api/products";
import { ProductCard } from "../home/ProductCard";
import { ScrollReveal } from "../common/ScrollReveal";
import type { CartItem, Product } from "../../bin/types/homeType";

type CartSuggestionsProps = {
    cartItems: CartItem[];
    limit?: number;
};

/**
 * Suggestions basées sur les catégories du panier, demandées à l'API :
 * le catalogue complet n'est jamais chargé côté navigateur.
 */
export const CartSuggestions: FC<CartSuggestionsProps> = ({
    cartItems,
    limit = 4,
}) => {
    const [suggestions, setSuggestions] = useState<Product[]>([]);

    const categories = useMemo(
        () =>
            Array.from(
                new Set(cartItems.flatMap((item) => item.product.categorySlugs))
            ).slice(0, 5),
        [cartItems]
    );

    const excludedIds = useMemo(
        () => new Set(cartItems.map((item) => item.product.id)),
        [cartItems]
    );

    useEffect(() => {
        if (categories.length === 0) {
            setSuggestions([]);
            return;
        }

        const controller = new AbortController();

        const load = async () => {
            try {
                const page = await productsApi.list(
                    {
                        categories,
                        availability: "in-stock",
                        sortBy: "rating-desc",
                        page: 1,
                        limit: limit + excludedIds.size,
                    },
                    controller.signal
                );

                if (controller.signal.aborted) return;
                setSuggestions(
                    page.products.filter((p) => !excludedIds.has(p.id)).slice(0, limit)
                );
            } catch {
                if (!controller.signal.aborted) setSuggestions([]);
            }
        };

        void load();
        return () => controller.abort();
    }, [categories, excludedIds, limit]);

    if (suggestions.length === 0) return null;

    return (
        <section className="pt-8 border-t border-slate-100">
            <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-lurevia-dark">
                    Vous aimerez aussi
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Des créations complémentaires à votre panier.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {suggestions.map((product, i) => (
                    <ScrollReveal key={product.id} delay={i * 60}>
                        <ProductCard product={product} />
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
};
