import type { FC } from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { UserAvatar } from "../../account/UserAvatar";


type NavbarAccountProps = {
  className?: string;
};

export const NavbarAccount: FC<NavbarAccountProps> = ({ className = "" }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Link
        to="/auth"
        aria-label="Se connecter"
        className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-xl text-slate-600 hover:text-lurevia-dark hover:bg-slate-50 transition-colors ${className}`}
      >
        <User size={20} />
        {/* <span className="text-[10px] font-bold leading-none">Compte</span> */}
      </Link>
    );
  }

  const firstName = user.fullName.split(" ")[0];

  return (
    <Link
      to="/compte"
      aria-label={`Mon compte : ${user.fullName}`}
      className={`flex flex-col items-center justify-center gap-1 p-1 rounded-xl hover:bg-slate-50 transition-colors ${className}`}
    >
      <UserAvatar size={32} />
      <span className="text-[10px] font-bold text-slate-700 leading-none max-w-14 truncate">
        {firstName}
      </span>
    </Link>
  );
};