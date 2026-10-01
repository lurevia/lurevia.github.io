import { CreditCard, Headphones, Leaf, Truck } from "lucide-react";
import type { Feature } from "../../types/homeType";

export const FEATURES: Feature[] = [
  {
    id: "quality",
    icon: Leaf,
    title: "Produits sélectionnés",
    description:
      "Des produits choisis avec soin pour leur qualité et leur intérêt.",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Paiement adapté",
    description: "Des solutions de paiement pensées pour le marché malgache.",
  },
  {
    id: "delivery",
    icon: Truck,
    title: "Livraison à Madagascar",
    description: "Des solutions de livraison adaptées à notre marché.",
  },
  {
    id: "support",
    icon: Headphones,
    title: "Service client",
    description: "Une relation simple, humaine et accessible.",
  },
];
