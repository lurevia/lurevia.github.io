import type { FC } from "react";
import { Trash2, ShoppingCart, Check } from "lucide-react";
import { Button } from "../ui/Button";

type FavoritesHeaderProps = {
    totalFavorites: number;
    onClearAll: () => void;
    onAddAllToCart: () => void;
    isAddingAll: boolean;
    lastAddedCount: number;
};

export const FavoritesHeader: FC<FavoritesHeaderProps> = ({
    totalFavorites,
    onClearAll,
    onAddAllToCart,
    isAddingAll,
    lastAddedCount,
}) => {
    const hasItems = totalFavorites > 0;

    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
                    Mes favoris
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    {hasItems
                        ? `${totalFavorites} coup${totalFavorites > 1 ? "s" : ""} de cœur`
                        : "Retrouvez ici vos coups de cœur"}
                </p>
            </div>

            {hasItems && (
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        onClick={onClearAll}
                        className="text-slate-400! hover:text-red-500! hover:bg-red-50!"
                    >
                        Tout retirer
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        icon={isAddingAll ? Check : ShoppingCart}
                        onClick={onAddAllToCart}
                        disabled={isAddingAll}
                        className={
                            isAddingAll
                                ? "bg-emerald-500! hover:bg-emerald-600!"
                                : ""
                        }
                    >
                        {isAddingAll
                            ? `${lastAddedCount} ajouté${lastAddedCount > 1 ? "s" : ""}`
                            : "Tout ajouter au panier"}
                    </Button>
                </div>
            )}
        </div>
    );
};