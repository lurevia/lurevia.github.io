/**
 * Utilitaires pour déclencher le flux d'authentification sociale.
 * Le frontend ouvre une fenêtre popup vers le fournisseur,
 * récupère le token via un postMessage, puis ferme la popup.
 */

type OAuthProvider = "GOOGLE" | "FACEBOOK";

export const oauthHelper = {
  async triggerLogin(provider: OAuthProvider): Promise<string> {
    return new Promise((resolve, reject) => {
      const clientIds = {
        GOOGLE: "YOUR_GOOGLE_CLIENT_ID", // Devra être passé via env ou config
        FACEBOOK: "YOUR_FACEBOOK_CLIENT_ID",
      };

      const authUrls = {
        GOOGLE: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientIds.GOOGLE}&redirect_uri=${window.location.origin}/auth/callback&response_type=id_token&scope=openid%20email%20profile`,
        FACEBOOK: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientIds.FACEBOOK}&redirect_uri=${window.location.origin}/auth/callback&state=lurevia&scope=email,public_profile`,
      };

      const url = authUrls[provider];
      const popup = window.open(url, "oauth-login", "width=500,height=600");

      if (!popup) {
        reject(new Error("Le bloqueur de popup a empêché la connexion."));
        return;
      }

      const checkInterval = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkInterval);
        }
      }, 1000);

      window.addEventListener("message", (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === "OAUTH_TOKEN") {
          resolve(event.data.token);
          popup?.close();
          clearInterval(checkInterval);
        }
      }, { once: true });
    });
  },
};
