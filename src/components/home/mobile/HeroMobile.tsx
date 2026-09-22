import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/Button";
import { SLIDES } from "../../../bin/utils/constant/constant";
import { buildImageUrl } from "../../../bin/utils/images";


type HeroMobileProps = {
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
};

export const HeroMobile: React.FC<HeroMobileProps> = ({ currentSlide, setCurrentSlide }) => {
  const activeSlide = SLIDES[currentSlide];

  return (
    <section className="block md:hidden w-full px-2 pt-8 relative overflow-visible">
      <div className={`relative w-full h-56 rounded-2xl transition-colors duration-750 ease-in-out ${activeSlide.bgClass}`}>
        
        <div className="flex h-full w-full items-center justify-between px-5 relative">
          <div className="flex flex-col items-start w-[52%] space-y-1 shrink-0 z-20">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-snug">
              {activeSlide.title}
            </h1>
            <p className="text-xs font-bold text-lurevia-orange tracking-wide">
              {activeSlide.discount}
            </p>
            
            <Link to="/boutique" className="pt-2 block">
              <Button
                variant="primary"
                className="bg-slate-950! border-slate-950! text-white! text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                Shop Now
              </Button>
            </Link>
          </div>

          <div className="absolute -top-8 right-2 w-[46%] h-[calc(100%+2rem)] flex items-end justify-center z-10 overflow-visible pointer-events-none">
            <img
              src={buildImageUrl(activeSlide.image)}
              alt={activeSlide.title}
              loading="eager"
              className="h-full w-full object-contain object-bottom select-none transition-all duration-700 ease-out animate-[fadeInRight_0.6s_ease-out] overflow-visible"
              key={currentSlide}
            />
          </div>
        </div>

        <div className="absolute bottom-3 left-5 flex gap-1.5 z-20">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-4 bg-slate-900" : "w-1.5 bg-slate-400/40"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
