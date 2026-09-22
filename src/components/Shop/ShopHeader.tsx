import type { FC } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { buildImageUrl } from "../../bin/utils/images";

type ShopHeaderProps = {
    title: string;
    description: string;
    productCount: number;
    imageUrl: string;
    breadcrumb: { label: string; to?: string }[];
};

export const ShopHeader: FC<ShopHeaderProps> = ({
    title,
    description,
    productCount,
    imageUrl,
    breadcrumb,
}) => {
    return (
        <section className="w-full bg-lurevia-dark rounded-3xl overflow-hidden relative min-h-55 md:h-64 flex items-center shadow-lg group">

            <img
                src={buildImageUrl(imageUrl)}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center scale-101 transition-transform duration-700 group-hover:scale-100 pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/70 to-transparent z-10" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent z-10" />

            <div className="p-6 md:p-12 max-w-xl space-y-2 md:space-y-3 z-20 relative text-left">

                <nav aria-label="Fil d'Ariane" className="select-none">
                    <ol className="flex flex-wrap items-center gap-1 text-[10px] md:text-xs font-bold text-slate-300/90 uppercase tracking-widest">
                        {breadcrumb.map((item, index) => (
                            <li key={item.label} className="flex items-center gap-1">
                                {item.to ? (
                                    <Link
                                        to={item.to}
                                        className="hover:text-lurevia-yellow transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="text-lurevia-yellow font-black">{item.label}</span>
                                )}
                                {index < breadcrumb.length - 1 && (
                                    <ChevronRight size={12} className="text-slate-400 stroke-[2.5]" />
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>

                <h1 className="text-xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-xs">
                    {title}
                </h1>

                <p className="text-[11px] md:text-sm font-medium text-emerald-100/80 leading-relaxed line-clamp-3 md:line-clamp-none drop-shadow-xs">
                    {description}
                </p>

                <div className="pt-1">
                    <span className="inline-block bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] md:text-xs font-bold px-4 py-1.5 rounded-full shadow-xs">
                        {productCount} produit{productCount > 1 ? "s" : ""}
                    </span>
                </div>
            </div>

        </section>
    );
};
