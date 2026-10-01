import {
  FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID,
} from "../bin/config/env";

const OAUTH_STATE_KEY = "lurevia.oauth.state";
const GOOGLE_NONCE_KEY = "lurevia.google.nonce";

type OAuthProvider = "FACEBOOK" | "GOOGLE";

const getTokenFromCallback = (): { token: string; state: string | null } => {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return {
    token:
      hash.get("id_token") ??
      hash.get("access_token") ??
      query.get("id_token") ??
      query.get("access_token") ??
      "",
    state: hash.get("state") ?? query.get("state"),
  };
};

export const completeOAuthCallback = (): void => {
  const { token, state } = getTokenFromCallback();
  const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  const googleNonce = sessionStorage.getItem(GOOGLE_NONCE_KEY);
  const nonce = getIdTokenNonce(token);
  const validState = state === expectedState;
  const validNonce = googleNonce !== null && nonce === googleNonce;
  if (
    !token ||
    !expectedState ||
    !validState ||
    (googleNonce !== null && !validNonce)
  ) {
    window.opener?.postMessage({ type: "OAUTH_ERROR", message: "Réponse OAuth invalide." }, window.location.origin);
    return;
  }
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(GOOGLE_NONCE_KEY);
  window.opener?.postMessage({ type: "OAUTH_TOKEN", token }, window.location.origin);
};

const getIdTokenNonce = (token: string): string | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))) as {
      nonce?: unknown;
    };
    return typeof decoded.nonce === "string" ? decoded.nonce : null;
  } catch {
    return null;
  }
};

export const oauthHelper = {
  async triggerLogin(provider: OAuthProvider): Promise<string> {
    return new Promise((resolve, reject) => {
      const clientId =
        provider === "FACEBOOK" ? FACEBOOK_APP_ID : GOOGLE_CLIENT_ID;
      if (!clientId) {
        reject(
          new Error(
            provider === "FACEBOOK"
              ? "La connexion Facebook n'est pas configurée."
              : "La connexion Google n'est pas configurée."
          )
        );
        return;
      }
      const state = crypto.randomUUID();
      sessionStorage.setItem(OAUTH_STATE_KEY, state);
      const redirectUri = `${window.location.origin}/auth/callback`;
      const nonce = crypto.randomUUID();
      if (provider === "GOOGLE") {
        sessionStorage.setItem(GOOGLE_NONCE_KEY, nonce);
      } else {
        sessionStorage.removeItem(GOOGLE_NONCE_KEY);
      }
      const params = new URLSearchParams(
        provider === "FACEBOOK"
          ? {
              client_id: clientId,
              redirect_uri: redirectUri,
              state,
              response_type: "token",
              scope: "email,public_profile",
            }
          : {
              client_id: clientId,
              redirect_uri: redirectUri,
              state,
              nonce,
              response_type: "id_token",
              scope: "openid email profile",
              prompt: "select_account",
            }
      );
      const providerUrl =
        provider === "FACEBOOK"
          ? "https://www.facebook.com/v18.0/dialog/oauth"
          : "https://accounts.google.com/o/oauth2/v2/auth";
      const url = `${providerUrl}?${params.toString()}`;
      const popup = window.open(url, "oauth-login", "width=500,height=600");

      if (!popup) {
        reject(new Error("Le bloqueur de popup a empêché la connexion."));
        return;
      }

      const timeout = window.setTimeout(() => {
        window.removeEventListener("message", onMessage);
        popup?.close();
        reject(new Error("La connexion sociale a expiré."));
      }, 120_000);
      const onMessage = (event: MessageEvent<{ type?: string; token?: string; message?: string }>) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === "OAUTH_ERROR") {
          window.clearTimeout(timeout);
          reject(new Error(event.data.message ?? "La connexion sociale a échoué."));
        }
        if (event.data?.type === "OAUTH_TOKEN" && event.data.token) {
          window.clearTimeout(timeout);
          resolve(event.data.token);
          popup?.close();
        }
        window.removeEventListener("message", onMessage);
      };
      window.addEventListener("message", onMessage);
      const checkInterval = window.setInterval(() => {
        if (popup?.closed) {
          window.clearInterval(checkInterval);
          window.clearTimeout(timeout);
          window.removeEventListener("message", onMessage);
          reject(new Error("La fenêtre de connexion a été fermée."));
        }
      }, 1000);
    });
  },
};
