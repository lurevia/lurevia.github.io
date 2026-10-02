import { useRef, useState, type DragEvent } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { mediaApi } from "../../api/media";

type ImageDropzoneProps = {
  images: string[];
  onChange: (images: string[]) => void;
  label: string;
  maxImages?: number;
  circular?: boolean;
};

const readImageFile = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lecture de l’image impossible."));
    reader.readAsDataURL(file);
  });

export const ImageDropzone = ({
  images,
  onChange,
  label,
  maxImages = 1,
  circular = false,
}: ImageDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const remaining = Math.max(0, maxImages - images.length);

  const uploadFiles = async (files: FileList | File[]) => {
    const selectedFiles = Array.from(files).slice(0, remaining);
    if (selectedFiles.length === 0) return;
    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024
    );
    if (invalidFile) {
      setError("Choisissez une image valide de 8 Mo maximum.");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const dataUrls = await Promise.all(selectedFiles.map(readImageFile));
      const uploads = await Promise.all(dataUrls.map(mediaApi.uploadDataUrl));
      onChange([...images, ...uploads.map((media) => media.publicUrl)]);
    } catch {
      setError("L’envoi vers le stockage d’images a échoué. Réessayez.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    void uploadFiles(event.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-slate-600">{label}</p>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative">
              <img
                src={image}
                alt={`${label} ${index + 1}`}
                className={`h-20 w-20 border border-slate-200 object-cover ${circular ? "rounded-full" : "rounded-lg"}`}
              />
              <button
                type="button"
                aria-label={`Retirer l’image ${index + 1}`}
                onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
                className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-red-600 shadow"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
      {remaining > 0 && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex min-h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center text-xs font-semibold transition-colors ${dragActive ? "border-lurevia-orange bg-orange-50" : "border-slate-300 bg-slate-50 hover:border-lurevia-orange"}`}
        >
          {uploading ? <LoaderCircle size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          <span>{uploading ? "Envoi de l’image…" : "Déposez une image ici ou cliquez pour choisir"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={maxImages > 1}
            hidden
            disabled={uploading}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => {
              if (event.target.files) void uploadFiles(event.target.files);
            }}
          />
        </div>
      )}
      {error && <p role="alert" className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
};