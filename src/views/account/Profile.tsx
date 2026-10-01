import { useState } from "react";
import type { FC } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useFavorite } from "../../hooks/useFavorite";
import { useOrders } from "../../hooks/useOrders";
import { useNotifications } from "../../hooks/useNotifications";
import { useVerification } from "../../hooks/useVerification";
import { toErrorMessage } from "../../api/http";
import { initialsOf } from "../../bin/utils/security";
import type { User } from "../../bin/types/authType";
import { ProfileAvatarSection } from "../../components/account/ProfileAvatarSection";
import { ProfilePersonalInfo } from "../../components/account/ProfilePersonalInfo";
import { ProfileQuickLinks } from "../../components/account/ProfileQuickLinks";
import { ProfileSecuritySection } from "../../components/account/ProfileSecuritySection";
import { ProfileSellerApplication } from "../../components/account/ProfileSellerApplication";
import { ProfileStats } from "../../components/account/ProfileStats";

type ProfileUpdate = {
  fullName?: string;
  avatarUrl?: string | null;
  age?: number;
  gender?: User["gender"];
};

export const ProfilePage: FC = () => {
  const { user, updateProfile } = useAuth();
  const { orders, transactions } = useOrders();
  const { totalFavorites } = useFavorite();
  const { unreadCount } = useNotifications();
  const { status: verificationStatus } = useVerification();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [age, setAge] = useState<number | undefined>(user?.age);
  const [gender, setGender] = useState<User["gender"]>(user?.gender ?? "OTHER");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const saveProfile = async (data: ProfileUpdate) => {
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
    const trimmedName = fullName.trim();
    if (trimmedName.length < 2) {
      setProfileError("Le nom complet doit contenir au moins 2 caractères.");
      return;
    }
    void saveProfile({ fullName: trimmedName, age, gender });
  };

  if (!user) return null;

  const totalSpent = transactions
    .filter((transaction) => transaction.status === "success")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const isVerified = user.isVerified || verificationStatus === "APPROVED";

  return (
    <>
      <section className="bg-linear-to-br from-lurevia-dark to-emerald-900 rounded-2xl p-6 text-white">
        <h1 className="text-xl md:text-2xl font-black">
          Bonjour, {user.fullName.split(" ")[0]}
        </h1>
        <p className="text-sm text-emerald-100/80 mt-1">
          Bienvenue dans votre espace personnel Lurevia.
        </p>
        <ProfileStats
          orderCount={orders.length}
          favoriteCount={totalFavorites}
          transactionCount={transactions.length}
          totalSpent={totalSpent}
        />
      </section>

      <ProfileQuickLinks
        unreadCount={unreadCount}
        isVerified={isVerified}
        verificationStatus={verificationStatus}
      />
      {user.role === "CUSTOMER" && (
        <ProfileSellerApplication isVerified={isVerified} />
      )}
      <ProfileAvatarSection
        user={user}
        initials={initialsOf(user.fullName)}
        isSaving={isSaving}
        onSave={saveProfile}
        onError={setProfileError}
      />
      <ProfilePersonalInfo
        user={user}
        fullName={fullName}
        setFullName={setFullName}
        age={age}
        setAge={setAge}
        gender={gender}
        setGender={setGender}
        isSaving={isSaving}
        saved={saved}
        error={profileError}
        onSave={handleSave}
      />
      <ProfileSecuritySection />
    </>
  );
};
