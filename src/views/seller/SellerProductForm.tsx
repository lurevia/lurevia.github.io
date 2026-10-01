import type { FormEvent } from "react";
import type { SellerProductInput } from "../../api/seller";

type SellerProductFormProps = {
  value: SellerProductInput;
  isEditing: boolean;
  onChange: (value: SellerProductInput) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  onError: (message: string) => void;
};

export const SellerProductForm = ({
  value,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  onError,
}: SellerProductFormProps) => {
  const updateTextField = (field: "title" | "sku", fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const updateNumberField = (field: "price" | "stock", fieldValue: string) => {
    onChange({ ...value, [field]: Number(fieldValue) });
  };

  const handleImageFiles = async (files: FileList | null) => {
    if (!files) return;
    try {
      const images = await Promise.all(Array.from(files).map(readImage));
      onChange({ ...value, images: [...value.images, ...images] });
    } catch {
      onError("Lecture de l'image impossible.");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 grid md:grid-cols-2 gap-3 rounded-2xl bg-white border border-slate-100 p-5"
    >
      <label className="text-xs font-bold text-slate-500">
        Titre
        <input
          required
          value={value.title}
          onChange={(event) => updateTextField("title", event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
        />
      </label>
      <label className="text-xs font-bold text-slate-500">
        SKU
        <input
          value={value.sku}
          onChange={(event) => updateTextField("sku", event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
        />
      </label>
      <label className="text-xs font-bold text-slate-500">
        Prix
        <input
          type="number"
          required
          value={value.price}
          onChange={(event) => updateNumberField("price", event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
        />
      </label>
      <label className="text-xs font-bold text-slate-500">
        Stock
        <input
          type="number"
          value={value.stock}
          onChange={(event) => updateNumberField("stock", event.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
        />
      </label>
      <label className="text-xs font-bold text-slate-500 md:col-span-2">
        Images (URL, séparées par des virgules)
        <input
          required
          value={value.images.join(",")}
          onChange={(event) =>
            onChange({
              ...value,
              images: event.target.value.split(",").map((url) => url.trim()),
            })
          }
          className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
        />
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className="mt-2 block w-full text-xs"
          onChange={(event) => void handleImageFiles(event.target.files)}
        />
      </label>
      <label className="text-xs font-bold text-slate-500 md:col-span-2">
        Catégories (IDs, séparés par des virgules)
        <input
          required
          value={value.categoryIds.join(",")}
          onChange={(event) =>
            onChange({
              ...value,
              categoryIds: event.target.value
                .split(",")
                .map((categoryId) => categoryId.trim()),
            })
          }
          className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
        />
      </label>
      <div className="md:col-span-2 flex gap-2">
        <button className="rounded-xl bg-lurevia-orange px-4 py-2 text-sm font-bold text-white">
          {isEditing ? "Enregistrer" : "Créer"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

const readImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lecture de l'image impossible."));
    reader.readAsDataURL(file);
  });
