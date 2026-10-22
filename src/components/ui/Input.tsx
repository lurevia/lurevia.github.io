import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: ReactNode;
  hint?: string;
  wrapperClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      hint,
      className = "",
      wrapperClassName = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = Boolean(error);

    return (
      <div className={wrapperClassName}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 dark:text-stone-300 mb-2 uppercase tracking-wider"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-stone-900/90 text-sm text-slate-800 dark:text-stone-100 placeholder-slate-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors ${
              hasError
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-200 dark:border-stone-700/80"
            } ${icon ? "pl-10" : ""} ${className}`}
            aria-invalid={hasError}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>

        {error ? (
          <p
            id={`${inputId}-error`}
            className="text-[11px] text-red-500 mt-1 font-medium"
          >
            {error}
          </p>
        ) : hint ? (
          <p className="text-[11px] text-slate-500 mt-1">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
