import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "../bin/config/env";
import { ApiError } from "./httpError";
import { tokenStore } from "./httpToken";

export type QueryValue =
  string | number | boolean | undefined | null | (string | number)[];

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  auth?: boolean;
  signal?: AbortSignal;
};

type ApiEnvelope<T> = {
  data?: T;
  error?: { code?: string; message?: string; details?: unknown };
};

const buildUrl = (path: string, query?: Record<string, QueryValue>): string => {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(","));
      continue;
    }
    params.set(key, String(value));
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

const parseBody = async <T>(
  response: Response,
): Promise<ApiEnvelope<T> | null> => {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;

  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return null;
  }
};

export const rawRequest = async <T>(
  path: string,
  options: RequestOptions,
): Promise<T> => {
  const { method = "GET", body, query, auth = true, signal } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener("abort", onExternalAbort);

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      credentials: "include",
      cache: "no-store",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError("La requête a expiré.", 0, "TIMEOUT");
    }
    if (signal?.aborted) {
      throw new ApiError("Requête annulée.", 0, "ABORTED");
    }
    throw new ApiError("Réseau indisponible.", 0, "NETWORK_ERROR", error);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", onExternalAbort);
  }

  const payload = await parseBody<T>(response);
  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? `Erreur ${response.status}`,
      response.status,
      payload?.error?.code ?? "HTTP_ERROR",
      payload?.error?.details,
    );
  }

  return (payload?.data ?? (undefined as T)) as T;
};
