import { api } from "./http";

export type ImportedMedia = {
  id: string;
  publicUrl: string;
  contentType: string;
  byteSize: number;
  googleArchiveStatus: string;
};

export const mediaApi = {
  uploadDataUrl(dataUrl: string): Promise<ImportedMedia> {
    return api.post<{ media: ImportedMedia }>("/media/upload", { dataUrl }).then((data) => data.media);
  },
  importUrl(sourceUrl: string): Promise<ImportedMedia> {
    return api.post<{ media: ImportedMedia }>("/media/import", { url: sourceUrl.trim() }).then((data) => data.media);
  },
};
