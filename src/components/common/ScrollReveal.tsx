import { useEffect, useRef, useState } from "react";
import type { FC, ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

type ScrollRevealProps = {
  children: ReactNode;
  /** Délai en ms avant de lancer l'animation (utile pour effet cascade) */
  delay?: number;
  /** Direction d'où vient l'élément */
  direction?: Direction;
  /** Distance en pixels du décalage initial */
  distance?: number;
  /** Durée de l'animation en ms */
  duration?: number;
  /** Courbe d'accélération */
  easing?: "ease-out" | "ease-in-out" | "ease-spring" | "ease-soft";
  /** Rejouer l'animation à chaque entrée/sortie du viewport */
  once?: boolean;
  /** Seuil de déclenchement (0 → 1) */
  threshold?: number;
  /** Marge virtuelle autour du viewport pour déclencher plus tôt/tard */
  rootMargin?: string;
  /** Classes supplémentaires à appliquer au wrapper */
  className?: string;
  /** Balise HTML utilisée (par défaut `div`) */
  as?: "div" | "section" | "article" | "li";
};

const getInitialTransform = (
  direction: Direction,
  distance: number
): string => {
  switch (direction) {
    case "up":
      return `translate3d(0, ${distance}px, 0)`;
    case "down":
      return `translate3d(0, -${distance}px, 0)`;
    case "left":
      return `translate3d(-${distance}px, 0, 0)`;
    case "right":
      return `translate3d(${distance}px, 0, 0)`;
    case "none":
    default:
      return "translate3d(0, 0, 0)";
  }
};

const EASING_MAP: Record<string, string> = {
  "ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
  "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  "ease-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "ease-soft": "cubic-bezier(0.25, 1, 0.5, 1)",
};

export const ScrollReveal: FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = "up",
  distance = 32,
  duration = 900,
  easing = "ease-out",
  once = true,
  threshold = 0.15,
  rootMargin = "-40px 0px",
  className = "",
  as: Tag = "div",
}) => {
  const ref = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  const hiddenTransform = getInitialTransform(direction, distance);

  return (
    <Tag
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translate3d(0, 0, 0)" : hiddenTransform,
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: EASING_MAP[easing] ?? EASING_MAP["ease-out"],
        transitionDelay: `${delay}ms`,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {children}
    </Tag>
  );
};
