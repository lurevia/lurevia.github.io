import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Check, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

type AvatarUploaderProps = {
  currentUrl?: string | null;
  initials: string;
  isSaving?: boolean;
  onChange: (url: string | undefined) => void;
};

// L'avatar n'est plus stocké tel quel (le backend valide `avatarUrl` comme
// une URL de 2048 caractères max — un fichier encodé en base64 dépasse
// toujours cette limite et échouait silencieusement). On demande donc un
// lien direct vers une image déjà hébergée ailleurs.
const isPlausibleImageUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const AvatarUploader: FC<AvatarUploaderProps> = ({
  currentUrl,
  initials,
  isSaving = false,
  onChange,
}) => {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [previewFailed, setPreviewFailed] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = draft.trim();

    if (!trimmed) {
      setError("Colle un lien d'image.");
      return;
    }
    if (!isPlausibleImageUrl(trimmed)) {
      setError("Ce lien ne ressemble pas à une URL valide (http:// ou https://).");
      return;
    }
    if (trimmed.length > 2048) {
      setError("Ce lien est trop long.");
      return;
    }

    setPreviewFailed(false);
    onChange(trimmed);
    setDraft("");
  };

  const handleRemove = () => {
    setError(null);
    onChange(undefined);
  };

  return (
    <div className="flex items-start gap-4">
      {/* Aperçu */}
      <div className="relative shrink-0">
        {currentUrl && !previewFailed ? (
          <img
            src={currentUrl}
            alt="Avatar"
            onError={() => setPreviewFailed(true)}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-lurevia-dark text-white flex items-center justify-center font-black text-xl">
            {initials}
          </div>
        )}

        {isSaving && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Loader2 size={20} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Lien */}
      <div className="flex-1 min-w-0">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="https://exemple.com/ma-photo.jpg"
              disabled={isSaving}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-lurevia-blue-300 focus:border-lurevia-blue-400"
            />
          </div>
          <Button type="submit" variant="ghost" size="sm" icon={Check} disabled={isSaving} className="border border-slate-200! bg-white!">
            Utiliser ce lien
          </Button>
          {currentUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={handleRemove}
              disabled={isSaving}
              className="text-red-500! hover:bg-red-50!"
            >
              Retirer
            </Button>
          )}
        </form>

        <p className="text-[11px] text-slate-500 mt-2">
          Colle le lien direct d'une image déjà en ligne (imgur, ta page Facebook, etc.).
        </p>

        {previewFailed && currentUrl && (
          <p className="text-[11px] text-amber-600 mt-1 font-medium">
            Ce lien ne charge pas d'image — vérifie qu'il pointe bien vers un fichier image.
          </p>
        )}
        {error && <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>}
      </div>
    </div>
  );
};
