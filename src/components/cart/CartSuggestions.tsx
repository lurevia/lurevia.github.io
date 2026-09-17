import { useMemo } from "react";
import type { FC } from "react";
import { MOCK_PRODUCTS } from "../../bin/data/mock";
import { ProductCard } from "../home/ProductCard";
import { ScrollReveal } from "../common/ScrollReveal";
import type { CartItem, Product } from "../../bin/types/homeType";

type CartSuggestionsProps = {
    cartItems: CartItem[];
    limit?: number;
};

export const CartSuggestions: FC<CartSuggestionsProps> = ({
    cartItems,
    limit = 4,
}) => {
    const suggestions = useMemo(() => {
        if (cartItems.length === 0) return [];

        const cartCategories = new Set(
            cartItems.flatMap((item) => item.product.categorySlugs)
        );
        const cartIds = new Set(cartItems.map((item) => item.product.id));

        return MOCK_PRODUCTS.filter(
            (p) =>
                !cartIds.has(p.id) &&
                p.outOfStock !== true &&
                (p.stock ?? 1) > 0 &&
                p.categorySlugs.some((slug) => cartCategories.has(slug))
        )
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, limit);
    }, [cartItems, limit]);

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
                {suggestions.map((product: Product, i) => (
                    <ScrollReveal key={product.id} delay={i * 60}>
                        <ProductCard product={product} />
                    </ScrollReveal>
                ))}
            </div>
        </section>
    );
};