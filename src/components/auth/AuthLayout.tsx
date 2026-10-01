import { useEffect, useState, type FC, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type AuthLayoutProps = {
  children: ReactNode;
};

const BACKGROUND_IMAGES = [
  "/images/hero/banner_artisanat.jpg",
  "/images/hero/banner_bijoux.jpg",
  "/images/hero/banner_maison.jpg",
  "/images/baobab-sunset.jpg",
];

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % BACKGROUND_IMAGES.length);
    }, 6500);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-stone-950 px-4 py-20 sm:px-6">
      <div className="absolute inset-0" aria-hidden="true">
        {BACKGROUND_IMAGES.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            className={[
              "absolute inset-0 h-full w-full object-cover transition-all",
              "duration-[1500ms] ease-in-out",
              "motion-reduce:transform-none motion-reduce:transition-none",
              index === activeImage
                ? "scale-105 opacity-100"
                : "scale-100 opacity-0",
            ].join(" ")}
          />
        ))}
        <div className="absolute inset-0 bg-stone-950/55" />
        <div className="absolute inset-0 bg-linear-to-b from-stone-950/50 via-stone-950/25 to-stone-950/70" />
        <div className="absolute inset-0 bg-orange-950/15 mix-blend-color" />
      </div>

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link
          to="/"
          className={[
            "inline-flex items-center gap-2 text-xs font-bold uppercase",
            "tracking-wider text-white/80 transition-colors hover:text-white",
          ].join(" ")}
        >
          <ArrowLeft size={15} />
          Accueil
        </Link>
        <Link
          to="/"
          className="font-serif text-2xl font-black italic tracking-tight text-white drop-shadow-lg"
        >
          Lurevia
        </Link>
        <span className="w-[76px]" aria-hidden="true" />
      </header>

      <main className="relative z-10 w-full max-w-md">{children}</main>

      <div
        className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2"
        role="group"
        aria-label="Choisir l’image d’arrière-plan"
      >
        {BACKGROUND_IMAGES.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(index)}
            aria-label={`Afficher l’image ${index + 1}`}
            aria-pressed={index === activeImage}
            className={[
              "h-1.5 rounded-full transition-all",
              index === activeImage
                ? "w-8 bg-orange-300"
                : "w-2 bg-white/55 hover:bg-white/85",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
};
