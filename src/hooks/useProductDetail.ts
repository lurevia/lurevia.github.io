import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { productsApi } from "../api/products";
import { ApiError } from "../api/http";
import { getProductImages } from "../bin/utils/getProductImages";
import type { ColorVariant, Product } from "../bin/types/homeType";

export type UseProductDetailReturn = {
    product: Product | null;
    isLoading: boolean;
    notFound: boolean;
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

/** Fiche produit chargée à la demande depuis l'API. */
export const useProductDetail = (): UseProductDetailReturn => {
    const { id } = useParams<{ id: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(null);
    const [quantity, setQuantityState] = useState<number>(1);

    useEffect(() => {
        if (!id) {
            setNotFound(true);
            setIsLoading(false);
            return;
        }

        const controller = new AbortController();

        const load = async () => {
            setIsLoading(true);
            setNotFound(false);

            try {
                const found = await productsApi.getById(id, controller.signal);
                if (controller.signal.aborted) return;

                setProduct(found);
                setSelectedImage(getProductImages(found)[0] ?? "");
                setSelectedSize(found.sizes?.[0] ?? null);
                setSelectedColor(found.colors?.[0] ?? null);
                setQuantityState(1);
            } catch (error) {
                if (controller.signal.aborted) return;
                setProduct(null);
                // 404 / identifiant invalide : on redirige vers la boutique.
                setNotFound(error instanceof ApiError && error.status !== 0);
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        };

        void load();
        return () => controller.abort();
    }, [id]);

    const images = useMemo(() => (product ? getProductImages(product) : []), [product]);

    const incrementQuantity = () =>
        setQuantityState((prev) => Math.min(prev + 1, product?.stock ?? 99));

    const decrementQuantity = () => setQuantityState((prev) => Math.max(prev - 1, 1));

    const setQuantity = (n: number) => {
        const max = product?.stock ?? 99;
        setQuantityState(Math.max(1, Math.min(Math.trunc(n) || 1, max)));
    };

    const resetSelection = () => {
        setQuantityState(1);
        setSelectedSize(product?.sizes?.[0] ?? null);
        setSelectedColor(product?.colors?.[0] ?? null);
    };

    return {
        product,
        isLoading,
        notFound,
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
