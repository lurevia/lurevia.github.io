import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { sellerApi, type SellerProfile } from "../../api/seller";
import { toErrorMessage } from "../../api/http";

const emptyProfile: Omit<SellerProfile, "id"> = {
  storeName: "",
  description: "",
  logoUrl: null,
};

export function SellerProfileSettings() {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void sellerApi
      .profile(controller.signal)
      .then(({ storeName, description, logoUrl }) =>
        setProfile({ storeName, description, logoUrl }),
      )
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(toErrorMessage(requestError));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await sellerApi.updateProfile(profile);
      setProfile({
        storeName: updated.storeName,
        description: updated.description,
        logoUrl: updated.logoUrl,
      });
      setSaved(true);
    } catch (requestError) {
      setError(
        toErrorMessage(
          requestError,
          "La boutique n’a pas pu être mise à jour.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <p className="py-12 text-center text-sm text-slate-500">
        Chargement de votre boutique…
      </p>
    );

  return (
    <section className="max-w-2xl rounded-2xl border border-slate-100 bg-white p-5 md:p-7">
      <h2 className="text-lg font-black text-lurevia-dark">
        Informations publiques
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Ces informations sont visibles par tous les visiteurs de votre boutique.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {saved && (
        <p
          role="status"
          className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          Boutique mise à jour.
        </p>
      )}
      <form onSubmit={(event) => void save(event)} className="mt-5 space-y-4">
        <label className="block text-xs font-bold text-slate-600">
          Nom de la boutique
          <input
            value={profile.storeName}
            onChange={(event) =>
              setProfile({ ...profile, storeName: event.target.value })
            }
            minLength={2}
            maxLength={100}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
        <label className="block text-xs font-bold text-slate-600">
          Présentation
          <textarea
            value={profile.description}
            onChange={(event) =>
              setProfile({ ...profile, description: event.target.value })
            }
            minLength={20}
            maxLength={1000}
            rows={5}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
        <label className="block text-xs font-bold text-slate-600">
          Logo de la boutique (URL)
          <input
            type="url"
            value={profile.logoUrl ?? ""}
            onChange={(event) =>
              setProfile({ ...profile, logoUrl: event.target.value || null })
            }
            className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-lurevia-orange px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
          <Link to="/vendeurs" className="text-sm font-bold text-lurevia-dark">
            Voir les boutiques publiques
          </Link>
        </div>
      </form>
    </section>
  );
}
