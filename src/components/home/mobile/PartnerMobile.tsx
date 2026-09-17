import type { FC } from "react";
import { Link } from "react-router-dom";
import { Handshake, ArrowRight } from "lucide-react";
import { Button } from "../../ui/Button";

export const PartnerMobile: FC = () => {
  return (
    <div className="block md:hidden relative w-full rounded-3xl overflow-hidden bg-lurevia-dark shadow-xl min-h-105">
      
      <img
        src="/images/baobab-sunset.jpg"
        alt="Baobabs au coucher de soleil à Madagascar"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />

      <div className="absolute inset-0 bg-linear-to-b from-lurevia-dark/95 via-lurevia-dark/75 to-slate-950/95 z-10" />

      <div className="relative z-20 w-full h-full flex flex-col items-center justify-between text-center px-5 py-8 space-y-5">
        
        <div className="inline-flex p-2.5 bg-lurevia-cyan/20 text-lurevia-cyan rounded-full shadow-xs">
          <Handshake size={20} strokeWidth={1.5} />
        </div>

        <h2 className="text-xl font-black tracking-tight leading-tight text-white uppercase">
          Vous êtes artisan <br />
          ou fournisseur ?
        </h2>

        <p className="text-[11px] text-emerald-100/90 font-medium leading-relaxed max-w-xs">
          Vous créez, fabriquez ou distribuez des produits intéressants à Madagascar ? Lurevia recherche actuellement des partenaires pour enrichir sa sélection.
        </p>

        <p className="text-white text-xs font-bold uppercase tracking-wider leading-snug">
          Ensemble, valorisons le <br />
          <span className="text-lurevia-yellow font-serif italic font-normal tracking-wide lowercase">
            savoir-faire malgache
          </span>
        </p>

        <div className="pt-2 select-none w-full max-w-60">
          <Link to="/partenaires" className="block w-full">
            <Button
              variant="secondary"
              icon={ArrowRight}
              iconPosition="right"
              className="w-full justify-center px-6! py-3! rounded-full! font-bold text-xs tracking-wider transition-all shadow-md active:scale-95 bg-white text-lurevia-dark border-transparent"
            >
              Devenir partenaire
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
};
