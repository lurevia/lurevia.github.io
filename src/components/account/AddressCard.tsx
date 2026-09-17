import type { FC } from "react";
import { MapPin, Trash2, Star, Pencil } from "lucide-react";
import type { Address } from "../../bin/types/addressType";
import { Button } from "../ui/Button";

type AddressCardProps = {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
};

export const AddressCard: FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}) => (
  <article
    className={`relative bg-white border-2 rounded-2xl p-4 transition-all ${
      address.isDefault ? "border-lurevia-orange" : "border-slate-100"
    }`}
  >
    {address.isDefault && (
      <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-black text-lurevia-orange bg-orange-50 px-2 py-0.5 rounded-full uppercase">
        <Star size={10} className="fill-lurevia-orange" />
        Par défaut
      </span>
    )}

    <div className="flex items-start gap-3">
      <div className="p-2 bg-slate-50 rounded-lg shrink-0">
        <MapPin size={16} className="text-lurevia-dark" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-slate-800 uppercase tracking-wider">
          {address.label}
        </p>
        <p className="text-sm font-bold text-slate-800 mt-1">{address.fullName}</p>
        <p className="text-xs text-slate-500 mt-0.5">{address.phone}</p>
        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          {address.address}
          <br />
          {address.city}, {address.region}
        </p>
      </div>
    </div>

    <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
      {!address.isDefault && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          icon={Star}
          onClick={onSetDefault}
          className="text-[11px]!"
        >
          Par défaut
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon={Pencil}
        onClick={onEdit}
        className="text-[11px]!"
      >
        Modifier
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        icon={Trash2}
        onClick={onDelete}
        className="text-red-500! hover:bg-red-50! text-[11px]!"
      >
        Supprimer
      </Button>
    </div>
  </article>
);