import {
  ShoppingBag,
  Shirt,
  Home,
  Sparkles,
  Gift,
  Leaf, 
  CreditCard, 
  Truck,
  BookOpen,
  Info,
  Layers,
  Mail,
  Coins,
  Heart,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import type { Category, Feature, FooterLink, SocialLink, WhyUsItem } from "../../types/homeType";

import heroImg1 from "/images/hero/hero_1.png";
import heroImg2 from "/images/hero/hero_2.png";
import heroImg3 from "/images/hero/hero_3.png";


export const CATEGORIES: Category[] = [
  {
    id: "artisanat",
    name: "Artisanat malgache",
    slug: "artisanat-malgache",
    description: "Découvrez des pièces uniques faites main par des artisans passionnés, valorisant les matières naturelles locales et durables de Madagascar.",
    imageUrl: "/images/categories/category_1.png",
    bannerUrl: "/images/hero/banner_artisanat.jpg", 
    icon: ShoppingBag,
  },
  {
    id: "mode",
    name: "Mode & accessoires",
    slug: "mode-accessoires",
    description: "Découvrez notre sélection exclusive de vêtements, sacs cabas en raphia, chapeaux et accessoires pour un style unique, moderne et authentique.",
    imageUrl: heroImg3,
    bannerUrl: "/images/hero/banner_mode.jpg",
    icon: Shirt,
  },
  {
    id: "bijoux",
    name: "Bijoux artisanaux",
    slug: "bijoux-artisanaux",
    description: "Des parures élégantes, colliers en corne et laiton forgés à la main par nos maîtres bijoutiers locaux.",
    imageUrl: "/images/categories/category_3.png",
    bannerUrl: "/images/hero/banner_bijoux.jpg",
    icon: Sparkles,
  },
  {
    id: "maison",
    name: "Maison & décoration",
    slug: "maison-decoration",
    description: "Sublimez votre intérieur avec des poteries, vanneries, paniers en jonc naturel et objets de décoration authentiques de la Grande Île.",
    imageUrl: "/images/categories/category_4.png",
    bannerUrl: "/images/hero/banner_maison.jpg",
    icon: Home,
  },
  {
    id: "beaute",
    name: "Beauté & bien-être",
    slug: "beaute-bien-etre",
    description: "Prenez soin de vous grâce à des huiles essentielles pures, des soins naturels et des produits de bien-être issus de la biodiversité malgache.",
    imageUrl: "/images/categories/category_5.png",
    bannerUrl: "/images/hero/banner_beaute.jpg",
    icon: Sparkles,
  },
  {
    id: "gadgets",
    name: "Gadgets & quotidien",
    slug: "gadgets-quotidien",
    description: "Une sélection d'objets pratiques, cadeaux originaux et accessoires utiles pour simplifier et égayer votre quotidien.",
    imageUrl: "/images/categories/category_6.png",
    bannerUrl: "/images/hero/banner_gadgets.jpg",
    icon: Gift,
  },
];

export const FEATURES: Feature[] = [
  {
    id: "quality",
    icon: Leaf,
    title: "Produits sélectionnés",
    description: "Des produits choisis avec soin pour leur qualité et leur intérêt.",
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

export const FOOTER_NAVIGATION: FooterLink[] = [
  { label: "Accueil", to: "/" },
  { label: "Boutique", to: "/boutique" },
  { label: "Catégories", to: "/categories" },
  { label: "À propos", to: "/a-propos" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export const FOOTER_SERVICES: FooterLink[] = [
  { label: "FAQ", to: "/faq" },
  { label: "Livraison", to: "/livraison" },
  { label: "Retours", to: "/retours" },
  { label: "Paiement", to: "/paiement" },
  { label: "Suivi de commande", to: "/suivi" },
];

export const FOOTER_LEGAL: FooterLink[] = [
  { label: "Conditions générales", to: "/cgv" },
  { label: "Politique de confidentialité", to: "/confidentialite" },
  { label: "Politique de retour", to: "/politique-retour" },
  { label: "Mentions légales", to: "/mentions-legales" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    viewBox: "0 0 24 24",
    path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    viewBox: "0 0 24 24",
    isStroke: true,
    path: "M2 2h20v20H2z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me",
    viewBox: "0 0 24 24",
    path: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.006 5.232 5.24 0 11.648 0c3.105.001 6.024 1.211 8.22 3.412 2.196 2.2 3.401 5.123 3.4 8.234-.006 6.415-5.24 11.647-11.643 11.647-2.003-.001-3.973-.518-5.741-1.503L0 24zm6.19-4.315c1.666.988 3.511 1.51 5.394 1.512 5.357 0 9.715-4.354 9.72-9.713.003-2.597-1.005-5.04-2.842-6.878C16.634 2.766 14.195 1.751 11.64 1.75c-5.362 0-9.72 4.355-9.725 9.715-.002 1.831.479 3.621 1.393 5.215L2.247 21.73l5.06-1.328z",
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://youtube.com",
    viewBox: "0 0 24 24",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
];

export const SLIDES = [
  {
    id: 1,
    title: "New Collection Summer 2024",
    discount: "Up to 40% Off",
    bgClass: "bg-lurevia-cyan/15",
    image: heroImg1,
  },
  {
    id: 2,
    title: "L'artisanat Malgache Revisité",
    discount: "Créations Authentiques",
    bgClass: "bg-lurevia-cyan/25",
    image: heroImg2,
  },
  {
    id: 3,
    title: "Be Authentic, Be Lurevia",
    discount: "Nouveautés Exclusives",
    bgClass: "bg-lurevia-cyan/10",
    image: heroImg3,
  }
];

export const NAV_LINKS = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/boutique", label: "Boutique", icon: ShoppingBag },
  { to: "/categories", label: "Catégories", icon: Layers },
  { to: "/a-propos", label: "À Propos", icon: Info },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/contact", label: "Contact", icon: Mail },
];

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
