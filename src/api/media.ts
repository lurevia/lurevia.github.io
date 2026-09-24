import { api } from "./http";

export type ImportedMedia = {
  id: string;
  publicUrl: string;
  contentType: string;
  byteSize: number;
  googleArchiveStatus: string;
};

export const mediaApi = {
  importUrl(sourceUrl: string): Promise<ImportedMedia> {
    return api.post<{ media: ImportedMedia }>("/media/import", { url: sourceUrl.trim() }).then((data) => data.media);
  },
};
