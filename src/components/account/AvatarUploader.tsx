import { useState } from "react";
import type { FC } from "react";
import { Link, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

type AvatarUploaderProps = {
  currentUrl?: string | null;
  initials: string;
  isSaving?: boolean;
  onChange: (dataUrl: string | undefined) => void;
};

export const AvatarUploader: FC<AvatarUploaderProps> = ({
  currentUrl,
  initials,
  isSaving = false,
  onChange,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  const handleRemove = () => {
    setError(null);
    onChange(undefined);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Aperçu */}
      <div className="relative shrink-0">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="Avatar"
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

      {/* Actions */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            <input
              type="url"
              value={url}
              onChange={(event) => { setUrl(event.target.value); setError(null); }}
              placeholder="https://photos.google.com/..."
              className="min-w-60 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              disabled={isSaving}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={Link}
              onClick={() => url.trim() ? onChange(url.trim()) : setError("Collez un lien image public.")}
              disabled={isSaving}
              className="border border-slate-200! bg-white!"
            >
              Importer le lien
            </Button>
          </div>

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
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          Collez un lien public JPG, PNG, GIF ou WebP. L’image sera copiée dans le stockage média Lurevia.
        </p>

        {error && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>
        )}

      </div>
    </div>
  );
};