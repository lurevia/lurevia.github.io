import { Plus } from "lucide-react";
import type { FormEvent } from "react";
import type { SellerProductInput } from "../../api/seller";
import type { Product } from "../../bin/types/homeType";
import { SellerProductForm } from "./SellerProductForm";
import { SellerProductList } from "./SellerProductList";
import { EMPTY_SELLER_PRODUCT } from "./sellerDisplay";

type SellerProductsPanelProps = {
  products: Product[];
  form: SellerProductInput | null;
  editingId: string | null;
  onFormChange: (value: SellerProductInput | null) => void;
  onEditingChange: (productId: string | null) => void;
  onSave: (event: FormEvent) => void;
  onEdit: (product: Product) => void;
  onRemove: (productId: string) => void;
  onError: (message: string) => void;
};

export const SellerProductsPanel = ({
  products,
  form,
  editingId,
  onFormChange,
  onEditingChange,
  onSave,
  onEdit,
  onRemove,
  onError,
}: SellerProductsPanelProps) => (
  <>
    <div className="flex justify-end mb-4">
      <button
        type="button"
        onClick={() => {
          onFormChange(EMPTY_SELLER_PRODUCT);
          onEditingChange(null);
        }}
        className="flex items-center gap-2 rounded-xl bg-lurevia-dark px-4 py-2.5 text-sm font-bold text-white"
      >
        <Plus size={16} />
        Nouveau produit
      </button>
    </div>
    {form && (
      <SellerProductForm
        value={form}
        isEditing={editingId !== null}
        onChange={(value) => onFormChange(value)}
        onSubmit={onSave}
        onCancel={() => onFormChange(null)}
        onError={onError}
      />
    )}
    <SellerProductList
      products={products}
      onEdit={onEdit}
      onRemove={onRemove}
    />
  </>
);
