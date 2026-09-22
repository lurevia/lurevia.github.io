import { useRef, useState } from "react";
import type { ChangeEvent, FC } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

type AvatarUploaderProps = {
  currentUrl?: string | null;
  initials: string;
  isSaving?: boolean;
  onChange: (dataUrl: string | undefined) => void;
};

const MAX_SIZE = 500 * 1024;

export const AvatarUploader: FC<AvatarUploaderProps> = ({
  currentUrl,
  initials,
  isSaving = false,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }

    if (file.size > MAX_SIZE) {
      setError("Image trop lourde (max 500 Ko).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.onerror = () => setError("Impossible de lire le fichier.");
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setError(null);
    onChange(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            icon={Camera}
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="border border-slate-200! bg-white!"
          >
            Changer la photo
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
        </div>

        <p className="text-[11px] text-slate-500 mt-2">
          JPG ou PNG, max 500 Ko.
        </p>

        {error && (
          <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
};