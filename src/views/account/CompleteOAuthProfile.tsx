import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { toErrorMessage } from "../../api/http";

export function CompleteOAuthProfile() {
  const { user, completeOAuthProfile } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await completeOAuthProfile({ phone: phone.trim(), password: password || undefined });
      navigate("/compte/verification", { replace: true });
    } catch (err) {
      setError(toErrorMessage(err, "Impossible de compléter le compte."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-lurevia-dark">Complétez votre compte</h1>
          <p className="mt-2 text-sm text-slate-500">
            Votre connexion sociale est réussie. Ajoutez votre téléphone avant d’envoyer la demande de validation à l’administration.
          </p>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Input label="Téléphone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0341234567" required />
        <Input label="Mot de passe local (facultatif)" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Continuer"}</Button>
      </form>
    </main>
  );
}
