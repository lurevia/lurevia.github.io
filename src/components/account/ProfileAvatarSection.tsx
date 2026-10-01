import type { User } from "../../bin/types/authType";
import { mediaApi } from "../../api/media";
import { toErrorMessage } from "../../api/http";
import { AvatarUploader } from "./AvatarUploader";

type ProfileAvatarSectionProps = {
  user: User;
  initials: string;
  isSaving: boolean;
  onSave: (data: { avatarUrl: string | null }) => Promise<void>;
  onError: (message: string) => void;
};

export const ProfileAvatarSection = ({
  user,
  initials,
  isSaving,
  onSave,
  onError,
}: ProfileAvatarSectionProps) => {
  const handleAvatarChange = async (url: string | null) => {
    if (!url) {
      await onSave({ avatarUrl: null });
      return;
    }

    try {
      const media = url.startsWith("data:")
        ? await mediaApi.uploadDataUrl(url)
        : await mediaApi.importUrl(url);
      await onSave({ avatarUrl: media.publicUrl });
    } catch (error) {
      onError(toErrorMessage(error, "Import de l'image impossible."));
    }
  };

  return (
    <section className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
      <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
        Photo de profil
      </h2>
      <AvatarUploader
        currentUrl={user.avatarUrl}
        initials={initials}
        isSaving={isSaving}
        onChange={(url) => void handleAvatarChange(url ?? null)}
      />
    </section>
  );
};
