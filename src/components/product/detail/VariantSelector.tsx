import type { FC } from "react";
import type { ColorVariant } from "../../../bin/types/homeType";

type VariantSelectorProps = {
    sizes?: string[];
    colors?: ColorVariant[];
    selectedSize: string | null;
    selectedColor: ColorVariant | null;
    onSelectSize: (size: string) => void;
    onSelectColor: (color: ColorVariant) => void;
};

export const VariantSelector: FC<VariantSelectorProps> = ({
    sizes,
    colors,
    selectedSize,
    selectedColor,
    onSelectSize,
    onSelectColor,
}) => {
    return (
        <div className="space-y-5">
            {sizes && sizes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Taille
                        </label>
                        <button
                            type="button"
                            className="text-[11px] font-bold text-lurevia-orange hover:underline"
                        >
                            Guide des tailles
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => {
                            const active = selectedSize === size;
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => onSelectSize(size)}
                                    className={`min-w-11 h-10 text-xs font-bold rounded-xl border transition-all ${active
                                        ? "bg-lurevia-dark text-white border-lurevia-dark shadow-sm"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                                        }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {colors && colors.length > 0 && (
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Couleur :{" "}
                        <span className="text-slate-500 normal-case font-medium">
                            {selectedColor?.label}
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {colors.map((color) => {
                            const active = selectedColor?.hex === color.hex;
                            return (
                                <button
                                    key={color.hex}
                                    type="button"
                                    onClick={() => onSelectColor(color)}
                                    aria-label={color.label}
                                    title={color.label}
                                    className={`h-9 w-9 rounded-full border-2 transition-all relative ${active
                                        ? "border-lurevia-orange ring-2 ring-orange-100 scale-110"
                                        : "border-slate-200 hover:border-slate-400"
                                        }`}
                                    style={{ backgroundColor: color.hex }}
                                >
                                    {active && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="w-2 h-2 bg-white rounded-full shadow-sm mix-blend-difference" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};