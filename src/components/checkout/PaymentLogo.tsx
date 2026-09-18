import type { FC } from "react";
import { useState } from "react";

export type MobileMoneyProviderId = "mvola" | "orange-money" | "airtel-money";

type ProviderMeta = {
    label: string;
    /** Couleur officielle de la marque, utilisée pour le repli textuel */
    color: string;
    /** Chemin de l'asset officiel attendu dans /public/images/payment/ */
    logoSrc: string;
};

const PROVIDER_META: Record<MobileMoneyProviderId, ProviderMeta> = {
    mvola: {
        label: "MVola",
        color: "#FFCB05",
        logoSrc: "/images/payment/mvola.svg",
    },
    "orange-money": {
        label: "Orange Money",
        color: "#FF7900",
        logoSrc: "/images/payment/orange-money.svg",
    },
    "airtel-money": {
        label: "Airtel Money",
        color: "#E40000",
        logoSrc: "/images/payment/airtel-money.svg",
    },
};

type PaymentLogoProps = {
    provider: MobileMoneyProviderId;
    className?: string;
};

/**
 * PaymentLogo
 *
 * Affiche le logo officiel d'un opérateur de mobile money malgache
 * (fichier attendu dans `public/images/payment/`). Si le fichier n'est pas
 * encore présent dans le projet — par exemple avant l'intégration des
 * assets de marque fournis par l'équipe design — le composant se replie
 * automatiquement sur un badge texte fidèle à la couleur officielle de
 * l'opérateur, afin que l'interface reste toujours cohérente et lisible.
 *
 * @param provider Identifiant de l'opérateur (mvola, orange-money, airtel-money)
 * @param className Classes Tailwind additionnelles pour le conteneur
 */
export const PaymentLogo: FC<PaymentLogoProps> = ({ provider, className = "" }) => {
    const [hasError, setHasError] = useState(false);
    const meta = PROVIDER_META[provider];

    if (hasError) {
        return (
            <span
                className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-[10px] font-black text-white ${className}`}
                style={{ backgroundColor: meta.color }}
            >
                {meta.label}
            </span>
        );
    }

    return (
        <img
            src={meta.logoSrc}
            alt={meta.label}
            className={`object-contain ${className}`}
            onError={() => setHasError(true)}
        />
    );
};

export const MOBILE_MONEY_PROVIDERS: { id: MobileMoneyProviderId; label: string; color: string }[] = (
    Object.keys(PROVIDER_META) as MobileMoneyProviderId[]
).map((id) => ({ id, label: PROVIDER_META[id].label, color: PROVIDER_META[id].color }));
