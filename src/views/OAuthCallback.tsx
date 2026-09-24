import { useEffect } from "react";
import { completeOAuthCallback } from "../utils/oauth";

export function OAuthCallback() {
  useEffect(() => {
    completeOAuthCallback();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <p className="text-sm font-semibold text-slate-600">Finalisation de la connexion…</p>
    </main>
  );
}
