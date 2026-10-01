import { Lock, Mail } from "lucide-react";
import { Input } from "../ui/Input";
import type { useAuthForm } from "../../hooks/useAuthForm";

type AuthFormFieldsProps = {
  form: ReturnType<typeof useAuthForm>;
};

export const AuthFormFields = ({ form }: AuthFormFieldsProps) => (
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
