import { FacebookIcon, GoogleIcon } from "../icons/SocialIcons";
import type { OAuthProvider } from "../../api/auth";

type AuthProviderButtonsProps = {
  isLogin: boolean;
  disabled: boolean;
  onLogin: (provider: OAuthProvider) => void;
  onSignup: (provider: OAuthProvider) => void;
};

const PROVIDERS: {
  id: OAuthProvider;
  label: string;
  icon: typeof FacebookIcon;
}[] = [
  { id: "FACEBOOK", label: "Facebook", icon: FacebookIcon },
  { id: "GOOGLE", label: "Google (Gmail)", icon: GoogleIcon },
];

export const AuthProviderButtons = ({
  isLogin,
  disabled,
  onLogin,
  onSignup,
}: AuthProviderButtonsProps) => (
  <>
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-slate-400">
          {isLogin ? "Ou continuer avec" : "S'inscrire avec"}
        </span>
      </div>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {PROVIDERS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => (isLogin ? onLogin(id) : onSignup(id))}
          disabled={disabled}
          className={[
            "flex cursor-pointer items-center justify-center gap-2 rounded-xl",
            "border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold",
            "text-slate-700 transition-colors hover:bg-slate-50 active:bg-slate-100",
            "disabled:cursor-not-allowed disabled:opacity-50",
          ].join(" ")}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  </>
);
