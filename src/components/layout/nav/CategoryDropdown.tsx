import type { FC } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { CATEGORIES } from "../../../bin/utils/constant/constant";

type CategoryDropdownProps = {
    isOpen: boolean;
    currentPath: string;
    onClose: () => void;
};

export const CategoryDropdown: FC<CategoryDropdownProps> = ({
    isOpen,
    currentPath,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-40 animate-fadeIn"
                onClick={onClose}
                aria-hidden="true"
            />

            <div className="fixed bottom-16 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 rounded-t-3xl shadow-[0_-12px_40px_rgba(0,0,0,0.1)] p-5 pb-8 space-y-4 animate-slideUp max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <span className="text-xs font-black text-lurevia-dark uppercase tracking-wider">
                        Choisir un univers
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer"
                        className="p-1 hover:bg-slate-50 rounded-full cursor-pointer text-slate-400 hover:text-slate-800"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isCurrentRoute =
                            currentPath === `/categories/${cat.slug}`;

                        return (
                            <Link
                                key={cat.id}
                                to={`/categories/${cat.slug}`}
                                onClick={onClose}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isCurrentRoute
                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600 font-extrabold"
                                        : "bg-slate-50/50 border-slate-100 text-slate-600 hover:bg-slate-50 hover:text-lurevia-dark"
                                    }`}
                            >
                                <div
                                    className={`p-2 rounded-lg ${isCurrentRoute
                                            ? "bg-amber-500 text-white"
                                            : "bg-white text-lurevia-cyan border border-slate-100"
                                        }`}
                                >
                                    <Icon size={16} strokeWidth={2.5} />
                                </div>
                                <span className="text-[11px] font-bold tracking-wide uppercase truncate">
                                    {cat.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};