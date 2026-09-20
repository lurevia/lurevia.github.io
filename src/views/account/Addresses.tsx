import { useState } from "react";
import type { FC } from "react";
import { MapPin, Plus } from "lucide-react";
import { AddressCard } from "../../components/account/AddressCard";
import { AddressForm } from "../../components/account/AddressForm";
import { Button } from "../../components/ui/Button";
import { useAddresses } from "../../hooks/useAddresses";
import { toErrorMessage } from "../../api/http";
import type { Address, AddressInput } from "../../bin/types/addressType";


export const AddressesPage: FC = () => {
    const {
        addresses,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
        isLoading,
        error,
    } = useAddresses();

    const [editing, setEditing] = useState<Address | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const closeForm = () => {
        setEditing(null);
        setIsCreating(false);
        setFormError(null);
    };

    const handleSubmit = (data: AddressInput) => {
        void (async () => {
            setIsSubmitting(true);
            setFormError(null);
            try {
                if (editing) await updateAddress(editing.id, data);
                else await addAddress(data);
                closeForm();
            } catch (err) {
                setFormError(toErrorMessage(err, "L'adresse n'a pas pu être enregistrée."));
            } finally {
                setIsSubmitting(false);
            }
        })();
    };

    return (
        <>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
                        Mes adresses
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {addresses.length} adresse{addresses.length > 1 ? "s" : ""} enregistrée
                        {addresses.length > 1 ? "s" : ""}
                    </p>
                </div>

                {!isCreating && !editing && (
                    <Button
                        variant="primary"
                        size="sm"
                        icon={Plus}
                        onClick={() => setIsCreating(true)}
                        className="rounded-xl!"
                    >
                        Ajouter
                    </Button>
                )}
            </div>

            {(isCreating || editing) && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6">
                    <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider mb-4">
                        {editing ? "Modifier l'adresse" : "Nouvelle adresse"}
                    </h2>
                    {formError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                            <p className="text-xs font-medium text-red-600">{formError}</p>
                        </div>
                    )}
                    <AddressForm
                        initial={editing ?? undefined}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                        onCancel={closeForm}
                    />
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs font-medium text-red-600">{error}</p>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-16" role="status">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
                    <span className="sr-only">Chargement des adresses</span>
                </div>
            ) : addresses.length === 0 && !isCreating ? (
                <div className="text-center py-16 max-w-md mx-auto">
                    <div className="inline-flex p-6 bg-slate-50 rounded-full mb-5">
                        <MapPin size={40} className="text-slate-300" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-lg font-black text-lurevia-dark">
                        Aucune adresse enregistrée
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                        Ajoutez une adresse pour finaliser vos commandes plus vite.
                    </p>
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={() => setIsCreating(true)}
                        className="mt-5 rounded-full! px-6! py-3!"
                    >
                        Ajouter une adresse
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <AddressCard
                            key={addr.id}
                            address={addr}
                            onEdit={() => setEditing(addr)}
                            onDelete={() => void removeAddress(addr.id)}
                            onSetDefault={() => void setDefaultAddress(addr.id)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};