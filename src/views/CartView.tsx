import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

import { useCartPage } from "../hooks/useCartPage";
import { CartItemRow } from "../components/cart/CartItemRow";
import { CartEmpty } from "../components/cart/CartEmpty";
import { CartSummary } from "../components/cart/CartSummary";
import { CartSuggestions } from "../components/cart/CartSuggestions";
import { Button } from "../components/ui/Button";

export const CartPage: FC = () => {
    const { cart, summary, isEmpty, removeFromCart, addToCart } = useCartPage();

    const handleIncrement = (productId: string) => {
        const item = cart.find((i) => i.product.id === productId);
        if (item) addToCart(item.product);
    };

    const handleDecrement = (productId: string) => {
        const item = cart.find((i) => i.product.id === productId);
        if (!item) return;

        if (item.quantity > 1) {
            removeFromCart(productId);
            for (let i = 0; i < item.quantity - 1; i++) {
                addToCart(item.product);
            }
        } else {
            removeFromCart(productId);
        }
    };

    const handleClearCart = () => {
        cart.forEach((item) => removeFromCart(item.product.id));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8 pb-28 md:pb-16">
            <Link
                to="/boutique"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-lurevia-dark transition-colors uppercase tracking-wider"
            >
                <ArrowLeft size={14} />
                Continuer mes achats
            </Link>

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
                        Mon panier
                    </h1>
                    {!isEmpty && (
                        <p className="text-sm text-slate-500 mt-1">
                            {summary.itemCount} article{summary.itemCount > 1 ? "s" : ""} dans
                            votre panier
                        </p>
                    )}
                </div>

                {!isEmpty && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={handleClearCart}
                        className="text-slate-400! hover:text-red-500! hover:bg-red-50!"
                    >
                        Vider le panier
                    </Button>
                )}
            </div>

            {isEmpty ? (
                <CartEmpty />
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-4 md:p-6">
                            {cart.map((item) => (
                                <CartItemRow
                                    key={item.product.id}
                                    item={item}
                                    onIncrement={handleIncrement}
                                    onDecrement={handleDecrement}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <CartSummary summary={summary} />
                        </div>
                    </div>
                    <CartSuggestions cartItems={cart} />
                </>
            )}
        </div>
    );
};