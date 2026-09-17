
export type CheckboxOption<T extends string> = {
    value: T;
    label: string;
    count?: number;
    disabled?: boolean;
};

type CheckboxGroupProps<T extends string> = {
    name: string;
    values: T[];
    options: CheckboxOption<T>[];
    onChange: (values: T[]) => void;
    className?: string;
};

export const CheckboxGroup = <T extends string>({
    name,
    values,
    options,
    onChange,
    className = "",
}: CheckboxGroupProps<T>) => {
    const toggle = (value: T) => {
        const next = values.includes(value)
            ? values.filter((v) => v !== value)
            : [...values, value];
        onChange(next);
    };

    return (
        <ul role="group" className={`space-y-3 ${className}`}>
            {options.map((opt) => {
                const id = `${name}-${opt.value}`;
                const checked = values.includes(opt.value);

                return (
                    <li key={opt.value}>
                        <label
                            htmlFor={id}
                            className={`flex items-center gap-3 text-xs font-semibold select-none transition-colors ${opt.disabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : checked
                                        ? "text-lurevia-dark cursor-pointer"
                                        : "text-slate-600 hover:text-lurevia-dark cursor-pointer"
                                }`}
                        >
                            <input
                                id={id}
                                type="checkbox"
                                checked={checked}
                                disabled={opt.disabled}
                                onChange={() => toggle(opt.value)}
                                className="rounded border-slate-300 text-lurevia-orange focus:ring-lurevia-orange h-4 w-4 cursor-pointer shrink-0"
                            />
                            <span className="flex-1 truncate">{opt.label}</span>
                            {typeof opt.count === "number" && (
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full shrink-0">
                                    ({opt.count})
                                </span>
                            )}
                        </label>
                    </li>
                );
            })}
        </ul>
    );
};