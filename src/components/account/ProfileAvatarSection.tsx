import type { User } from "../../bin/types/authType";
import { AvatarImageField } from "./AvatarImageField";

type ProfileAvatarSectionProps = {
  user: User;
  initials: string;
  isSaving: boolean;
  onSave: (data: { avatarUrl: string | null }) => Promise<void>;
};

export const ProfileAvatarSection = ({
  user,
  initials,
  isSaving,
  onSave,
}: ProfileAvatarSectionProps) => {
  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
      <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
        Photo de profil
      </h2>
      <AvatarImageField
        currentUrl={user.avatarUrl}
        initials={initials}
        isSaving={isSaving}
        onChange={(url) => void onSave({ avatarUrl: url ?? null })}
      />
    </section>
  );
};
