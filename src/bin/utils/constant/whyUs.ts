import { Coins, Heart, Leaf, ShieldCheck } from "lucide-react";
import type { WhyUsItem } from "../../types/homeType";

export const WHY_US_ITEMS: WhyUsItem[] = [
  {
    id: "authenticity",
    icon: Leaf,
    title: "Authenticité",
    description: "Des produits vrais, issus de notre belle île.",
  },
  {
    id: "selection",
    icon: ShieldCheck,
    title: "Sélection",
    description: "Une sélection rigoureuse pour votre quotidien.",
  },
  {
    id: "accessibility",
    icon: Coins,
    title: "Accessibilité",
    description: "Des prix justes, adaptés au marché malgache.",
  },
  {
    id: "proximity",
    icon: Heart,
    title: "Proximité",
    description: "Une communauté locale et engagée.",
  },
];
