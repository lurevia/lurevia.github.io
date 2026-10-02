import { useEffect } from "react";

type SeoMetadata = {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  openGraphType?: "website" | "product";
  structuredData?: Record<string, unknown>;
};

const DEFAULT_TITLE = "Lurevia — Créations authentiques de Madagascar";
const DEFAULT_DESCRIPTION =
  "Découvrez les créations authentiques inspirées du savoir-faire malgache.";

const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
};

export const useSeoMetadata = ({
  title,
  description,
  canonicalPath,
  image,
  openGraphType = "website",
  structuredData,
}: SeoMetadata) => {
  const structuredDataJson = structuredData ? JSON.stringify(structuredData) : "";

  useEffect(() => {
    const absoluteUrl = new URL(canonicalPath, window.location.origin).href;
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", absoluteUrl);
    setMeta('meta[property="og:type"]', "property", "og:type", openGraphType);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);

    if (image) {
      setMeta('meta[property="og:image"]', "property", "og:image", image);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    canonical.href = absoluteUrl;

    const previousStructuredData = document.getElementById("lurevia-page-structured-data");
    previousStructuredData?.remove();
    if (structuredDataJson) {
      const script = document.createElement("script");
      script.id = "lurevia-page-structured-data";
      script.type = "application/ld+json";
      script.textContent = structuredDataJson;
      document.head.append(script);
    }

    return () => {
      const currentUrl = new URL(window.location.pathname, window.location.origin).href;
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]', "name", "description", DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:title"]', "property", "og:title", DEFAULT_TITLE);
      setMeta('meta[property="og:description"]', "property", "og:description", DEFAULT_DESCRIPTION);
      setMeta('meta[property="og:url"]', "property", "og:url", currentUrl);
      setMeta('meta[property="og:type"]', "property", "og:type", "website");
      canonical!.href = currentUrl;
      document.getElementById("lurevia-page-structured-data")?.remove();
    };
  }, [title, description, canonicalPath, image, openGraphType, structuredDataJson]);
};