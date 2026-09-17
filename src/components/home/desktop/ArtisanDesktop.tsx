import type { FC } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "../../ui/Button";

export const ArtisanDesktop: FC = () => {
    return (
        <div className="hidden md:flex relative w-full h-80 rounded-3xl overflow-hidden bg-lurevia-dark items-center border border-white/5 shadow-md">

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 opacity-15">
                <MapPin className="text-white/40" size={240} strokeWidth={0.5} />
            </div>

            <div className="relative z-20 w-full h-full flex flex-row items-center justify-between">

                <div className="w-[50%] h-full flex flex-col justify-center px-16 text-white text-left space-y-4">
                    <h2 className="text-3xl font-black tracking-tight leading-tight text-white uppercase">
                        Des artisans malgaches, <br />
                        <span className="text-lurevia-yellow font-serif italic font-normal tracking-wide lowercase -mt-1">
                            un savoir-faire unique.
                        </span>
                    </h2>

                    <p className="text-sm text-emerald-100/80 font-medium leading-relaxed max-w-md">
                        Derrière chaque création, il y a un savoir-faire, une histoire et une personne. Lurevia souhaite contribuer à donner davantage de visibilité aux créateurs et producteurs malgaches grâce au numérique.
                    </p>

                    <div className="pt-2 select-none">
                        <Link to="/artisans">
                            <Button
                                variant="secondary"
                                icon={ArrowRight}
                                iconPosition="right"
                                className="px-6! py-3! rounded-full! font-bold text-xs tracking-widest transition-all shadow-md"
                            >
                                Découvrir nos partenaires
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="w-[50%] h-full relative overflow-hidden">
                    <img
                        src="/images/artisant_banner.jpg"
                        alt="Artisan malgache travaillant le raphia"
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-lurevia-dark via-lurevia-dark/40 to-transparent" />
                </div>

            </div>
        </div>
    );
};
