import type { Product } from "../types/homeType";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    title: "Sac Cabas Volana en Raphia Tissé",
    categorySlugs: ["artisanat-malgache", "mode-accessoires"],
    price: 145000,
    imageUrl: "/images/products/product_1.jpg",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: "prod-2",
    title: "Robe Kimono en Lin Lavé - Sable",
    categorySlugs: ["mode-accessoires"],
    price: 210000,
    imageUrl: "/images/products/product_2.jpg",
    rating: 4.8,
    isFavorite: true
  },
  {
    id: "prod-3",
    title: "Collier Plastron Ikongo en Corne Corne et Laiton",
    categorySlugs: ["bijoux-artisanaux", "mode-accessoires"],
    price: 95000,
    imageUrl: "/images/products/product_3.jpg",
    rating: 4.6,
    isFavorite: false
  },
  {
    id: "prod-4",
    title: "Vase Ambohimanga en Terre Cuite Brut",
    categorySlugs: ["maison-decoration"],
    price: 120000,
    imageUrl: "/images/products/product_4.jpg",
    rating: 4.9,
    isFavorite: false
  },
  {
    id: "prod-5",
    title: "Pochette d'Ankarana Brodée Main",
    categorySlugs: ["artisanat-malgache"],
    price: 65000,
    imageUrl: "/images/products/product_5.jpg",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: "prod-6",
    title: "Chapeau de Paille Souple Tsena",
    categorySlugs: ["mode-accessoires", "artisanat-malgache"],
    price: 55000,
    imageUrl: "/images/products/product_6.jpg",
    rating: 4.5,
    isFavorite: false
  },
  {
    id: "prod-7",
    title: "Boucles d'Oreilles Minimalistes en Bois de Rose",
    categorySlugs: ["bijoux-artisanaux"],
    price: 45000,
    imageUrl: "/images/products/product_7.jpg",
    rating: 4.6,
    isFavorite: false
  },
  {
    id: "prod-8",
    title: "Panier de Rangement Zaza en Jonc Naturel",
    categorySlugs: ["maison-decoration", "artisanat-malgache"],
    price: 80000,
    imageUrl: "/images/products/product_8.jpg",
    rating: 4.8,
    isFavorite: false
  }
];
