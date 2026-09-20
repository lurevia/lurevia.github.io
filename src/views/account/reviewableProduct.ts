/**
 * Produit tel qu'il apparaît dans une commande : un instantané
 * (identifiant, titre, image) suffisant pour l'affichage des avis, sans
 * recharger la fiche produit complète.
 */
export type ReviewableProduct = {
  id: string;
  title: string;
  imageUrl?: string;
};
