import { Percent, Wallet } from "lucide-react";

export type SellerContractType = "PERCENTAGE" | "MONTHLY_FIXED";

type SellerContractSelectorProps = {
  type: SellerContractType;
  value: number;
  onTypeChange: (type: SellerContractType, value: number) => void;
  onValueChange: (value: number) => void;
};

export const SellerContractSelector = ({
  type,
  value,
  onTypeChange,
  onValueChange,
}: SellerContractSelectorProps) => (
  <>
    <div>
      <p className="text-xs font-bold text-slate-500 mb-2">Type de contrat</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onTypeChange("PERCENTAGE", 10)}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-bold ${
            type === "PERCENTAGE"
              ? "border-lurevia-orange bg-orange-50"
              : "border-slate-200"
          }`}
        >
          <Percent size={20} />
          Commission (%)
        </button>
        <button
          type="button"
          onClick={() => onTypeChange("MONTHLY_FIXED", 50000)}
          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-bold ${
            type === "MONTHLY_FIXED"
              ? "border-lurevia-orange bg-orange-50"
              : "border-slate-200"
          }`}
        >
          <Wallet size={20} />
          Abonnement mensuel fixe
        </button>
      </div>
    </div>
    <label className="block text-xs font-bold text-slate-500">
      {type === "PERCENTAGE"
        ? "Pourcentage proposé (0-100)"
        : "Montant mensuel proposé (Ar)"}
      <input
        type="number"
        min={0}
        max={type === "PERCENTAGE" ? 100 : undefined}
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
      />
    </label>
  </>
);
