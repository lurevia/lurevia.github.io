export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status: number,
    code: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }
}

export const toErrorMessage = (
  error: unknown,
  fallback = "Une erreur est survenue. Veuillez réessayer.",
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
