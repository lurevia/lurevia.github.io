import { api } from "./http";

export type PublicSitePage = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  showInFooter?: boolean;
  footerSection?: "NAVIGATION" | "SERVICES" | "INFORMATION" | null;
  updatedAt: string;
};

export const pagesApi = {
  listPublished: () => api.get<PublicSitePage[]>("/pages/public", { auth: false }),
  getPublished: (slug: string) =>
    api.get<PublicSitePage>(`/pages/public/${encodeURIComponent(slug)}`, {
      auth: false,
    }),
};
