import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Save,
  User as UserIcon,
  Mail,
  Phone,
  Bell,
  ChevronRight,
  Star,
  KeyRound,
} from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { useFavorite } from "../../hooks/useFavorite";
import { useOrders } from "../../hooks/useOrders";
import { useNotifications } from "../../hooks/useNotifications";
import { toErrorMessage } from "../../api/http";
import { validatePasswordStrength } from "../../hooks/useAuthForm";
import { initialsOf } from "../../bin/utils/security";
import { AvatarUploader } from "../../components/account/AvatarUploader";

export const ProfilePage: FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { orders, transactions } = useOrders();
  const { totalFavorites } = useFavorite();
  const { unreadCount } = useNotifications();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;

  const initials = initialsOf(user.fullName);

  const saveProfile = async (data: { fullName?: string; avatarUrl?: string | null }) => {
    setIsSaving(true);
    setProfileError(null);
    try {
      await updateProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setProfileError(toErrorMessage(error, "Modification impossible."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => {
    const trimmed = fullName.trim();
    if (trimmed.length < 2) {
      setProfileError("Le nom complet doit contenir au moins 2 caractères.");
      return;
    }
    void saveProfile({ fullName: trimmed });
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      setPasswordError(strengthError);
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("Le nouveau mot de passe doit différer de l'actuel.");
      return;
    }

    void (async () => {
      setIsChangingPassword(true);
      try {
        // Le serveur révoque toutes les sessions : l'utilisateur est
        // redirigé vers la page de connexion par la route protégée.
        await changePassword({ currentPassword, newPassword });
      } catch (error) {
        setPasswordError(toErrorMessage(error, "Changement de mot de passe impossible."));
      } finally {
        setCurrentPassword("");
        setNewPassword("");
        setIsChangingPassword(false);
      }
    })();
  };

  const totalSpent = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <>
      <div className="bg-linear-to-br from-lurevia-dark to-emerald-900 rounded-2xl p-6 text-white">
        <h1 className="text-xl md:text-2xl font-black">
          Bonjour, {user.fullName.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-emerald-100/80 mt-1">
          Bienvenue dans votre espace personnel Lurevia.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <StatCard label="Commandes" value={orders.length} />
          <StatCard label="Favoris" value={totalFavorites} />
          <StatCard label="Transactions" value={transactions.length} />
          <StatCard
            label="Total dépensé"
            value={new Intl.NumberFormat("fr-MG").format(totalSpent) + " Ar"}
            isText
          />
        </div>
      </div>

      {unreadCount > 0 && (
        <Link
          to="/compte/notifications"
          className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-2xl hover:bg-orange-100/70 transition-colors"
        >
          <div className="p-2 bg-lurevia-orange rounded-lg shrink-0">
            <Bell size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-lurevia-dark">
              {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue
              {unreadCount > 1 ? "s" : ""}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Découvrez les mises à jour de vos commandes et rappels d’avis.
            </p>
          </div>
          <ChevronRight size={16} className="text-lurevia-orange shrink-0" />
        </Link>
      )}

      <Link
        to="/compte/avis"
        className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-sm transition-all"
      >
        <div className="p-2 bg-yellow-50 rounded-lg shrink-0">
          <Star size={16} className="text-lurevia-yellow fill-lurevia-yellow" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-lurevia-dark">Mes avis &amp; feedbacks</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Voir vos avis produits et vos feedbacks service
          </p>
        </div>
        <ChevronRight size={16} className="text-slate-400 shrink-0" />
      </Link>

      {/* Photo de profil */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
        <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
          Photo de profil
        </h2>
        <AvatarUploader
          currentUrl={user.avatarUrl}
          initials={initials}
          isSaving={isSaving}
          onChange={(url) => void saveProfile({ avatarUrl: url })}
        />      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
        <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
          Informations personnelles
        </h2>

        <Input
          label="Nom complet"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={<UserIcon size={16} />}
          autoComplete="name"
          maxLength={120}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Email"
            type="email"
            value={user.email ?? "— non renseigné —"}
            readOnly
            disabled
            icon={<Mail size={16} />}
          />
          <Input
            label="Téléphone"
            type="tel"
            value={user.phone ?? "— non renseigné —"}
            readOnly
            disabled
            icon={<Phone size={16} />}
          />
        </div>

        <p className="text-[11px] text-slate-500">
          L'email et le téléphone servent d'identifiants de connexion : leur
          modification se fait sur demande auprès du service client, après
          vérification d'identité.
        </p>

        {profileError && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs font-medium text-red-600">{profileError}</p>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
          <p className="text-[11px] text-slate-500">
            Membre depuis{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <Button
            type="button"
            variant="primary"
            icon={Save}
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl!"
          >
            {saved ? "Enregistré ✓" : "Enregistrer"}
          </Button>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
        <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
          Sécurité
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <Input
            label="Mot de passe actuel"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={<KeyRound size={16} />}
            autoComplete="current-password"
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<KeyRound size={16} />}
            autoComplete="new-password"
          />

          <p className="text-[11px] text-slate-500">
            8 caractères minimum, avec au moins une minuscule, une majuscule et
            un chiffre. Changer votre mot de passe déconnecte tous vos appareils.
          </p>

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs font-medium text-red-600">{passwordError}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isChangingPassword || !currentPassword || !newPassword}
            className="rounded-xl!"
          >
            {isChangingPassword ? "Modification…" : "Changer le mot de passe"}
          </Button>
        </form>
      </div>
    </>
  );
};

const StatCard: FC<{
  label: string;
  value: number | string;
  isText?: boolean;
}> = ({ label, value, isText }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
    <p className={`font-black ${isText ? "text-sm md:text-base" : "text-2xl"}`}>{value}</p>
    <p className="text-[10px] uppercase tracking-wider text-emerald-100/80 font-bold mt-0.5">
      {label}
    </p>
  </div>
);
