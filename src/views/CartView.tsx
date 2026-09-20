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
    const { cart, summary, isEmpty, isSyncing, removeFromCart, setQuantity, clearCart } =
        useCartPage();

    const handleIncrement = (productId: string) => {
        const item = cart.find((i) => i.product.id === productId);
        if (item) void setQuantity(productId, item.quantity + 1);
    };

    const handleDecrement = (productId: string) => {
        const item = cart.find((i) => i.product.id === productId);
        if (!item) return;
        // 0 : l'API retire la ligne du panier.
        void setQuantity(productId, item.quantity - 1);
    };

    const handleClearCart = () => {
        void clearCart();
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
                        disabled={isSyncing}
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
                                    onRemove={(id) => void removeFromCart(id)}
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