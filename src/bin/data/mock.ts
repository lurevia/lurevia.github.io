import type { Product } from "../types/homeType";

export const MOCK_PRODUCTS: Product[] = [
  // =========================================================================
  // 👜 1. ARTISANAT MALGACHE & VANNERIE
  // =========================================================================
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
    id: "prod-5",
    title: "Pochette d'Ankarana Brodée Main",
    categorySlugs: ["artisanat-malgache"],
    price: 65000,
    imageUrl: "/images/products/product_5.jpg",
    rating: 4.7,
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
  },
  {
    id: "prod-9",
    title: "Nappe de Table en Coton Broderie Soanierana",
    categorySlugs: ["artisanat-malgache", "maison-decoration"],
    price: 185000,
    imageUrl: "/images/products/product_9.jpg",
    rating: 4.9,
    isFavorite: false
  },
  {
    id: "prod-10",
    title: "Boîte à Bijoux Étoilée en Baobab Sculpté",
    categorySlugs: ["artisanat-malgache"],
    price: 75000,
    imageUrl: "/images/products/product_10.jpg",
    rating: 4.6,
    isFavorite: false
  },

  // =========================================================================
  // 👕 2. MODE & ACCESSOIRES
  // =========================================================================
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
    id: "prod-6",
    title: "Chapeau de Paille Souple Tsena",
    categorySlugs: ["mode-accessoires", "artisanat-malgache"],
    price: 55000,
    imageUrl: "/images/products/product_6.jpg",
    rating: 4.5,
    isFavorite: false
  },
  {
    id: "prod-11",
    title: "Sandales Nu-Pieds Antsirabe en Cuir Véritable",
    categorySlugs: ["mode-accessoires"],
    price: 125000,
    imageUrl: "/images/products/product_11.jpg",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: "prod-12",
    title: "Écharpe Isalo en Soie Sauvage d'Imerina",
    categorySlugs: ["mode-accessoires", "artisanat-malgache"],
    price: 160000,
    imageUrl: "/images/products/product_12.jpg",
    rating: 4.9,
    isFavorite: false
  },
  {
    id: "prod-13",
    title: "Ceinture Tressée Lurevia Terracotta",
    categorySlugs: ["mode-accessoires"],
    price: 48000,
    imageUrl: "/images/products/product_13.jpg",
    rating: 4.4,
    isFavorite: false
  },

  // =========================================================================
  // 💎 3. BIJOUX ARTISANAUX
  // =========================================================================
  {
    id: "prod-3",
    title: "Collier Plastron Ikongo en Corne et Laiton",
    categorySlugs: ["bijoux-artisanaux", "mode-accessoires"],
    price: 95000,
    imageUrl: "/images/products/product_3.jpg",
    rating: 4.6,
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
    id: "prod-14",
    title: "Bracelet Jonc Manambato Martelé en Laiton",
    categorySlugs: ["bijoux-artisanaux"],
    price: 39000,
    imageUrl: "/images/products/product_14.jpg",
    rating: 4.5,
    isFavorite: false
  },
  {
    id: "prod-15",
    title: "Bague Ajustable Sainte-Marie en Argent 925",
    categorySlugs: ["bijoux-artisanaux", "mode-accessoires"],
    price: 85000,
    imageUrl: "/images/products/product_15.jpg",
    rating: 4.8,
    isFavorite: false
  },
  {
    id: "prod-16",
    title: "Pendant de Collier Grain de Café en Zébu Poli",
    categorySlugs: ["bijoux-artisanaux"],
    price: 32000,
    imageUrl: "/images/products/product_16.jpg",
    rating: 4.3,
    isFavorite: false
  },

  // =========================================================================
  // 🏠 4. MAISON & DÉCORATION
  // =========================================================================
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
    id: "prod-17",
    title: "Cache-Pot Tsakitsaky en Écorce et Raphia",
    categorySlugs: ["maison-decoration"],
    price: 52000,
    imageUrl: "/images/products/product_17.jpg",
    rating: 4.6,
    isFavorite: false
  },
  {
    id: "prod-18",
    title: "Miroir Soleil Ranomafana Contour Vannerie",
    categorySlugs: ["maison-decoration", "artisanat-malgache"],
    price: 110000,
    imageUrl: "/images/products/product_18.jpg",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: "prod-19",
    title: "Vide-Poche Feuille de Palmier Tressée",
    categorySlugs: ["maison-decoration"],
    price: 25000,
    imageUrl: "/images/products/product_19.jpg",
    rating: 4.2,
    isFavorite: false
  },
  {
    id: "prod-20",
    title: "Bougie Parfumée Nosy Be Cannelle Vanille",
    categorySlugs: ["maison-decoration", "beaute-bien-etre"],
    price: 58000,
    imageUrl: "/images/products/product_20.jpg",
    rating: 4.8,
    isFavorite: false
  },

  // =========================================================================
  // 🌿 5. BEAUTÉ & BIEN-ÊTRE
  // =========================================================================
  {
    id: "prod-21",
    title: "Huile Essentielle pure de Ravintsara Bourbon",
    categorySlugs: ["beaute-bien-etre"],
    price: 35000,
    imageUrl: "/images/products/product_21.jpg",
    rating: 4.9,
    isFavorite: false
  },
  {
    id: "prod-22",
    title: "Huile Végétale de Calophylle Protectrice",
    categorySlugs: ["beaute-bien-etre"],
    price: 42000,
    imageUrl: "/images/products/product_22.jpg",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: "prod-23",
    title: "Savon Artisanal Tamatave Écorce d'Orange",
    categorySlugs: ["beaute-bien-etre", "artisanat-malgache"],
    price: 14000,
    imageUrl: "/images/products/product_23.jpg",
    rating: 4.5,
    isFavorite: false
  },
  {
    id: "prod-24",
    title: "Baume Corporel Nourrissant au Beurre de Karité & Vanille",
    categorySlugs: ["beaute-bien-etre"],
    price: 49000,
    imageUrl: "/images/products/product_24.jpg",
    rating: 4.8,
    isFavorite: false
  },
  {
    id: "prod-25",
    title: "Sels de Bain Relaxants de Toliara à l'Ylang-Ylang",
    categorySlugs: ["beaute-bien-etre"],
    price: 28000,
    imageUrl: "/images/products/product_25.jpg",
    rating: 4.6,
    isFavorite: false
  },

  // =========================================================================
  // 🎁 6. GADGETS & QUOTIDIEN
  // =========================================================================
  {
    id: "prod-26",
    title: "Porte-Clés Baobab en Bois de Palissandre Mini",
    categorySlugs: ["gadgets-quotidien", "artisanat-malgache"],
    price: 18000,
    imageUrl: "/images/products/product_26.jpg",
    rating: 4.4,
    isFavorite: false
  },
  {
    id: "prod-27",
    title: "Gourde Isotherme Lurevia Nomade Gravée",
    categorySlugs: ["gadgets-quotidien"],
    price: 65000,
    imageUrl: "/images/products/product_27.jpg",
    rating: 4.7,
    isFavorite: false
  },
  {
    id: "prod-28",
    title: "Carnet de Notes Tsarasaotra en Papier Antaimoro",
    categorySlugs: ["gadgets-quotidien", "artisanat-malgache"],
    price: 34000,
    imageUrl: "/images/products/product_28.jpg",
    rating: 4.9,
    isFavorite: false
  },
  {
    id: "prod-29",
    title: "Paille Réutilisable en Bambou d'Ambanja (Lot de 4)",
    categorySlugs: ["gadgets-quotidien", "maison-decoration"],
    price: 15000,
    imageUrl: "/images/products/product_29.jpg",
    rating: 4.6,
    isFavorite: false
  },
  {
    id: "prod-30",
    title: "Pochette de Protection d'Écran en Tissu Brodé",
    categorySlugs: ["gadgets-quotidien", "mode-accessoires"],
    price: 29000,
    imageUrl: "/images/products/product_30.jpg",
    rating: 4.5,
    isFavorite: false
  }
];
