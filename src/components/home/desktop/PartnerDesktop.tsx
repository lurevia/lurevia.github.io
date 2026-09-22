import type { FC } from "react";
import { Link } from "react-router-dom";
import { Handshake, ArrowRight } from "lucide-react";
import { Button } from "../../ui/Button";
import { buildImageUrl } from "../../../bin/utils/images";

export const PartnerDesktop: FC = () => {
  return (
    <div className="hidden md:flex relative w-full h-80 md:h-90 rounded-3xl overflow-hidden bg-lurevia-dark items-center border border-white/5 shadow-xl group">
      
      <img
        src={buildImageUrl("/images/baobab-sunset.jpg")}
        alt="Baobabs au coucher de soleil à Madagascar"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center scale-102 transition-transform duration-700 group-hover:scale-100"
      />

      <div className="absolute inset-0 bg-linear-to-r from-lurevia-dark via-lurevia-dark/80 to-transparent z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent z-10" />

      <div className="relative z-20 w-full h-full flex flex-row items-center justify-between px-16 py-8">
        
        <div className="w-[60%] flex flex-col justify-center items-start text-left space-y-4">
          
          <div className="inline-flex p-2.5 bg-lurevia-cyan/10 text-lurevia-cyan rounded-full">
            <Handshake size={20} strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-white uppercase">
            Vous êtes artisan <br className="hidden sm:inline" />
            ou fournisseur ?
          </h2>

          <p className="text-sm text-emerald-100/80 font-medium leading-relaxed max-w-lg">
            Vous créez, fabriquez ou distribuez des produits intéressants à Madagascar ? Lurevia recherche actuellement des partenaires pour enrichir sa sélection.
          </p>

          <div className="pt-1 select-none">
            <Link to="/partenaires">
              <Button
                variant="secondary"
                icon={ArrowRight}
                iconPosition="right"
                className="px-6! py-3! rounded-full! font-bold text-xs tracking-widest transition-all shadow-md"
              >
                Devenir partenaire
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-[35%] h-full flex items-end justify-end pb-2">
          <p className="text-white md:text-base font-bold uppercase tracking-wider leading-snug text-right max-w-xs drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Ensemble, valorisons le <br />
            <span className="text-lurevia-yellow font-serif italic font-normal tracking-wide lowercase">
              savoir-faire malgache
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};
