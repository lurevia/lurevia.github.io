import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, Sparkles } from "lucide-react";

type AuthLayoutProps = {
  children: ReactNode;
};

const FEATURES = [
  { icon: ShoppingBag, label: "Produits artisanaux sélectionnés" },
  { icon: Truck, label: "Livraison partout à Madagascar" },
  { icon: ShieldCheck, label: "Paiement 100 % sécurisé" },
  { icon: Sparkles, label: "Savoir-faire authentique" },
];

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-svh flex flex-col lg:flex-row bg-slate-50">
      <aside className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-linear-to-br from-lurevia-dark via-lurevia-blue-700 to-lurevia-cyan">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-lurevia-cyan/20 blur-3xl" />

        {/* Contenu */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 text-white w-full">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Accueil
            </Link>

            <span className="text-2xl font-black font-serif italic">
              Lurevia
            </span>
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-lurevia-cyan mb-4">
                Be Authentic
              </p>
              <h1 className="text-4xl xl:text-5xl font-black leading-tight">
                L'authenticité <br />
                malgache à <br />
                <span className="text-lurevia-cyan">portée de main.</span>
              </h1>
              <p className="text-sm text-white/70 mt-5 max-w-md leading-relaxed">
                Rejoignez la communauté Lurevia et découvrez le meilleur du
                savoir-faire de la Grande Île.
              </p>
            </div>

            <ul className="space-y-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm text-white/85"
                >
                  <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-lurevia-cyan" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[10px] text-white/50 tracking-wider uppercase font-bold">
            © 2026 Lurevia — Made in Madagascar 🇲🇬
          </p>
        </div>
      </aside>

      <main className="flex-1 flex items-center justify-center px-4 py-6 lg:py-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700"
            >
              <ArrowLeft size={14} />
              Accueil
            </Link>
            <span className="text-xl font-black font-serif italic text-lurevia-dark">
              Lurevia
            </span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};