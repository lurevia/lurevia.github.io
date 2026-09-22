import type { FC } from "react";
import { Link } from "react-router-dom";

import { NewsletterForm } from "../home/NewsletterForm";
import type { FooterLink, SocialLink } from "../../bin/types/homeType";
import {
  SOCIAL_LINKS,
  FOOTER_NAVIGATION,
  FOOTER_SERVICES,
  FOOTER_LEGAL,
} from "../../bin/utils/constant/constant";
import { buildImageUrl } from "../../bin/utils/images";

const FooterColumn: FC<{ title: string; links: FooterLink[] }> = ({
  title,
  links,
}) => {
  return (
    <div className="text-left">
      <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5 font-sans">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-blue-100/80 hover:text-white text-xs font-medium transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Footer: FC = () => {
  return (
    <footer
      role="contentinfo"
      className="hidden md:block text-blue-50 mt-16 w-full shrink-0 bg-linear-to-br from-lurevia-blue-700 via-lurevia-blue-600 to-lurevia-cyan border-t border-white/10"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 text-left flex flex-col items-start justify-start">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <img
                src={buildImageUrl("/images/logo.jpeg")}
                alt="Lurevia"
                loading="lazy"
                className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter brightness-110"
              />
              <div className="flex flex-col justify-center -space-y-1">
                <span className="text-lg font-black tracking-tight text-white font-sans uppercase">
                  Lurevia
                </span>
                <span className="text-[8px] font-bold tracking-[0.25em] text-blue-100 uppercase">
                  Be Authentic
                </span>
              </div>
            </Link>

            <p className="text-xs font-medium text-blue-100/80 leading-relaxed mb-6 max-w-sm">
              Lurevia met en lumière l'authenticité du savoir-faire malgache,
              une création à la fois pour le monde numérique.
            </p>

            <div className="flex gap-3">
              {SOCIAL_LINKS.map((link: SocialLink) => (
                <a
                  key={link.id}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-9 h-9 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-lurevia-blue-600 hover:scale-110 shadow-xs backdrop-blur-sm"
                >
                  <svg
                    className={`w-4.5 h-4.5 ${
                      link.isStroke ? "stroke-current fill-none" : "fill-current"
                    }`}
                    viewBox={link.viewBox}
                    strokeWidth={link.isStroke ? "1.5" : undefined}
                    strokeLinecap={link.isStroke ? "round" : undefined}
                    strokeLinejoin={link.isStroke ? "round" : undefined}
                    style={{ width: 18, height: 18 }}
                  >
                    <path d={link.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Navigation" links={FOOTER_NAVIGATION} />
          <FooterColumn title="Service client" links={FOOTER_SERVICES} />
          <FooterColumn title="Informations" links={FOOTER_LEGAL} />

          <div className="sm:col-span-2 md:col-span-3 lg:col-span-1 text-left">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-5 font-sans">
              Restez informé
            </h3>
            <p className="text-xs font-medium text-blue-100/80 leading-relaxed mb-4 max-w-xs">
              Nouveautés, artisans et offres exclusives — une fois par mois,
              pas plus.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-white/15 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-blue-100/70">
          <p>© 2026 Lurevia. Tous droits réservés.</p>
          <p className="flex items-center gap-2 tracking-wide uppercase text-[10px] font-bold text-blue-100">
            <span>🇲🇬</span>
            <span>Made in Madagascar</span>
          </p>
        </div>
      </div>
    </footer>
  );
};