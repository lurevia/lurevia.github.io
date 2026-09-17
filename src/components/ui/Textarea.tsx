import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    hint?: string;
    wrapperClassName?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            hint,
            className = "",
            wrapperClassName = "",
            id,
            ...props
        },
        ref
    ) => {
        const textareaId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
        const hasError = Boolean(error);

        return (
            <div className={wrapperClassName}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-lurevia-orange focus:border-transparent transition-colors ${hasError ? "border-red-300 focus:ring-red-300" : "border-slate-200"
                        } ${className}`}
                    aria-invalid={hasError}
                    {...props}
                />

                {error ? (
                    <p className="text-[11px] text-red-500 mt-1 font-medium">{error}</p>
                ) : hint ? (
                    <p className="text-[11px] text-slate-500 mt-1">{hint}</p>
                ) : null}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";