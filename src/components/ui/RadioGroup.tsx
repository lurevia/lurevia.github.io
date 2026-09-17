import type { ReactNode } from "react";

export type RadioOption<T extends string> = {
    value: T;
    label: string;
    color?: string;
    count?: number;
    disabled?: boolean;
};

type RadioGroupProps<T extends string> = {
    name: string;
    value: T;
    options: RadioOption<T>[];
    onChange: (value: T) => void;
    variant?: "default" | "capsule" | "swatch";
    orientation?: "vertical" | "horizontal";
    className?: string;
    /** Rendu custom pour une option (avancé) */
    renderOption?: (option: RadioOption<T>, active: boolean) => ReactNode;
};

export const RadioGroup = <T extends string>({
    name,
    value,
    options,
    onChange,
    variant = "default",
    orientation = "vertical",
    className = "",
    renderOption,
}: RadioGroupProps<T>) => {
    const containerClass =
        variant === "default" && orientation === "vertical"
            ? "space-y-3"
            : variant === "capsule" || variant === "swatch"
                ? "flex flex-wrap gap-2"
                : "flex flex-wrap gap-4";

    return (
        <ul role="radiogroup" className={`${containerClass} ${className}`}>
            {options.map((opt) => {
                const id = `${name}-${opt.value}`;
                const active = value === opt.value;

                if (renderOption) {
                    return (
                        <li key={opt.value}>{renderOption(opt, active)}</li>
                    );
                }

                if (variant === "default") {
                    return (
                        <li key={opt.value}>
                            <label
                                htmlFor={id}
                                className={`flex items-center gap-3 cursor-pointer text-xs font-semibold select-none ${opt.disabled
                                        ? "opacity-40 cursor-not-allowed"
                                        : active
                                            ? "text-lurevia-dark"
                                            : "text-slate-600 hover:text-lurevia-dark"
                                    }`}
                            >
                                <input
                                    id={id}
                                    type="radio"
                                    name={name}
                                    value={opt.value}
                                    checked={active}
                                    disabled={opt.disabled}
                                    onChange={() => onChange(opt.value)}
                                    className="accent-lurevia-orange h-4 w-4 cursor-pointer shrink-0"
                                />
                                <span className="flex-1">{opt.label}</span>
                                {typeof opt.count === "number" && (
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                        ({opt.count})
                                    </span>
                                )}
                            </label>
                        </li>
                    );
                }

                if (variant === "capsule") {
                    return (
                        <li key={opt.value}>
                            <button
                                type="button"
                                role="radio"
                                aria-checked={active}
                                aria-label={`${name} ${opt.label}`}
                                disabled={opt.disabled}
                                onClick={() => onChange(opt.value)}
                                className={`min-w-11 h-11 md:h-10 text-xs font-bold rounded-xl border transition-all cursor-pointer ${active
                                        ? "bg-lurevia-dark text-white border-lurevia-dark shadow-sm scale-105"
                                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 active:bg-slate-50"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        </li>
                    );
                }

                return (
                    <li key={opt.value}>
                        <button
                            type="button"
                            role="radio"
                            aria-checked={active}
                            aria-label={opt.label}
                            title={opt.label}
                            disabled={opt.disabled}
                            onClick={() => onChange(opt.value)}
                            className={`h-11 w-11 md:h-9 md:w-9 rounded-full border-2 transition-all relative cursor-pointer ${active
                                    ? "border-lurevia-orange ring-2 ring-orange-100 scale-110"
                                    : "border-slate-200 hover:border-slate-400 active:scale-95"
                                }`}
                            style={{ backgroundColor: opt.color }}
                        >
                            {active && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="w-2 h-2 bg-white rounded-full shadow-sm mix-blend-difference" />
                                </span>
                            )}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};