import type { FC } from "react";
import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export const QuantitySelector: FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
}) => {
  return (
    <div className="inline-flex items-center border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
        className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={16} strokeWidth={2.5} className="md:hidden" />
        <Minus size={14} strokeWidth={2.5} className="hidden md:block" />
      </button>

      <span className="w-12 h-11 md:h-10 flex items-center justify-center text-sm font-black text-slate-800 border-x border-slate-200 tabular-nums">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={16} strokeWidth={2.5} className="md:hidden" />
        <Plus size={14} strokeWidth={2.5} className="hidden md:block" />
      </button>
    </div>
  );
};