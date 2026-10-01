import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pagesApi, type PublicSitePage } from "../api/pages";

export const ContentPage = ({ slug }: { slug?: string }) => {
  const params = useParams();
  const pageSlug = slug ?? params.slug ?? "";
  const [page, setPage] = useState<PublicSitePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    pagesApi
      .getPublished(pageSlug)
      .then((result) => {
        if (!controller.signal.aborted) setPage(result);
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Impossible de charger cette page."
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [pageSlug]);

  if (loading) {
    return <p className="mx-auto max-w-4xl px-6 py-16" role="status">Chargement...</p>;
  }
  if (error || !page) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16" role="alert">
        <h1 className="text-2xl font-bold">Page indisponible</h1>
        <p className="mt-3 text-slate-600">
          {error ?? "Cette page n'existe pas ou n'est pas publiée."}
        </p>
      </section>
    );
  }

  const paragraphs = page.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <h1 className="text-3xl font-black tracking-tight text-lurevia-dark md:text-4xl">
        {page.title}
      </h1>
      {page.summary && (
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{page.summary}</p>
      )}
      <div className="mt-8 space-y-5 text-sm leading-7 text-slate-700 md:text-base">
        {paragraphs.map((paragraph, index) => (
          <ContentBlock
            key={`${index}-${paragraph.slice(0, 24)}`}
            content={paragraph}
          />
        ))}
      </div>
    </article>
  );
};

const ContentBlock = ({ content }: { content: string }) => {
  const heading = content.match(/^(#{1,3})\s+(.+)$/);
  if (!heading) {
    return <p className="whitespace-pre-line">{content}</p>;
  }

  const Heading = heading[1].length === 1 ? "h2" : "h3";
  return <Heading className="font-bold text-lurevia-dark">{heading[2]}</Heading>;
};
