import type { FormEvent } from "react";
import type { SellerProductInput } from "../../api/seller";
import { ImageDropzone } from "../../components/common/ImageDropzone";

type SellerProductFormProps = {
  value: SellerProductInput;
  isEditing: boolean;
  onChange: (value: SellerProductInput) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
  storeCategoryName: string;
};

export const SellerProductForm = ({
  value,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  storeCategoryName,
}: SellerProductFormProps) => {
  const updateTextField = (field: "title" | "sku", fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const updateNumberField = (field: "price" | "stock", fieldValue: string) => {
    onChange({ ...value, [field]: Number(fieldValue) });
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
      <div className="md:col-span-2">
        <ImageDropzone
          images={value.images}
          onChange={(images) => onChange({ ...value, images })}
          label="Images du produit"
          maxImages={8}
        />
      </div>
      <p className="md:col-span-2 text-xs font-semibold text-slate-500">
        Catégorie de la boutique : {storeCategoryName}
      </p>
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

