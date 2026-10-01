import { useState } from "react";
import type { FC } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import type { ShippingAddress } from "../../bin/types/checkoutType";
import type { Address } from "../../bin/types/addressType";
import { SavedAddressSelector } from "./SavedAddressSelector";

type ShippingFormProps = {
    value: ShippingAddress;
    errors: Partial<Record<keyof ShippingAddress, string>>;
    onChange: (field: keyof ShippingAddress, value: string) => void;
    onClearSaved?: () => void;
    /** Adresses enregistrées sur le compte de l'utilisateur connecté */
    savedAddresses?: Address[];
    /** Auto-complète instantanément le formulaire avec l'adresse choisie */
    onUseSavedAddress?: (address: Address) => void;
};

const REGIONS = [
    "Antananarivo",
    "Antsirabe",
    "Toamasina",
    "Mahajanga",
    "Fianarantsoa",
    "Toliara",
    "Antsiranana",
    "Autre",
];

/**
 * ShippingForm
 *
 * Formulaire de saisie de l'adresse de livraison. Purement présentationnel :
 * l'état, la validation et la persistance sont pilotés par le hook
 * contrôleur `useCheckout`. Lorsque l'utilisateur possède au moins une
 * adresse enregistrée (`savedAddresses`), un sélecteur dédié permet de
 * remplir instantanément tous les champs du formulaire en un clic
 * ("Utiliser mon adresse enregistrée").
 */
export const ShippingForm: FC<ShippingFormProps> = ({
    value,
    errors,
    onChange,
    onClearSaved,
    savedAddresses = [],
    onUseSavedAddress,
}) => {
    const [confirming, setConfirming] = useState(false);

    const handleClearClick = () => {
        if (confirming) {
            onClearSaved?.();
            setConfirming(false);
        } else {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 4000);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
                    Adresse de livraison
                </h3>

                {onClearSaved && (
                    <div className="flex items-center gap-2">
                        {confirming && (
                            <span className="text-[11px] font-bold text-slate-500">Sûr ?</span>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={RotateCcw}
                            onClick={handleClearClick}
                            className={
                                confirming
                                    ? "text-red-500! bg-red-50! hover:bg-red-100! text-[11px]!"
                                    : "text-slate-400! hover:text-red-500! hover:bg-red-50! text-[11px]!"
                            }
                        >
                            {confirming ? "Confirmer" : "Effacer mes infos"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Adresses enregistrées */}
            {savedAddresses.length > 0 && onUseSavedAddress && (
                <SavedAddressSelector
                    addresses={savedAddresses}
                    onSelect={onUseSavedAddress}
                />
            )}

            {/* Formulaire */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                    label="Nom complet"
                    value={value.fullName}
                    error={errors.fullName}
                    onChange={(e) => onChange("fullName", e.target.value)}
                    placeholder="Rasoa Miora"
                    autoComplete="name"
                />
                <Input
                    label="Téléphone"
                    type="tel"
                    value={value.phone}
                    error={errors.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    placeholder="034 12 345 67"
                    autoComplete="tel"
                />
            </div>

            <Input
                label="Email (optionnel)"
                type="email"
                value={value.email}
                error={errors.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="rasoa@email.mg"
                autoComplete="email"
            />

            <Input
                label="Adresse"
                value={value.address}
                error={errors.address}
                onChange={(e) => onChange("address", e.target.value)}
                placeholder="Lot II M 45 Bis, Ankadifotsy"
                autoComplete="street-address"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                    label="Ville"
                    value={value.city}
                    error={errors.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    placeholder="Antananarivo"
                    autoComplete="address-level2"
                />

                <Select
                    label="Région"
                    value={value.region}
                    error={errors.region}
                    onChange={(e) => onChange("region", e.target.value)}
                >
                    <option value="">Choisir…</option>
                    {REGIONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </Select>
            </div>

            <Textarea
                label="Instructions (optionnel)"
                value={value.notes}
                onChange={(e) => onChange("notes", e.target.value)}
                placeholder="Ex : Appelez avant de passer, portail bleu…"
                rows={2}
            />
        </div>
    );
};