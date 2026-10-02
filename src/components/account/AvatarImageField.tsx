import { ImageDropzone } from "../common/ImageDropzone";

type AvatarImageFieldProps = {
  currentUrl?: string | null;
  initials: string;
  isSaving?: boolean;
  onChange: (url: string | undefined) => void;
};

export const AvatarImageField = ({
  currentUrl,
  initials,
  isSaving = false,
  onChange,
}: AvatarImageFieldProps) => (
  <div className="flex items-start gap-4">
    {currentUrl ? (
      <img
        src={currentUrl}
        alt="Photo de profil actuelle"
        className="h-20 w-20 shrink-0 rounded-full border-2 border-slate-100 object-cover"
      />
    ) : (
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-lurevia-dark text-xl font-black text-white">
        {initials}
      </div>
    )}
    <div className="min-w-0 flex-1">
      <ImageDropzone
        images={[]}
        onChange={(images) => onChange(images[0])}
        label="Déposez une photo ou choisissez un fichier"
        circular
      />
      {currentUrl && (
        <button
          type="button"
          disabled={isSaving}
          onClick={() => onChange(undefined)}
          className="mt-2 text-xs font-bold text-red-600 disabled:opacity-50"
        >
          Retirer la photo
        </button>
      )}
      {isSaving && <p className="mt-2 text-xs text-slate-500">Enregistrement…</p>}
    </div>
  </div>
);