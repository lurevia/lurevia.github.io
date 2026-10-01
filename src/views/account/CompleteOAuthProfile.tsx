import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { toErrorMessage } from "../../api/http";
import { validatePasswordStrength } from "../../hooks/useAuthForm";

export function CompleteOAuthProfile() {
  const { user, completeOAuthProfile } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const passwordError = validatePasswordStrength(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSaving(true);
    try {
      await completeOAuthProfile({ phone: phone.trim(), password });
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
            Ajoutez le téléphone manquant et définissez un mot de passe. Vous utiliserez ensuite votre email et ce mot de passe pour vous connecter.
          </p>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Input label="Téléphone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="0341234567" required />
        <Input label="Mot de passe" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
        <Input label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" required />
        <Button type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Continuer"}</Button>
      </form>
    </main>
  );
}
