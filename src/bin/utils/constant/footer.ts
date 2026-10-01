import type { FooterLink } from "../../types/homeType";

export const FOOTER_NAVIGATION: FooterLink[] = [
  { label: "Accueil", to: "/" },
  { label: "Boutique", to: "/boutique" },
  { label: "Vendeurs", to: "/vendeurs" },
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
  { label: "Suivi de commande", to: "/compte/commandes" },
  { label: "Donnez votre avis", to: "/feedback" },
];

export const FOOTER_LEGAL: FooterLink[] = [
  { label: "Conditions générales", to: "/cgv" },
  { label: "Politique de confidentialité", to: "/confidentialite" },
  { label: "Politique de retour", to: "/politique-retour" },
  { label: "Mentions légales", to: "/mentions-legales" },
];
