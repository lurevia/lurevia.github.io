import { ShieldAlert } from "lucide-react";
import { Button } from "../ui/Button";

type AdminSessionNoticeProps = {
  error: string | null;
  onLogout: () => void;
};

export const AdminSessionNotice = ({
  error,
  onLogout,
}: AdminSessionNoticeProps) => (
  <section className="border border-blue-200 bg-white p-8 text-center shadow-2xl">
    <ShieldAlert className="mx-auto mb-4 text-blue-700" size={32} />
    <h1 className="text-xl font-bold text-slate-950">
      Accès réservé à l’administration
    </h1>
    <p className="mt-3 text-sm leading-relaxed text-slate-600">
      Cette session administrateur ne peut pas accéder à l’espace client.
      Utilisez votre compte client ou déconnectez cette session.
    </p>
    {error && (
      <p className="mt-3 text-sm text-red-700" role="alert">
        {error}
      </p>
    )}
    <Button
      type="button"
      variant="primary"
      onClick={onLogout}
      className="mt-6 w-full! py-3! font-bold"
    >
      Déconnecter cette session
    </Button>
  </section>
);
