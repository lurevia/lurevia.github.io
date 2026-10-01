import {
  BookOpen,
  Home,
  Info,
  Layers,
  Mail,
  MessageSquareHeart,
  ShoppingBag,
  Store,
} from "lucide-react";

export const NAV_LINKS = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/boutique", label: "Boutique", icon: ShoppingBag },
  { to: "/vendeurs", label: "Vendeurs", icon: Store },
  { to: "/categories", label: "Catégories", icon: Layers },
  { to: "/a-propos", label: "À Propos", icon: Info },
  { to: "/feedback", label: "Avis", icon: MessageSquareHeart },
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/contact", label: "Contact", icon: Mail },
];
