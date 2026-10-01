import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { pagesApi, type PublicSitePage } from "../api/pages";

export const BlogPage = () => {
  const [articles, setArticles] = useState<PublicSitePage[]>([]);
  const [intro, setIntro] = useState<PublicSitePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    pagesApi
      .listPublished()
      .then((pages) => {
        if (active) {
          setIntro(pages.find((page) => page.slug === "blog") ?? null);
          setArticles(
            pages
              .filter((page) => page.slug.startsWith("blog-"))
              .sort((first, second) =>
                second.updatedAt.localeCompare(first.updatedAt)
              )
          );
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Impossible de charger les articles."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-8 flex items-end gap-4 border-b border-stone-200 pb-6">
        <span className="rounded-2xl bg-orange-100 p-3 text-lurevia-orange">
          <BookOpen size={24} />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lurevia-orange">
            {intro?.title ?? "Blog"}
          </p>
          <h1 className="mt-1 text-3xl font-black text-lurevia-dark md:text-4xl">
            {intro?.summary || "Histoires et savoir-faire"}
          </h1>
        </div>
      </div>
      {intro?.content && (
        <p className="mb-8 max-w-3xl whitespace-pre-line leading-relaxed text-stone-600">
          {intro.content}
        </p>
      )}

      {loading && <p role="status">Chargement des articles...</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!loading && !error && articles.length === 0 && (
        <p className="rounded-2xl bg-stone-100 p-8 text-stone-600">
          Les prochains articles seront publiés ici.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/pages/${article.slug}`}
            className={[
              "group rounded-2xl border border-stone-200 bg-white p-6",
              "shadow-sm transition hover:-translate-y-1",
              "hover:border-orange-300 hover:shadow-lg",
            ].join(" ")}
          >
            <div className="mb-5 h-1 w-12 rounded-full bg-lurevia-orange transition-all group-hover:w-20" />
            <h2 className="text-xl font-bold text-lurevia-dark">
              {article.title}
            </h2>
            {article.summary && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">
                {article.summary}
              </p>
            )}
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-lurevia-orange">
              Lire l'article <ArrowUpRight size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
