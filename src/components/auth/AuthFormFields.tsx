import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User as UserIcon } from "lucide-react";
import { Input } from "../ui/Input";
import type { useAuthForm } from "../../hooks/useAuthForm";

type AuthFormFieldsProps = {
  form: ReturnType<typeof useAuthForm>;
};

export const AuthFormFields = ({ form }: AuthFormFieldsProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isRegister = form.mode === "register";

  if (isRegister) {
    return (
      <div className="space-y-4">
        <Input
          label="Nom complet"
          type="text"
          value={form.registerFullName}
          onChange={(e) => form.setRegisterFullName(e.target.value)}
          placeholder="Ex: Mahery Manantsoa"
          icon={<UserIcon size={16} />}
          autoComplete="name"
          required
        />
        <Input
          label="Téléphone (Madagascar)"
          type="tel"
          value={form.registerPhone}
          onChange={(e) => form.setRegisterPhone(e.target.value)}
          placeholder="+261 34 00 000 00"
          icon={<Phone size={16} />}
          autoComplete="tel"
          required
        />
        <Input
          label="Adresse Email"
          type="email"
          value={form.registerEmail}
          onChange={(e) => form.setRegisterEmail(e.target.value)}
          placeholder="votre.email@domaine.mg"
          icon={<Mail size={16} />}
          autoComplete="email"
          required
        />
        <div className="relative">
          <Input
            label="Mot de passe secret"
            type={showPassword ? "text" : "password"}
            value={form.registerPassword}
            onChange={(e) => form.setRegisterPassword(e.target.value)}
            placeholder="Minimum 8 caractères"
            icon={<Lock size={16} />}
            autoComplete="new-password"
            required
            onKeyDown={(event) => {
              if (event.key === "Enter") void form.handleRegister();
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        label="Email ou Identifiant"
        type="email"
        value={form.loginEmail}
        onChange={(event) => form.setLoginEmail(event.target.value)}
        placeholder="vous@email.mg"
        icon={<Mail size={16} />}
        autoComplete="email"
      />
      <div className="relative">
        <Input
          label="Mot de passe"
          type={showPassword ? "text" : "password"}
          value={form.loginPassword}
          onChange={(event) => form.setLoginPassword(event.target.value)}
          placeholder="••••••••"
          icon={<Lock size={16} />}
          autoComplete="current-password"
          onKeyDown={(event) => {
            if (event.key === "Enter") void form.handleLogin();
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 cursor-pointer"
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

