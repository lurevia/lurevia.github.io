import { useState, useEffect, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Store,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  User,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Tag,
  Check,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { usersApi } from "../api/users";
import { verificationApi } from "../api/verification";
import { sellerApi } from "../api/seller";
import { useCategories } from "../hooks/useCategories";
import { toErrorMessage } from "../api/http";

// Avatars prédéfinis d'inspiration malgache & artisanat
const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop",
];

// Bannières préconçues pour boutique d'artisanat
const PRESET_BANNERS = [
  {
    title: "Allée des Baobabs & Soleil d'Or",
    url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&auto=format&fit=crop",
  },
  {
    title: "Atelier Vannerie & Raphia",
    url: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=1200&auto=format&fit=crop",
  },
  {
    title: "Textiles & Soie Sauvage",
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop",
  },
  {
    title: "Hauts Plateaux & Nature",
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop",
  },
];

type OnboardingStep = "profile" | "role" | "seller-quiz" | "buyer-quiz" | "completed";

export const OnboardingPage: FC = () => {
  const { user, refreshUser } = useAuth();
  const { categories } = useCategories();
  const navigate = useNavigate();

  // Étape courante
  const [step, setStep] = useState<OnboardingStep>("profile");
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ─── Étape 1 : Profil & KYC ───
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "+261 34 ");
  const [age, setAge] = useState<number | "">(user?.age || 28);
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">(user?.gender || "FEMALE");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || PRESET_AVATARS[0]);
  const [cinNumber, setCinNumber] = useState("");
  const [docType, setDocType] = useState<"CIN" | "PASSEPORT" | "PERMIS">("CIN");
  const [isKycSubmitted, setIsKycSubmitted] = useState(
    user?.identityVerificationStatus === "APPROVED" ||
    user?.identityVerificationStatus === "PENDING"
  );

  // ─── Étape 3 (Vendeur) : Quiz Boutique ───
  const [sellerQuizStep, setSellerQuizStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [storeTagline, setStoreTagline] = useState("");
  const [storeBio, setStoreBio] = useState("");
  const [storeCategoryId, setStoreCategoryId] = useState("");
  const [storeCoverUrl, setStoreCoverUrl] = useState(PRESET_BANNERS[0].url);
  const [storeCity, setStoreCity] = useState("Antananarivo");
  const [deliveryDelay, setDeliveryDelay] = useState("24-48h");
  const [contractType, setContractType] = useState<"PERCENTAGE" | "MONTHLY_FIXED">("PERCENTAGE");

  // ─── Étape 3 (Acheteur) : Quiz Personnalisation ───
  const [buyerInterests, setBuyerInterests] = useState<string[]>([]);
  const [buyerPriority, setBuyerPriority] = useState<string>("handcrafted");
  const [buyerCity, setBuyerCity] = useState("Antananarivo");
  const [buyerAlerts, setBuyerAlerts] = useState(true);

  // Pré-remplir automatiquement quand l'utilisateur est disponible
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.avatarUrl) setAvatarUrl(user.avatarUrl);
      if (user.gender) setGender(user.gender);
      if (user.age) setAge(user.age);
      if (user.role === "SELLER") {
        setSelectedRole("SELLER");
      }
      if (
        user.identityVerificationStatus === "APPROVED" ||
        user.identityVerificationStatus === "PENDING"
      ) {
        setIsKycSubmitted(true);
      }
      if (!storeName && user.fullName) {
        setStoreName(`Atelier ${user.fullName.split(" ")[0]}`);
      }
    }
  }, [user]);

  // Initialisation par défaut de la catégorie de boutique
  useEffect(() => {
    if (categories && categories.length > 0 && !storeCategoryId) {
      setStoreCategoryId(categories[0].id);
    }
  }, [categories, storeCategoryId]);

  // ─────────────────────────────────────────────────────────────────────────
  // GESTION DES ACTIONS DU PROFIL (ÉTAPE 1)
  // ─────────────────────────────────────────────────────────────────────────
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!fullName.trim()) {
      setError("Veuillez renseigner votre nom complet.");
      return;
    }
    setSaving(true);
    try {
      // 1. Sauvegarder les infos personnelles
      await usersApi.updateProfile({
        fullName: fullName.trim(),
        avatarUrl: avatarUrl || undefined,
        age: typeof age === "number" ? age : undefined,
        gender,
      });

      // 2. Si un numéro CIN / document a été renseigné et pas encore soumis
      if (cinNumber.trim() && !isKycSubmitted) {
        try {
          await verificationApi.submit(cinNumber.trim());
          setIsKycSubmitted(true);
        } catch {
          // Si déjà soumis ou non bloquant, continuer
        }
      }

      await refreshUser();
      setSuccessMessage("Profil mis à jour avec élégance !");
      setTimeout(() => {
        setSuccessMessage(null);
        setStep("role");
      }, 700);
    } catch (err: any) {
      setError(toErrorMessage(err, "Erreur lors de la mise à jour du profil."));
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SOUMISSION DU FORMULAIRE VENDEUR (QUIZ ÉTAPE 3)
  // ─────────────────────────────────────────────────────────────────────────
  const handleCreateStore = async () => {
    setError(null);
    if (!storeName.trim()) {
      setError("Veuillez donner un nom à votre boutique.");
      return;
    }
    setSaving(true);
    try {
      await sellerApi.apply({
        type: contractType,
        value: 12,
        storeName: storeName.trim(),
        storeDescription: `${storeTagline ? storeTagline + " — " : ""}${storeBio || "Artisanat d'excellence et créations uniques malgaches."}`,
        storeLogoUrl: avatarUrl,
        storeCoverUrl,
        storeCategoryId: storeCategoryId || (categories?.[0]?.id ?? ""),
      });

      await refreshUser();
      setStep("completed");
    } catch (err: any) {
      // Si déjà vendeur, on passe à l'étape finale
      if (user?.role === "SELLER") {
        setStep("completed");
      } else {
        setError(toErrorMessage(err, "Impossible d'initialiser la boutique pour le moment."));
      }
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SOUMISSION DU FORMULAIRE ACHETEUR (QUIZ ÉTAPE 3)
  // ─────────────────────────────────────────────────────────────────────────
  const handleSaveBuyerPreferences = () => {
    try {
      const prefs = {
        interests: buyerInterests,
        priority: buyerPriority,
        deliveryCity: buyerCity,
        alerts: buyerAlerts,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem("lurevia_buyer_preferences", JSON.stringify(prefs));
    } catch {}
    setStep("completed");
  };

  const toggleInterest = (id: string) => {
    setBuyerInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDU VISUEL : NETFLIX-GRADE LUXURY EXPERIENCE
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-[#0c0d12] text-stone-100 flex flex-col justify-between selection:bg-orange-600 selection:text-white">
      {/* Fond d'ambiance cinématographique */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-gradient-to-br from-amber-600/15 via-orange-800/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-orange-700/10 via-yellow-900/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Barre supérieure Netflix-style */}
      <header className="relative z-20 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-stone-800/60 bg-[#0c0d12]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <span className="font-serif text-3xl font-black tracking-tight text-white flex items-center gap-2">
            Lurevia
            <span className="text-xs tracking-widest font-sans font-bold text-orange-400 uppercase px-2 py-0.5 rounded border border-orange-500/30 bg-orange-500/10">
              Expérience
            </span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400 hidden sm:inline">
            Connecté : <strong className="text-stone-200">{user?.fullName || user?.email}</strong>
          </span>
          <button
            type="button"
            onClick={() => navigate(selectedRole === "SELLER" ? "/vendeur" : "/")}
            className="text-xs font-semibold text-stone-400 hover:text-white transition px-3 py-1.5 rounded-lg border border-stone-800 hover:border-stone-700 bg-stone-900/60"
          >
            Passer à la boutique
          </button>
        </div>
      </header>

      {/* Zone de progression */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 pt-6">
        <div className="flex items-center justify-between text-xs font-medium text-stone-400 mb-2">
          <span>
            {step === "profile" && "Étape 1 sur 3 · Identité & Sécurité"}
            {step === "role" && "Étape 2 sur 3 · Choix de votre Vocation"}
            {(step === "seller-quiz" || step === "buyer-quiz") && "Étape 3 sur 3 · Personnalisation Intelligente"}
            {step === "completed" && "Configuration terminée"}
          </span>
          <span className="text-orange-400 font-bold">
            {step === "profile" && "33%"}
            {step === "role" && "66%"}
            {(step === "seller-quiz" || step === "buyer-quiz") && "90%"}
            {step === "completed" && "100%"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-stone-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 transition-all duration-700 ease-out"
            style={{
              width:
                step === "profile"
                  ? "33%"
                  : step === "role"
                  ? "66%"
                  : step === "completed"
                  ? "100%"
                  : "90%",
            }}
          />
        </div>
      </div>

      {/* Corps principal */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col justify-center">
        {/* Messages d'erreur et succès */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm flex items-center justify-between animate-fade-in">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-300 hover:text-white text-xs underline font-bold"
            >
              Fermer
            </button>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 1 : RECOLTE DES DONNÉES DU PROFIL & VÉRIFICATION KYC
            ═══════════════════════════════════════════════════════════════════ */}
        {step === "profile" && (
          <div className="bg-[#12141c]/90 border border-stone-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Sparkles size={13} /> Votre Profil Signature
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Complétez votre profil d'exception
              </h1>
              <p className="text-sm text-stone-400">
                Ces informations sécurisent vos transactions et permettent de personnaliser vos contacts sur la plateforme.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* Choix d'avatar */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                  Photo de profil & Avatar
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-stone-900/60 border border-stone-800/80">
                  <div className="relative group shrink-0">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-orange-500/50 shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Camera size={18} className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 w-full text-center sm:text-left">
                    <p className="text-xs text-stone-400">
                      Choisissez parmi les portraits signature ou saisissez une URL d'image :
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2.5">
                      {PRESET_AVATARS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(preset)}
                          className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition ${
                            avatarUrl === preset
                              ? "border-orange-500 ring-2 ring-orange-500/40 scale-105"
                              : "border-stone-700 hover:border-stone-500 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={preset} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Mahery Manantsoa"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-stone-900/90 border border-stone-700/80 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm font-medium transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Téléphone (Madagascar)
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+261 34 00 000 00"
                      className="w-full pl-10 pr-4 py-3 bg-stone-900/90 border border-stone-700/80 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm font-medium transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Âge
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                    <input
                      type="number"
                      min={16}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                      placeholder="Ex: 28"
                      className="w-full pl-10 pr-4 py-3 bg-stone-900/90 border border-stone-700/80 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm font-medium transition"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Genre
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "FEMALE", label: "Femme" },
                      { value: "MALE", label: "Homme" },
                      { value: "OTHER", label: "Autre" },
                    ].map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setGender(g.value as any)}
                        className={`py-3 rounded-xl border text-xs font-bold transition ${
                          gender === g.value
                            ? "bg-orange-600 border-orange-500 text-white shadow-md shadow-orange-600/30"
                            : "bg-stone-900/90 border-stone-800 text-stone-400 hover:text-white hover:border-stone-700"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section Vérification KYC / Identité */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-900/40 border border-stone-800/90 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Vérification d'Identité & Sécurité (KYC)
                      {isKycSubmitted && (
                        <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                          Vérification Active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Permet de valider votre compte en toute conformité pour publier des articles ou recevoir des commandes certifiées.
                    </p>
                  </div>
                </div>

                {!isKycSubmitted ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                        Type de document
                      </label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-orange-500"
                      >
                        <option value="CIN">Carte Nationale d'Identité (CIN)</option>
                        <option value="PASSEPORT">Passeport</option>
                        <option value="PERMIS">Permis de conduire</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                        Numéro de la pièce
                      </label>
                      <input
                        type="text"
                        value={cinNumber}
                        onChange={(e) => setCinNumber(e.target.value)}
                        placeholder="Ex: 101 234 567 890"
                        className="w-full px-3 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>Votre demande de vérification est enregistrée et validée.</span>
                  </div>
                )}
              </div>

              {/* Bouton de validation de l'étape 1 */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Sauvegarde en cours…" : "Continuer vers le Choix de Rôle"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 2 : CHOIX DE ROLE INTERACTIF (NETFLIX "QUI REGARDE ?")
            ═══════════════════════════════════════════════════════════════════ */}
        {step === "role" && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Étape 2 · Vocation
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Que souhaitez-vous faire sur Lurevia ?
              </h1>
              <p className="text-sm text-stone-400">
                Choisissez votre univers pour déclencher le quiz de configuration adapté.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Carte ACHETEUR */}
              <div
                onClick={() => {
                  setSelectedRole("CUSTOMER");
                  setStep("buyer-quiz");
                }}
                className={`group cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  selectedRole === "CUSTOMER"
                    ? "bg-gradient-to-b from-stone-900 to-[#141622] border-amber-500/80 shadow-2xl shadow-amber-500/20 scale-[1.02]"
                    : "bg-stone-900/60 border-stone-800 hover:border-stone-600 hover:bg-stone-900"
                }`}
              >
                <div className="space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <ShoppingBag size={32} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                      Amateur de belles pièces
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1 group-hover:text-amber-300 transition">
                      Acheteur & Découvreur
                    </h2>
                    <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                      Explorez l'artisanat malgache, commandez des créations faites main et recevez vos pièces d'exception chez vous.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0" />
                      Quiz de recommandation pour personnaliser vos goûts
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0" />
                      Accès direct aux ventes exclusives et créateurs
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-amber-400 shrink-0" />
                      Paiements sécurisés MVola, CB & livraison suivie
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-stone-800 text-stone-200 group-hover:bg-amber-500 group-hover:text-black transition flex items-center justify-center gap-2"
                  >
                    Choisir le profil Acheteur
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Carte VENDEUR */}
              <div
                onClick={() => {
                  setSelectedRole("SELLER");
                  setStep("seller-quiz");
                }}
                className={`group cursor-pointer rounded-3xl p-8 border-2 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  selectedRole === "SELLER"
                    ? "bg-gradient-to-b from-stone-900 to-[#1f1614] border-orange-500/80 shadow-2xl shadow-orange-500/20 scale-[1.02]"
                    : "bg-stone-900/60 border-stone-800 hover:border-stone-600 hover:bg-stone-900"
                }`}
              >
                <div className="space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                    <Store size={32} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold tracking-widest text-orange-400 uppercase">
                      Artisan, Créateur & Marque
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1 group-hover:text-orange-300 transition">
                      Vendeur & Boutique
                    </h2>
                    <p className="text-sm text-stone-400 mt-2 leading-relaxed">
                      Ouvrez votre boutique en ligne, exposez vos créations et vendez directement aux clients à Madagascar et dans le monde.
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-stone-300 pt-2 border-t border-stone-800">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-orange-400 shrink-0" />
                      Création de boutique guidée pas-à-pas en 2 minutes
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-orange-400 shrink-0" />
                      Gestion de stock, commandes et catalogue produits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-orange-400 shrink-0" />
                      Versements automatiques de vos ventes
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    type="button"
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-orange-600 text-white group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 transition flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30"
                  >
                    Créer ma boutique d'Artisan
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setStep("profile")}
                className="text-xs text-stone-500 hover:text-stone-300 flex items-center gap-1.5 font-medium transition"
              >
                <ArrowLeft size={14} /> Revenir à l'étape du profil
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 3-A : QUIZ INTERACTIF DE CRÉATION DE BOUTIQUE (VENDEUR)
            ═══════════════════════════════════════════════════════════════════ */}
        {step === "seller-quiz" && (
          <div className="bg-[#12141c]/90 border border-stone-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-stone-800/80 pb-4 mb-8">
              <div>
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">
                  Quiz Création Boutique · Étape {sellerQuizStep} sur 4
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {sellerQuizStep === 1 && "L'Identité de votre Atelier"}
                  {sellerQuizStep === 2 && "Votre Univers & Catégorie phare"}
                  {sellerQuizStep === 3 && "Votre Image de Marque"}
                  {sellerQuizStep === 4 && "Logistique & Engagements"}
                </h2>
              </div>

              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      s === sellerQuizStep
                        ? "w-8 bg-orange-500"
                        : s < sellerQuizStep
                        ? "w-4 bg-orange-700/60"
                        : "w-2 bg-stone-800"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sous-question 1 : Nom et Slogan */}
            {sellerQuizStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Quel est le nom de votre boutique ou marque ?
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Ex: Atelier Raphia Soavina"
                    className="w-full px-4 py-3.5 bg-stone-900 border border-stone-700 rounded-xl text-white font-medium text-base focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Votre slogan ou phrase signature
                  </label>
                  <input
                    type="text"
                    value={storeTagline}
                    onChange={(e) => setStoreTagline(e.target.value)}
                    placeholder="Ex: L'art du tressage malgache haut de gamme"
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    L'histoire de votre atelier (Bio)
                  </label>
                  <textarea
                    rows={3}
                    value={storeBio}
                    onChange={(e) => setStoreBio(e.target.value)}
                    placeholder="Décrivez vos matières premières, votre région et ce qui rend vos créations uniques..."
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Sous-question 2 : Catégorie principale */}
            {sellerQuizStep === 2 && (
              <div className="space-y-4">
                <p className="text-xs text-stone-400">
                  Sélectionnez la catégorie principale qui représente le mieux votre savoir-faire :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {(categories || []).map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setStoreCategoryId(cat.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        storeCategoryId === cat.id
                          ? "bg-orange-500/10 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                          : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Tag size={18} className={storeCategoryId === cat.id ? "text-orange-400" : "text-stone-500"} />
                        <div>
                          <p className="text-sm font-bold">{cat.name}</p>
                          <p className="text-[11px] text-stone-500 line-clamp-1">{cat.description}</p>
                        </div>
                      </div>
                      {storeCategoryId === cat.id && (
                        <Check size={18} className="text-orange-400 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sous-question 3 : Visuels de la boutique */}
            {sellerQuizStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Bannière de couverture pour votre vitrine
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRESET_BANNERS.map((b, i) => (
                      <div
                        key={i}
                        onClick={() => setStoreCoverUrl(b.url)}
                        className={`relative rounded-2xl overflow-hidden h-28 border-2 cursor-pointer transition group ${
                          storeCoverUrl === b.url
                            ? "border-orange-500 ring-2 ring-orange-500/30 scale-[1.02]"
                            : "border-stone-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={b.url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                          <span className="text-xs font-bold text-white">{b.title}</span>
                        </div>
                        {storeCoverUrl === b.url && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white p-1 rounded-full">
                            <Check size={12} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Ou collez votre propre URL de bannière :
                  </label>
                  <input
                    type="url"
                    value={storeCoverUrl}
                    onChange={(e) => setStoreCoverUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-stone-900 border border-stone-700 rounded-xl text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* Sous-question 4 : Logistique */}
            {sellerQuizStep === 4 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                      Ville de l'atelier
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                      <input
                        type="text"
                        value={storeCity}
                        onChange={(e) => setStoreCity(e.target.value)}
                        placeholder="Antananarivo, Antsirabe..."
                        className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                      Délai moyen de confection
                    </label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                      <select
                        value={deliveryDelay}
                        onChange={(e) => setDeliveryDelay(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm"
                      >
                        <option value="24-48h">24h à 48h (En stock)</option>
                        <option value="3-5j">3 à 5 jours ouvrés</option>
                        <option value="sur-commande">Sur commande (7 à 10 jours)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                    Formule de partenariat vendeur
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setContractType("PERCENTAGE")}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        contractType === "PERCENTAGE"
                          ? "bg-orange-500/15 border-orange-500 text-white shadow-md shadow-orange-500/10"
                          : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
                      }`}
                    >
                      <p className="text-xs font-bold text-white">Commission au succès (12%)</p>
                      <p className="text-[11px] text-stone-400 mt-1">Zéro abonnement fixe. Vous ne payez que si vous vendez.</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContractType("MONTHLY_FIXED")}
                      className={`p-3.5 rounded-xl border text-left transition ${
                        contractType === "MONTHLY_FIXED"
                          ? "bg-orange-500/15 border-orange-500 text-white shadow-md shadow-orange-500/10"
                          : "bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700"
                      }`}
                    >
                      <p className="text-xs font-bold text-white">Forfait Mensuel Fixe (50 000 Ar/mois)</p>
                      <p className="text-[11px] text-stone-400 mt-1">0% de commission sur vos volumes de vente.</p>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-orange-300">
                    <Sparkles size={14} /> Accord Partenaire Lurevia
                  </p>
                  <p className="text-stone-300">
                    En validant, vous acceptez le contrat standard vendeur Lurevia ({contractType === "PERCENTAGE" ? "commission standard de 12% sur les ventes réussies, aucun frais fixe" : "abonnement fixe mensuel sans commission"}), hébergement et promotion offerts.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation du Quiz */}
            <div className="flex items-center justify-between pt-8 border-t border-stone-800/80 mt-8">
              <button
                type="button"
                onClick={() => {
                  if (sellerQuizStep > 1) {
                    setSellerQuizStep((s) => s - 1);
                  } else {
                    setStep("role");
                  }
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-400 hover:text-white transition flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Précédent
              </button>

              {sellerQuizStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setSellerQuizStep((s) => s + 1)}
                  className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white transition flex items-center gap-2"
                >
                  Suivant <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCreateStore}
                  className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 text-black hover:opacity-95 transition flex items-center gap-2 shadow-xl shadow-orange-500/20"
                >
                  {saving ? "Lancement en cours…" : "Créer ma Boutique & Ouvrir l'Espace Vendeur"}
                  <Sparkles size={14} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 3-B : QUIZ DE PERSONNALISATION DU FEED (ACHETEUR)
            ═══════════════════════════════════════════════════════════════════ */}
        {step === "buyer-quiz" && (
          <div className="bg-[#12141c]/90 border border-stone-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-fade-in space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Personnalisation Netflix-Style
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Quelles créations font battre votre cœur ?
              </h2>
              <p className="text-sm text-stone-400">
                Sélectionnez vos centres d'intérêt afin d'alimenter votre page d'accueil avec les artisans qui vous correspondent.
              </p>
            </div>

            {/* Univers d'artisanat */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                Vos Univers favoris (choisissez-en 2 ou plus)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: "raphia", label: "Paniers & Raphia", icon: "🧺" },
                  { id: "soie", label: "Soie sauvage & Lin", icon: "🧵" },
                  { id: "cosmetique", label: "Huiles & Soins bio", icon: "🌿" },
                  { id: "epices", label: "Vanille & Chocolat", icon: "🍫" },
                  { id: "bijoux", label: "Bijoux & Pierres fines", icon: "💎" },
                  { id: "bois", label: "Sculpture & Décoration", icon: "🪵" },
                ].map((item) => {
                  const selected = buyerInterests.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleInterest(item.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition text-center space-y-2 ${
                        selected
                          ? "bg-amber-500/15 border-amber-500 text-white scale-[1.02] shadow-lg shadow-amber-500/10"
                          : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200"
                      }`}
                    >
                      <span className="text-3xl block">{item.icon}</span>
                      <p className="text-xs font-bold">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priorité d'achat */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                Votre priorité d'achat
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "handcrafted", label: "Pièces uniques 100% Fait-main", desc: "Savoir-faire traditionnel certifié" },
                  { id: "gifts", label: "Idées Cadeaux & Box Soignées", desc: "Pour faire plaisir avec originalité" },
                  { id: "deals", label: "Ventes Flash & Bonnes Affaires", desc: "Promotions exclusives des créateurs" },
                  { id: "eco", label: "Éco-responsable & Bio", desc: "Ingrédients durables et traçables" },
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setBuyerPriority(p.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      buyerPriority === p.id
                        ? "bg-amber-500/10 border-amber-500 text-white"
                        : "bg-stone-900/60 border-stone-800 text-stone-400 hover:border-stone-700"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{p.label}</p>
                      <p className="text-[11px] text-stone-500">{p.desc}</p>
                    </div>
                    {buyerPriority === p.id && <Check size={16} className="text-amber-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Région de livraison */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                Votre Ville de livraison principale
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-stone-500" />
                <input
                  type="text"
                  value={buyerCity}
                  onChange={(e) => setBuyerCity(e.target.value)}
                  placeholder="Antananarivo, Tamatave, Majunga..."
                  className="w-full pl-10 pr-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            {/* Alertes & Nouveautés */}
            <div
              onClick={() => setBuyerAlerts(!buyerAlerts)}
              className="p-3.5 rounded-2xl border border-stone-800 bg-stone-900/60 cursor-pointer flex items-center justify-between hover:border-stone-700 transition"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-stone-200">
                  Recevoir les sélections exclusives des artisans malgaches
                </p>
                <p className="text-[11px] text-stone-400">
                  Alertes personnalisées selon vos univers favoris et bons plans.
                </p>
              </div>
              <input
                type="checkbox"
                checked={buyerAlerts}
                onChange={(e) => setBuyerAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-800/80">
              <button
                type="button"
                onClick={() => setStep("role")}
                className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 font-bold"
              >
                <ArrowLeft size={14} /> Retour au choix de rôle
              </button>

              <button
                type="button"
                onClick={handleSaveBuyerPreferences}
                className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-black hover:opacity-95 transition flex items-center gap-2 shadow-xl shadow-amber-500/20"
              >
                Découvrir Mon Fil Personnalisé
                <Sparkles size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            PHASE 4 : CÉLÉBRATION FINALE (CONFIRMATION LUXE)
            ═══════════════════════════════════════════════════════════════════ */}
        {step === "completed" && (
          <div className="bg-[#12141c]/90 border border-stone-800/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl backdrop-blur-xl space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-500 to-amber-400 text-black flex items-center justify-center shadow-2xl shadow-orange-500/40">
              <Sparkles size={40} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">
                Félicitations, {fullName || "Cher membre"} !
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                {selectedRole === "SELLER"
                  ? `Votre vitrine artisanale « ${storeName} » est prête. Vous pouvez désormais publier vos créations et gérer vos ventes.`
                  : "Vos préférences sont enregistrées. Votre fil de recommandations personnalisées a été généré avec succès."}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              {selectedRole === "SELLER" ? (
                <button
                  type="button"
                  onClick={() => navigate("/vendeur")}
                  className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-95 transition shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  Accéder à Mon Espace Vendeur
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/boutique")}
                  className="px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:opacity-95 transition shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
                >
                  Explorer la Boutique Personnalisée
                  <ArrowRight size={14} />
                </button>
              )}

              <button
                type="button"
                onClick={() => navigate("/compte")}
                className="px-6 py-3.5 rounded-xl font-bold text-xs text-stone-400 hover:text-white border border-stone-800 hover:border-stone-700 bg-stone-900/60 transition"
              >
                Voir Mon Profil
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Pied de page discret */}
      <footer className="relative z-20 py-4 text-center text-[11px] text-stone-600 border-t border-stone-900/60">
        © {new Date().getFullYear()} Lurevia Madagascar · Artisanat d'exception & Terroir
      </footer>
    </div>
  );
};
