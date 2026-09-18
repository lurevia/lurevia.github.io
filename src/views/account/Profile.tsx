import { useState } from "react";
import type { FC } from "react";
import { Link } from "react-router-dom";
import {
  Save,
  User as UserIcon,
  Mail,
  Phone,
  Bell,
  ChevronRight,
  Star,
} from "lucide-react";
import { AvatarUploader } from "../../components/account/AvatarUploader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuth } from "../../hooks/useAuth";
import { useFavorite } from "../../hooks/useFavorite";
import { useOrders } from "../../hooks/useOrders";
import { useNotifications } from "../../hooks/useNotifications";
import { useReviews } from "../../hooks/useReviews";

export const ProfilePage: FC = () => {
  const { user, updateProfile } = useAuth();
  const { orders, transactions } = useOrders();
  const { totalFavorites } = useFavorite();
  const { unreadCount } = useNotifications();
  const { getUserReviewForProduct } = useReviews();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = () => {
    updateProfile({
      fullName: fullName.trim() || user.fullName,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalSpent = transactions
    .filter((t) => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  /** 🎯 Calcul du nombre d'avis à donner */
  const pendingCount = orders.reduce((count, order) => {
    const delay = 5 * 24 * 60 * 60 * 1000;
    const isOld = Date.now() - new Date(order.createdAt).getTime() >= delay;
    if (!isOld) return count;

    for (const item of order.items) {
      if (!getUserReviewForProduct(item.product.id)) count++;
    }
    return count;
  }, 0);

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

      {/* Notification en attente */}
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
          <p className="text-xs font-black text-lurevia-dark">
            Mes avis & feedbacks
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {pendingCount > 0
              ? `${pendingCount} avis en attente de votre part`
              : "Voir tous vos avis produits et feedbacks service"}
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
          onChange={(url) => updateProfile({ avatarUrl: url })}
        />
      </div>

      {/* Informations personnelles */}
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
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="— non renseigné —"
            icon={<Mail size={16} />}
            autoComplete="email"
          />
          <Input
            label="Téléphone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="— non renseigné —"
            icon={<Phone size={16} />}
            autoComplete="tel"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
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
            className="rounded-xl!"
          >
            {saved ? "Enregistré ✓" : "Enregistrer"}
          </Button>
        </div>
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
    <p className={`font-black ${isText ? "text-sm md:text-base" : "text-2xl"}`}>
      {value}
    </p>
    <p className="text-[10px] uppercase tracking-wider text-emerald-100/80 font-bold mt-0.5">
      {label}
    </p>
  </div>
);