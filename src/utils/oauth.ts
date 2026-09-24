import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from "../bin/config/env";

type OAuthProvider = "GOOGLE" | "FACEBOOK";
const OAUTH_STATE_KEY = "lurevia.oauth.state";

const getTokenFromCallback = (): { token: string; state: string | null } => {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return {
    token: hash.get("id_token") ?? hash.get("access_token") ?? query.get("id_token") ?? query.get("access_token") ?? "",
    state: hash.get("state") ?? query.get("state"),
  };
};

export const completeOAuthCallback = (): void => {
  const { token, state } = getTokenFromCallback();
  const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  if (!token || !expectedState || state !== expectedState) {
    window.opener?.postMessage({ type: "OAUTH_ERROR", message: "Réponse OAuth invalide." }, window.location.origin);
    return;
  }
  sessionStorage.removeItem(OAUTH_STATE_KEY);
  window.opener?.postMessage({ type: "OAUTH_TOKEN", token }, window.location.origin);
};

export const oauthHelper = {
  async triggerLogin(provider: OAuthProvider): Promise<string> {
    return new Promise((resolve, reject) => {
      const clientId = provider === "GOOGLE" ? GOOGLE_CLIENT_ID : FACEBOOK_APP_ID;
      if (!clientId) {
        reject(new Error(`La connexion ${provider === "GOOGLE" ? "Google" : "Facebook"} n'est pas configurée.`));
        return;
      }
      const state = crypto.randomUUID();
      const nonce = crypto.randomUUID();
      sessionStorage.setItem(OAUTH_STATE_KEY, state);
      const redirectUri = `${window.location.origin}/auth/callback`;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        state,
        ...(provider === "GOOGLE" ? { nonce } : {}),
        response_type: provider === "GOOGLE" ? "id_token" : "token",
        scope: provider === "GOOGLE" ? "openid email profile" : "email,public_profile",
      });
      const url = provider === "GOOGLE"
        ? `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
        : `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
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
