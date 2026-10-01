import { ApiError } from "./httpError";
import { tokenStore } from "./httpToken";
import { rawRequest } from "./httpTransport";
import type { RequestOptions } from "./httpTransport";

export { ApiError, toErrorMessage } from "./httpError";
export { tokenStore } from "./httpToken";
export type { QueryValue, RequestOptions } from "./httpTransport";

type SessionHandlers = {
  onRefreshed?: (user: unknown) => void;
  onExpired?: () => void;
};

type RefreshPayload = { user: unknown; accessToken: string };

let sessionHandlers: SessionHandlers = {};
let refreshInFlight: Promise<boolean> | null = null;

export const setSessionHandlers = (handlers: SessionHandlers): void => {
  sessionHandlers = handlers;
};

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
      setTimeout(() => {
        refreshInFlight = null;
      }, 0);
    }
  })();

  return refreshInFlight;
};

const NO_RETRY_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/logout",
];

export const request = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  try {
    return await rawRequest<T>(path, options);
  } catch (error) {
    const shouldTryRefresh =
      error instanceof ApiError &&
      error.status === 401 &&
      options.auth !== false &&
      !NO_RETRY_PATHS.some((noRetryPath) => path.startsWith(noRetryPath));

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
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(
    path: string,
    options?: Omit<RequestOptions, "method" | "body">,
  ) => request<T>(path, { ...options, method: "DELETE" }),
};
