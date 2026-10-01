import { Check, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import { Input } from "../ui/Input";
import type { useAuthForm } from "../../hooks/useAuthForm";

type AuthFormFieldsProps = {
  form: ReturnType<typeof useAuthForm>;
  isLogin: boolean;
  onOpenConsent: () => void;
};

export const AuthFormFields = ({
  form,
  isLogin,
  onOpenConsent,
}: AuthFormFieldsProps) => {
  if (isLogin) {
    return (
      <>
        <Input
          label="Email"
          type="email"
          value={form.loginEmail}
          onChange={(event) => form.setLoginEmail(event.target.value)}
          placeholder="vous@email.mg"
          icon={<Mail size={16} />}
          autoComplete="email"
        />
        <Input
          label="Mot de passe"
          type="password"
          value={form.loginPassword}
          onChange={(event) => form.setLoginPassword(event.target.value)}
          placeholder="••••••••"
          icon={<Lock size={16} />}
          autoComplete="current-password"
          onKeyDown={(event) => {
            if (event.key === "Enter") void form.handleLogin();
          }}
        />
      </>
    );
  }

  return (
    <>
      <Input
        label="Nom complet"
        value={form.fullName}
        onChange={(event) => form.setFullName(event.target.value)}
        placeholder="Rasoa Miora"
        icon={<UserIcon size={16} />}
        autoComplete="name"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Email"
          type="email"
          value={form.registerEmail}
          onChange={(event) => form.setRegisterEmail(event.target.value)}
          placeholder="rasoa@email.mg"
          icon={<Mail size={16} />}
          autoComplete="email"
        />
        <Input
          label="Téléphone"
          type="tel"
          inputMode="tel"
          value={form.registerPhone}
          onChange={(event) => form.setRegisterPhone(event.target.value)}
          placeholder="034 12 345 67"
          icon={<Phone size={16} />}
          autoComplete="tel"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Mot de passe"
          type="password"
          value={form.registerPassword}
          onChange={(event) => form.setRegisterPassword(event.target.value)}
          placeholder="8 caractères"
          icon={<Lock size={16} />}
          autoComplete="new-password"
        />
        <Input
          label="Confirmer"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => form.setConfirmPassword(event.target.value)}
          placeholder="••••••••"
          icon={<Lock size={16} />}
          autoComplete="new-password"
          onKeyDown={(event) => {
            if (event.key === "Enter") void form.handleRegister();
          }}
        />
      </div>
      <div className="flex items-start gap-2.5 pt-1">
        <button
          type="button"
          role="checkbox"
          aria-checked={form.hasAcceptedTerms}
          onClick={() => {
            if (!form.hasAcceptedTerms) onOpenConsent();
          }}
          className={`mt-0.5 shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
            form.hasAcceptedTerms
              ? "bg-lurevia-orange border-lurevia-orange"
              : "border-slate-300 bg-white"
          }`}
        >
          {form.hasAcceptedTerms && (
            <Check size={10} strokeWidth={3} className="text-white" />
          )}
        </button>
        <p className="text-[11px] text-slate-500 leading-snug">
          J'accepte les{" "}
          <button
            type="button"
            onClick={onOpenConsent}
            className="font-bold text-lurevia-orange hover:underline cursor-pointer"
          >
            CGU et la politique des cookies
          </button>
        </p>
      </div>
    </>
  );
};
