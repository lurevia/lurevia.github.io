import { useState } from "react";
import type { FormEvent } from "react";
import { KeyRound } from "lucide-react";
import { toErrorMessage } from "../../api/http";
import { validatePasswordStrength } from "../../hooks/authValidation";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const ProfileSecuritySection = () => {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const passwordError = validatePasswordStrength(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword === currentPassword) {
      setError("Le nouveau mot de passe doit différer de l'actuel.");
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });
    } catch (submitError) {
      setError(
        toErrorMessage(submitError, "Changement de mot de passe impossible."),
      );
    } finally {
      setCurrentPassword("");
      setNewPassword("");
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
      <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
        Sécurité
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Mot de passe actuel"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          icon={<KeyRound size={16} />}
          autoComplete="current-password"
        />
        <Input
          label="Nouveau mot de passe"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          icon={<KeyRound size={16} />}
          autoComplete="new-password"
        />
        <p className="text-[11px] text-slate-500">
          8 caractères minimum, avec au moins une minuscule, une majuscule et un
          chiffre. Changer votre mot de passe déconnecte tous vos appareils.
        </p>
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs font-medium text-red-600">{error}</p>
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || !currentPassword || !newPassword}
          className="rounded-xl!"
        >
          {isSubmitting ? "Modification…" : "Changer le mot de passe"}
        </Button>
      </form>
    </section>
  );
};
