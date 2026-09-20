import { useState } from "react";
import type { FC, FormEvent } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import type { Address } from "../../bin/types/addressType";

type AddressFormProps = {
    initial?: Address;
    isSubmitting?: boolean;
    onSubmit: (data: Omit<Address, "id" | "userId" | "createdAt">) => void;
    onCancel: () => void;
};

const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidMalagasyPhone = (phone: string): boolean =>
    /^(\+261|0)[0-9]{9}$/.test(phone.replace(/\s/g, ""));

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

export const AddressForm: FC<AddressFormProps> = ({
    initial,
    isSubmitting = false,
    onSubmit,
    onCancel,
}) => {
    const [label, setLabel] = useState(initial?.label ?? "Domicile");
    const [fullName, setFullName] = useState(initial?.fullName ?? "");
    const [phone, setPhone] = useState(initial?.phone ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [address, setAddress] = useState(initial?.address ?? "");
    const [city, setCity] = useState(initial?.city ?? "");
    const [region, setRegion] = useState(initial?.region ?? "");
    const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (fullName.trim().length < 2) next.fullName = "Requis";
        if (!phone.trim()) next.phone = "Requis";
        else if (!isValidMalagasyPhone(phone)) next.phone = "Numéro invalide";
        if (!email.trim()) next.email = "Requis";
        else if (!isValidEmail(email)) next.email = "Email invalide";
        if (!address.trim()) next.address = "Requis";
        if (!city.trim()) next.city = "Requis";
        if (!region.trim()) next.region = "Requis";
        setErrors(next);
        if (Object.keys(next).length > 0) return;

        onSubmit({
            label,
            fullName,
            phone,
            email: email.trim().toLowerCase(),
            address,
            city,
            region,
            notes: initial?.notes ?? "",
            isDefault,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    Libellé
                </label>
                <div className="flex gap-2">
                    {["Domicile", "Bureau", "Autre"].map((l) => (
                        <button
                            key={l}
                            type="button"
                            onClick={() => setLabel(l)}
                            className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-colors cursor-pointer ${label === l
                                    ? "border-lurevia-orange bg-orange-50 text-lurevia-dark"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                    label="Nom complet"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={errors.fullName}
                    placeholder="Rasoa Miora"
                />
                <Input
                    label="Téléphone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                    placeholder="034 12 345 67"
                />
            </div>

            <Input
                label="Email de contact"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="contact@exemple.mg"
                autoComplete="email"
            />

            <Input
                label="Adresse"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={errors.address}
                placeholder="Lot II M 45 Bis, Ankadifotsy"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                    label="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    error={errors.city}
                    placeholder="Antananarivo"
                />
                <Select
                    label="Région"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    error={errors.region}
                >
                    <option value="">Choisir…</option>
                    {REGIONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </Select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="rounded border-slate-300 text-lurevia-orange focus:ring-lurevia-orange h-4 w-4"
                />
                Définir comme adresse par défaut
            </label>

            <div className="flex gap-2 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1! border border-slate-200!"
                >
                    Annuler
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="flex-1!"
                >
                    {isSubmitting ? "Enregistrement…" : initial ? "Modifier" : "Ajouter"}
                </Button>
            </div>
        </form>
    );
};