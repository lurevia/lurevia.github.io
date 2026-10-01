import { useEffect, useState, type FC } from "react";
import { Link } from "react-router-dom";

import { pagesApi, type PublicSitePage } from "../../api/pages";
import { useBrandSettings } from "../../context/BrandSettingsContext";

type FooterSection = NonNullable<PublicSitePage["footerSection"]>;

const SECTION_TITLES: Record<FooterSection, string> = {
  NAVIGATION: "Navigation",
  SERVICES: "Service client",
  INFORMATION: "Informations",
};

const FooterColumn: FC<{
  title: string;
  pages: PublicSitePage[];
}> = ({ title, pages }) => (
  <div className="text-left">
    <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-white">
      {title}
    </h2>
    <ul className="space-y-2.5">
      {pages.map((page) => (
        <li key={page.id}>
          <Link
            to={`/pages/${page.slug}`}
            className="text-xs font-medium text-blue-100/80 transition-colors hover:text-white"
          >
            {page.title}
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
    <footer
      className="mt-16 hidden w-full shrink-0 border-t border-white/10 bg-linear-to-br from-lurevia-blue-700 via-lurevia-blue-600 to-lurevia-cyan text-blue-50 md:block"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div className="text-left">
          <Link to="/" className="mb-5 flex items-center gap-3">
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
            <p className="max-w-sm text-xs font-medium leading-relaxed text-blue-100/80">
              {settings.siteTagline}
            </p>
          )}
        </div>
        {(["NAVIGATION", "SERVICES", "INFORMATION"] as const).map((section) => {
          const sectionPages = pages.filter(
            (page) => page.footerSection === section
          );
          return sectionPages.length > 0 ? (
            <FooterColumn
              key={section}
              title={SECTION_TITLES[section]}
              pages={sectionPages}
            />
          ) : null;
        })}
        {error && (
          <p className="text-xs text-red-100" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="mx-auto flex max-w-7xl justify-between border-t border-white/15 px-6 py-8 text-xs text-blue-100/70">
        <p>
          © {new Date().getFullYear()} {settings.siteName}
        </p>
      </div>
    </footer>
  );
};
