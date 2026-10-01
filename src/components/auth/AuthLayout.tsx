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
    <div className="min-h-svh bg-[#f7f3ee] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden min-h-svh overflow-hidden bg-[#30231d] lg:flex">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-amber-600/20 blur-3xl" />
        <div
          className={[
            "absolute inset-0 opacity-20",
            "[background-image:radial-gradient(#f8e5d2_1px,transparent_1px)]",
            "[background-size:24px_24px]",
          ].join(" ")}
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 text-white xl:p-16">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className={[
                "inline-flex items-center gap-2 text-xs font-bold uppercase",
                "tracking-wider text-white/65 transition-colors hover:text-white",
              ].join(" ")}
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
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-orange-300">
                Lurevia · Madagascar
              </p>
              <h1 className="max-w-xl text-4xl font-black leading-[1.08] xl:text-6xl">
                L'artisanat qui raconte
                <span className="mt-2 block font-serif italic font-medium text-orange-300">
                  une histoire.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
                Découvrez des créations authentiques et les talents qui les font vivre.
              </p>
            </div>

            <ul className="space-y-3">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 text-sm text-white/85"
                >
                  <span
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center",
                      "rounded-full border border-orange-200/20 bg-orange-200/10",
                    ].join(" ")}
                  >
                    <Icon size={14} className="text-orange-300" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-wider text-white/45">
            © {new Date().getFullYear()} Lurevia — Made in Madagascar
          </p>
        </div>
      </aside>

      <main className="flex min-h-svh items-center justify-center px-4 py-8 sm:px-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-stone-900"
            >
              <ArrowLeft size={14} />
              Accueil
            </Link>
            <span className="text-xl font-black font-serif italic text-stone-900">
              Lurevia
            </span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
};