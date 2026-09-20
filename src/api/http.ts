import { API_BASE_URL, REQUEST_TIMEOUT_MS } from "../bin/config/env";

/**
 * Client HTTP unique de l'application.
 *
 * Choix de sécurité structurants :
 *
 * 1. **Le token d'accès n'est jamais persisté** (ni localStorage, ni
 *    sessionStorage, ni cookie lisible en JS). Il vit uniquement dans la
 *    mémoire de l'onglet : un XSS ne peut donc pas le voler depuis le
 *    stockage, et il disparaît à la fermeture de l'onglet.
 * 2. **La session est rétablie via le refresh token en cookie httpOnly**
 *    posé par l'API (`/auth/refresh`). Ce cookie est inaccessible au
 *    JavaScript, et son `path` est restreint aux routes d'authentification.
 * 3. **L'authentification des requêtes passe par l'en-tête
 *    `Authorization`**, pas par un cookie ambiant : les requêtes de
 *    données ne sont donc pas exploitables en CSRF, puisqu'un site tiers
 *    ne peut pas ajouter cet en-tête.
 * 4. **Un seul refresh à la fois** (single-flight) : plusieurs requêtes
 *    qui reçoivent 401 en parallèle partagent le même renouvellement, ce
 *    qui évite de révoquer les tokens en cascade.
 * 5. **Timeout systématique** via AbortController : aucune requête ne
 *    peut bloquer l'interface indéfiniment.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ERREUR API
// ─────────────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** Vrai si l'erreur vient d'une session absente ou expirée. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

/** Message affichable à l'utilisateur, sans détail technique inutile. */
export const toErrorMessage = (
  error: unknown,
  fallback = "Une erreur est survenue. Veuillez réessayer."
): string => {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return "Impossible de joindre le serveur. Vérifiez votre connexion.";
    }
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

// ─────────────────────────────────────────────────────────────────────────────
// STOCKAGE EN MÉMOIRE DU TOKEN D'ACCÈS
// ─────────────────────────────────────────────────────────────────────────────

let accessToken: string | null = null;

export const tokenStore = {
  get: (): string | null => accessToken,
  set: (token: string | null): void => {
    accessToken = token;
  },
  clear: (): void => {
    accessToken = null;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HANDLERS DE SESSION (branchés par AuthContext)
// ─────────────────────────────────────────────────────────────────────────────

type SessionHandlers = {
  /** Appelé après un refresh réussi, avec l'utilisateur renvoyé par l'API. */
  onRefreshed?: (user: unknown) => void;
  /** Appelé lorsqu'aucune session valide ne peut être rétablie. */
  onExpired?: () => void;
};

let sessionHandlers: SessionHandlers = {};

export const setSessionHandlers = (handlers: SessionHandlers): void => {
  sessionHandlers = handlers;
};

// ─────────────────────────────────────────────────────────────────────────────
// REQUÊTE BAS NIVEAU
// ─────────────────────────────────────────────────────────────────────────────

export type QueryValue = string | number | boolean | undefined | null | (string | number)[];

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Joint le token d'accès et tente un refresh sur 401. Défaut : true. */
  auth?: boolean;
  signal?: AbortSignal;
};

const buildUrl = (path: string, query?: Record<string, QueryValue>): string => {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!query) return url;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      params.set(key, value.join(","));
    } else {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
};

type ApiEnvelope<T> = { data?: T; error?: { code?: string; message?: string; details?: unknown } };

const parseBody = async <T,>(response: Response): Promise<ApiEnvelope<T> | null> => {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;

  try {
    return (await response.json()) as ApiEnvelope<T>;
  } catch {
    return null;
  }
};

const rawRequest = async <T,>(path: string, options: RequestOptions): Promise<T> => {
  const { method = "GET", body, query, auth = true, signal } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Propage une éventuelle annulation externe (démontage de composant).
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener("abort", onExternalAbort);

  const headers: Record<string, string> = {
    Accept: "application/json",
    // Signale une requête XHR : une requête <form> cross-site ne peut pas
    // poser cet en-tête, ce qui ajoute une barrière anti-CSRF.
    "X-Requested-With": "XMLHttpRequest",
  };

  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = tokenStore.get();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      // Nécessaire pour transporter le cookie httpOnly de refresh.
      credentials: "include",
      // Pas de cache pour les données authentifiées.
      cache: "no-store",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    if (controller.signal.aborted && !signal?.aborted) {
      throw new ApiError("La requête a expiré.", 0, "TIMEOUT");
    }
    if (signal?.aborted) throw new ApiError("Requête annulée.", 0, "ABORTED");
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
      payload?.error?.details
    );
  }

  return (payload?.data ?? (undefined as T)) as T;
};

// ─────────────────────────────────────────────────────────────────────────────
// RENOUVELLEMENT DE SESSION (single-flight)
// ─────────────────────────────────────────────────────────────────────────────

type RefreshPayload = { user: unknown; accessToken: string };

let refreshInFlight: Promise<boolean> | null = null;

/**
 * Tente de renouveler la session à partir du cookie de refresh.
 * Retourne `true` si un nouveau token d'accès est disponible.
 */
export const refreshSession = (): Promise<boolean> => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const data = await rawRequest<RefreshPayload>("/auth/refresh", {
        method: "POST",
        auth: false,
      });

      if (!data?.accessToken) return false;

      tokenStore.set(data.accessToken);
      sessionHandlers.onRefreshed?.(data.user);
      return true;
    } catch {
      tokenStore.clear();
      return false;
    } finally {
      // Libère le verrou au prochain tick pour que les appels concurrents
      // aient tous récupéré la même promesse.
      setTimeout(() => {
        refreshInFlight = null;
      }, 0);
    }
  })();

  return refreshInFlight;
};

// ─────────────────────────────────────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────────────────────────────────────

/** Routes pour lesquelles un 401 ne doit jamais déclencher de refresh. */
const NO_RETRY_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

export const request = async <T,>(path: string, options: RequestOptions = {}): Promise<T> => {
  try {
    return await rawRequest<T>(path, options);
  } catch (error) {
    const shouldTryRefresh =
      error instanceof ApiError &&
      error.status === 401 &&
      options.auth !== false &&
      !NO_RETRY_PATHS.some((p) => path.startsWith(p));

    if (!shouldTryRefresh) throw error;

    const refreshed = await refreshSession();
    if (!refreshed) {
      sessionHandlers.onExpired?.();
      throw error;
    }

    return rawRequest<T>(path, options);
  }
};

export const api = {
  get: <T,>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T,>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),

  patch: <T,>(path: string, body?: unknown, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),

  delete: <T,>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
