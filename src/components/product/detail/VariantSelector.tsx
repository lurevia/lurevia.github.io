import type { FC } from "react";
import { Ruler } from "lucide-react";
import { Button } from "../../ui/Button";
import { RadioGroup } from "../../ui/RadioGroup";
import type { ColorVariant } from "../../../bin/types/homeType";

type VariantSelectorProps = {
    sizes?: string[];
    colors?: ColorVariant[];
    selectedSize: string | null;
    selectedColor: ColorVariant | null;
    onSelectSize: (size: string) => void;
    onSelectColor: (color: ColorVariant) => void;
    onOpenSizeGuide?: () => void;
};

export const VariantSelector: FC<VariantSelectorProps> = ({
    sizes,
    colors,
    selectedSize,
    selectedColor,
    onSelectSize,
    onSelectColor,
    onOpenSizeGuide,
}) => {
    return (
        <div className="space-y-5">
            {sizes && sizes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2 gap-3">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Taille
                        </label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={Ruler}
                            onClick={onOpenSizeGuide}
                            className="text-lurevia-orange! hover:bg-orange-50! px-2! py-1! h-auto! text-[11px]! font-bold!"
                        >
                            Guide des tailles
                        </Button>
                    </div>

                    <RadioGroup
                        name="size"
                        variant="capsule"
                        value={selectedSize ?? ""}
                        options={sizes.map((s) => ({ value: s, label: s }))}
                        onChange={onSelectSize}
                    />
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

                    <RadioGroup
                        name="color"
                        variant="swatch"
                        value={selectedColor?.hex ?? ""}
                        options={colors.map((c) => ({
                            value: c.hex,
                            label: c.label,
                            color: c.hex,
                        }))}
                        onChange={(hex) => {
                            const color = colors.find((c) => c.hex === hex);
                            if (color) onSelectColor(color);
                        }}
                    />
                </div>
            )}
        </div>
    );
};