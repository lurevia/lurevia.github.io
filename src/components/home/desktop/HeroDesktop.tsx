import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroImg3 from "/images/hero/hero_3.png";
import { Button } from "../../ui/Button";

export const HeroDesktop: React.FC = () => {
    return (
        <section className="hidden md:flex relative w-full h-145 overflow-hidden items-center bg-white">
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-white via-lurevia-cyan/70 via-50% to-white transition-all duration-500" />
            </div>

            <div className="absolute top-[15%] left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none select-none z-5 flex">
                <div className="animate-marquee flex text-[5vw] font-black uppercase tracking-[0.2em] leading-none">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <span key={i} className="mr-16 text-transparent" style={{ color: "rgba(255, 255, 255, 0.5)", WebkitTextStroke: "1px rgba(12, 60, 76, 0.15)" }}>
                            BE AUTHENTIC
                        </span>
                    ))}
                </div>
            </div>

            <div className="absolute inset-0 flex items-center pointer-events-none select-none z-10 overflow-hidden pl-20">
                <div className="text-[15vw] font-black tracking-normal uppercase leading-none font-sans flex whitespace-nowrap" aria-hidden="true">
                    <span className="text-lurevia-dark">LURE</span>
                    <span className="text-lurevia-dark/20">VIA</span>
                </div>
            </div>

            <div className="absolute bottom-0 left-[0%] right-[5%] h-[92%] flex items-end justify-center z-20 pointer-events-none">
                <img src={heroImg3} alt="Collection Lurevia inspirée de l’artisanat malgache" loading="eager" fetchPriority="high" className="h-full w-auto object-contain pointer-events-auto transition-transform duration-500 hover:scale-102" />
            </div>

            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 bg-white/40 text-slate-700 flex items-center justify-center transition-all duration-300 hover:bg-slate-900 hover:text-white hover:scale-110 shadow-xs">
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" /></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-200 bg-white/40 text-slate-700 flex items-center justify-center transition-all duration-300 hover:bg-slate-900 hover:text-white hover:scale-110 shadow-xs">
                    <svg className="w-4.5 h-4.5 stroke-current fill-none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
            </div>

            <div className="relative z-30 w-full h-full flex flex-col justify-between px-20 py-12">
                <div />
                <div className="flex flex-col items-start space-y-0 max-w-xs pb-2">
                    <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                        Profitez des meilleures collections tendances importées directement chez vous. Livraison rapide et sécurisée partout à Madagascar.
                    </p>
                    <Link to="/boutique" className="relative inline-block pt-5 select-none group/btn">
                        <Button variant="primary" icon={ArrowRight} iconPosition="right" className="relative z-10 bg-slate-950! border-slate-950! hover:bg-slate-800! text-white! px-8! py-3.5! rounded-full! font-bold text-xs uppercase tracking-widest transition-all hover:scale-102 flex items-center gap-2 cursor-pointer animate-micro-shake">
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};
