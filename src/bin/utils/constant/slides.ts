import { buildImageUrl } from "../images";

const slides = [
  {
    id: 1,
    title: "New Collection Summer 2024",
    discount: "Up to 40% Off",
    bgClass: "bg-lurevia-cyan/15",
    image: buildImageUrl("/images/hero/hero_1.png"),
  },
  {
    id: 2,
    title: "L'artisanat Malgache Revisité",
    discount: "Créations Authentiques",
    bgClass: "bg-lurevia-cyan/25",
    image: buildImageUrl("/images/hero/hero_2.png"),
  },
  {
    id: 3,
    title: "Be Authentic, Be Lurevia",
    discount: "Nouveautés Exclusives",
    bgClass: "bg-lurevia-cyan/10",
    image: buildImageUrl("/images/hero/hero_3.png"),
  },
];

export const SLIDES = slides;
