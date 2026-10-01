import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";

import { pagesApi, type PublicSitePage } from "../../api/pages";
import { useBrandSettings } from "../../context/BrandSettingsContext";
import {
  FOOTER_LEGAL,
  FOOTER_NAVIGATION,
  FOOTER_SERVICES,
} from "../../bin/utils/constant/footer";
import { NewsletterForm } from "../home/NewsletterForm";

const FooterColumn: FC<{
  title: string;
  links: { label: string; to: string }[];
}> = ({ title, links }) => (
  <div className="text-left">
    <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">
      {title}
    </h2>
    <ul className="space-y-2.5">
      {[...new Map(links.map((link) => [link.to, link] as const)).values()].map((link) => (
        <li key={link.to}>
          <Link
            to={link.to}
            className="text-xs font-medium text-stone-300 transition-colors hover:text-orange-300"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const Footer: FC = () => {
  const settings = useBrandSettings();
  const [pages, setPages] = useState<PublicSitePage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    pagesApi
      .listPublished()
      .then((result) => {
        if (active) setPages(result.filter((page) => page.showInFooter));
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Impossible de charger les liens."
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="mt-16 w-full shrink-0 border-t-4 border-orange-500 bg-stone-900 text-stone-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="text-left lg:col-span-1">
          <Link to="/" className="mb-4 flex items-center gap-3">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt=""
                loading="lazy"
                className="h-9 w-auto object-contain"
              />
            )}
            <span className="text-lg font-black uppercase tracking-tight text-white">
              {settings.siteName}
            </span>
          </Link>
          {settings.siteTagline && (
            <p className="max-w-sm text-xs font-medium leading-relaxed text-stone-300">
              {settings.siteTagline}
            </p>
          )}
        </div>
        <FooterColumn
          title="Navigation"
          links={[
            ...FOOTER_NAVIGATION,
            ...pages
              .filter(
                (page) =>
                  page.showInFooter && page.footerSection === "NAVIGATION"
              )
              .map((page) => ({ label: page.title, to: `/pages/${page.slug}` })),
          ]}
        />
        <FooterColumn
          title="Aide et services"
          links={[
            ...FOOTER_SERVICES,
            ...pages
              .filter(
                (page) =>
                  page.showInFooter && page.footerSection === "SERVICES"
              )
              .map((page) => ({ label: page.title, to: `/pages/${page.slug}` })),
          ]}
        />
        <FooterColumn
          title="Informations"
          links={[
            ...FOOTER_LEGAL.map((link) => ({
              ...link,
              to:
                link.to === "/confidentialite"
                  ? "/pages/confidentialite"
                  : link.to === "/cgv"
                    ? "/pages/conditions-generales"
                    : `/pages/${link.to.slice(1)}`,
            })),
            ...pages
              .filter(
                (page) =>
                  page.showInFooter && page.footerSection === "INFORMATION"
              )
              .map((page) => ({ label: page.title, to: `/pages/${page.slug}` })),
          ]}
        />
        <div className="text-left">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-white">
            Restez informé
          </h2>
          <p className="mb-4 text-xs leading-relaxed text-stone-300">
            Recevez les nouveautés et les sélections de Lurevia.
          </p>
          <NewsletterForm />
        </div>
        {error && (
          <p className="text-xs text-red-300" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="mx-auto flex max-w-7xl justify-between border-t border-stone-700 px-6 py-6 text-xs text-stone-400">
        <p>
          © {new Date().getFullYear()} {settings.siteName}
        </p>
        <span>Artisanat malgache authentique</span>
      </div>
    </footer>
  );
};
