import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { MOCK_PRODUCTS } from "../bin/data/mock";
import type { Product, ColorVariant } from "../bin/types/homeType";

export type UseProductDetailReturn = {
    product: Product | null;
    isLoading: boolean;
    selectedImage: string;
    selectedSize: string | null;
    selectedColor: ColorVariant | null;
    quantity: number;
    setSelectedImage: (url: string) => void;
    setSelectedSize: (size: string) => void;
    setSelectedColor: (color: ColorVariant) => void;
    incrementQuantity: () => void;
    decrementQuantity: () => void;
    setQuantity: (n: number) => void;
    resetSelection: () => void;
};

export const useProductDetail = (): UseProductDetailReturn => {
    const { id } = useParams<{ id: string }>();

    const product = useMemo(
        () => MOCK_PRODUCTS.find((p) => p.id === id) ?? null,
        [id]
    );

    const images = useMemo(() => {
        if (!product) return [];
        return product.images?.length
            ? product.images
            : [product.imageUrl];
    }, [product]);

    /** 3. États locaux */
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
    const [quantity, setQuantityState] = useState<number>(1);

    /** Initialise l'image une fois le produit connu */
    useMemo(() => {
        if (images.length > 0 && selectedImage === "") {
            setSelectedImage(images[0]);
        }
        if (product?.sizes?.length && selectedSize === null) {
            setSelectedSize(product.sizes[0]);
        }
        if (product?.colors?.length && selectedColor === null) {
            setSelectedColor(product.colors[0]);
        }
    }, [images, product, selectedImage, selectedSize, selectedColor]);

    /** 4. Actions */
    const incrementQuantity = () =>
        setQuantityState((prev) => Math.min(prev + 1, product?.stock ?? 99));
    const decrementQuantity = () =>
        setQuantityState((prev) => Math.max(prev - 1, 1));
    const setQuantity = (n: number) => {
        const max = product?.stock ?? 99;
        setQuantityState(Math.max(1, Math.min(n, max)));
    };

    const resetSelection = () => {
        setQuantityState(1);
        setSelectedSize(product?.sizes?.[0] ?? null);
        setSelectedColor(product?.colors?.[0] ?? null);
    };

    return {
        product,
        isLoading: !product,
        selectedImage: selectedImage || images[0] || "",
        selectedSize,
        selectedColor,
        quantity,
        setSelectedImage,
        setSelectedSize,
        setSelectedColor,
        incrementQuantity,
        decrementQuantity,
        setQuantity,
        resetSelection,
    };
};