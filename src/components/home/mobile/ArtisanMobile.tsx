import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "../../ui/Button";
import { buildImageUrl } from "../../../bin/utils/images";

export const ArtisanMobile: FC = () => {
    return (
        <div className="block md:hidden relative w-full rounded-3xl overflow-hidden bg-lurevia-dark shadow-xl min-h-85">

            <img
                src={buildImageUrl("/images/artisant_banner.jpg")}
                alt="Artisan malgache"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            />

            <div className="absolute inset-0 bg-linear-to-b from-lurevia-dark/95 via-lurevia-dark/85 to-lurevia-dark/95 z-10" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-10">
                <MapPin className="text-white" size={200} strokeWidth={0.5} />
            </div>

            <div className="relative z-20 w-full h-full flex flex-col items-center justify-center text-center px-6 py-8 space-y-4">

                <h2 className="text-xl font-black tracking-tight leading-tight text-white uppercase">
                    Des artisans malgaches, <br />
                    <span className="text-lurevia-yellow font-serif italic font-normal tracking-wide lowercase block mt-1">
                        un savoir-faire unique.
                    </span>
                </h2>

                <p className="text-[11px] text-emerald-100/90 font-medium leading-relaxed max-w-sm">
                    Derrière chaque création, il y a une histoire et une personne. Lurevia souhaite contribuer à donner davantage de visibilité aux créateurs et producteurs malgaches grâce au numérique.
                </p>

                <div className="pt-2 select-none w-full max-w-60">
                    <Link to="/artisans" className="block w-full">
                        <Button
                            variant="secondary"
                            icon={ArrowRight}
                            iconPosition="right"
                            className="w-full justify-center px-6! py-3! rounded-full! font-bold text-xs tracking-wider transition-all shadow-md active:scale-95 bg-white text-lurevia-dark border-transparent"
                        >
                            Découvrir nos partenaires
                        </Button>
                    </Link>
                </div>
            </div>

        </div>
    );
};
