import { Gift, Home, Shirt, ShoppingBag, Sparkles } from "lucide-react";
import type { Category } from "../../types/homeType";
import { buildImageUrl } from "../images";

export const CATEGORIES: Category[] = [
  {
    id: "artisanat",
    name: "Artisanat malgache",
    slug: "artisanat-malgache",
    description:
      "Découvrez des pièces uniques faites main par des artisans passionnés, valorisant les matières naturelles locales et durables de Madagascar.",
    imageUrl: buildImageUrl("/images/categories/category_1.jpg"),
    bannerUrl: buildImageUrl("/images/hero/banner_artisanat.jpg"),
    icon: ShoppingBag,
  },
  {
    id: "mode",
    name: "Mode & accessoires",
    slug: "mode-accessoires",
    description:
      "Découvrez notre sélection exclusive de vêtements, sacs cabas en raphia, chapeaux et accessoires pour un style unique, moderne et authentique.",
    imageUrl: buildImageUrl("/images/categories/category_2.jpg"),
    bannerUrl: buildImageUrl("/images/hero/banner_mode.jpg"),
    icon: Shirt,
  },
  {
    id: "bijoux",
    name: "Bijoux artisanaux",
    slug: "bijoux-artisanaux",
    description:
      "Des parures élégantes, colliers en corne et laiton forgés à la main par nos maîtres bijoutiers locaux.",
    imageUrl: buildImageUrl("/images/categories/category_3.jpg"),
    bannerUrl: buildImageUrl("/images/hero/banner_bijoux.jpg"),
    icon: Sparkles,
  },
  {
    id: "maison",
    name: "Maison & décoration",
    slug: "maison-decoration",
    description:
      "Sublimez votre intérieur avec des poteries, vanneries, paniers en jonc naturel et objets de décoration authentiques de la Grande Île.",
    imageUrl: buildImageUrl("/images/categories/category_4.jpg"),
    bannerUrl: buildImageUrl("/images/hero/banner_maison.jpg"),
    icon: Home,
  },
  {
    id: "beaute",
    name: "Beauté & bien-être",
    slug: "beaute-bien-etre",
    description:
      "Prenez soin de vous grâce à des huiles essentielles pures, des soins naturels et des produits de bien-être issus de la biodiversité malgache.",
    imageUrl: buildImageUrl("/images/categories/category_5.jpg"),
    bannerUrl: buildImageUrl("/images/hero/banner_beaute.jpg"),
    icon: Sparkles,
  },
  {
    id: "gadgets",
    name: "Gadgets & quotidien",
    slug: "gadgets-quotidien",
    description:
      "Une sélection d'objets pratiques, cadeaux originaux et accessoires utiles pour simplifier et égayer votre quotidien.",
    imageUrl: buildImageUrl("/images/categories/category_6.jpg"),
    bannerUrl: buildImageUrl("/images/hero/banner_gadgets.jpg"),
    icon: Gift,
  },
];
