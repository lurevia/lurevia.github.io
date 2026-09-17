import { forwardRef } from "react";
import type { SelectHTMLAttributes, ReactNode } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    error?: string;
    hint?: string;
    wrapperClassName?: string;
    children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            error,
            hint,
            children,
            className = "",
            wrapperClassName = "",
            id,
            ...props
        },
        ref
    ) => {
        const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;
        const hasError = Boolean(error);

        return (
            <div className={wrapperClassName}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    id={selectId}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-lurevia-orange focus:border-transparent transition-colors ${hasError ? "border-red-300 focus:ring-red-300" : "border-slate-200"
                        } ${className}`}
                    aria-invalid={hasError}
                    {...props}
                >
                    {children}
                </select>

                {error ? (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>
                ) : hint ? (
                    <p className="text-[11px] text-slate-500 mt-1">{hint}</p>
                ) : null}
            </div>
        );
    }
);

Select.displayName = "Select";