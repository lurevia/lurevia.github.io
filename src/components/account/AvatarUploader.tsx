import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Link2, Trash2, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { safeImageUrl } from "../../bin/utils/security";

type AvatarUploaderProps = {
    currentUrl?: string;
    initials: string;
    isSaving?: boolean;
    onChange: (url: string | null) => void;
};

const MAX_URL_LENGTH = 2048;

/**
 * Photo de profil.
 *
 * L'API n'accepte qu'une URL d'image (2048 caractères max) : l'envoi d'un
 * fichier encodé en base64 est refusé, et stocker une image complète dans
 * un champ texte serait de toute façon une mauvaise pratique. On demande
 * donc une URL, validée ici (http/https uniquement) avant envoi.
 */
export const AvatarUploader: FC<AvatarUploaderProps> = ({
    currentUrl,
    initials,
    isSaving = false,
    onChange,
}) => {
    const [url, setUrl] = useState(currentUrl ?? "");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        const trimmed = url.trim();
        if (trimmed === "") {
            onChange(null);
            return;
        }

        if (trimmed.length > MAX_URL_LENGTH) {
            setError("URL trop longue (2048 caractères maximum).");
            return;
        }

        const safe = safeImageUrl(trimmed);
        if (!safe || !/^https?:/i.test(safe)) {
            setError("Indiquez une URL d'image valide commençant par https://");
            return;
        }

        onChange(safe);
    };

    const handleRemove = () => {
        setUrl("");
        setError(null);
        onChange(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="shrink-0">
                    {currentUrl ? (
                        <img
                            src={currentUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-lurevia-dark text-white flex items-center justify-center font-black text-xl">
                            {initials}
                        </div>
                    )}
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                    Collez l'adresse d'une image hébergée en ligne (JPG, PNG ou WebP).
                    Aucune image n'est stockée sur nos serveurs.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    label="URL de la photo"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://exemple.com/photo.jpg"
                    icon={<Link2 size={16} />}
                    maxLength={MAX_URL_LENGTH}
                    error={error ?? undefined}
                />

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        icon={Check}
                        disabled={isSaving}
                        className="rounded-xl!"
                    >
                        {isSaving ? "Enregistrement…" : "Valider la photo"}
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
            </form>
        </div>
    );
};
