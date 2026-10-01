import { useState } from "react";
import { MapPinCheck } from "lucide-react";
import type { Address } from "../../bin/types/addressType";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

type SavedAddressSelectorProps = {
  addresses: Address[];
  onSelect: (address: Address) => void;
};

export const SavedAddressSelector = ({
  addresses,
  onSelect,
}: SavedAddressSelectorProps) => {
  const defaultAddress =
    addresses.find((address) => address.isDefault) ?? addresses[0];
  const [selectedId, setSelectedId] = useState(defaultAddress?.id ?? "");

  const handleSelect = () => {
    const selectedAddress =
      addresses.find((address) => address.id === selectedId) ?? defaultAddress;
    if (selectedAddress) onSelect(selectedAddress);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 p-3 bg-orange-50/60 border border-orange-100 rounded-xl">
      {addresses.length > 1 ? (
        <Select
          label="Adresse enregistrée"
          value={selectedId}
          onChange={(event) => setSelectedId(event.target.value)}
          wrapperClassName="flex-1"
        >
          {addresses.map((address) => (
            <option key={address.id} value={address.id}>
              {address.label} — {address.city}
              {address.isDefault ? " (par défaut)" : ""}
            </option>
          ))}
        </Select>
      ) : (
        <p className="flex-1 text-xs font-medium text-slate-600 self-center">
          Adresse enregistrée disponible :{" "}
          <span className="font-bold text-lurevia-dark">
            {defaultAddress?.label} — {defaultAddress?.city}
          </span>
        </p>
      )}
      <Button
        type="button"
        variant="primary"
        size="sm"
        icon={MapPinCheck}
        onClick={handleSelect}
        className="shrink-0 font-bold"
      >
        Utiliser mon adresse enregistrée
      </Button>
    </div>
  );
};
