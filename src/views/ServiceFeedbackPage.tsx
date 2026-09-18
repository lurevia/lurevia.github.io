import { useState } from "react";
import type { FC } from "react";
import { MessageSquarePlus, Star } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useFeedback } from "../hooks/useFeedback";
import { ServiceFeedbackForm } from "../components/feedback/ServiceFeedbackForm";
import { ServiceFeedbackList } from "../components/feedback/ServiceFeedbackList";
import { Button } from "../components/ui/Button";
import type { ServiceFeedback } from "../bin/types/feedbackType";

export const ServiceFeedbackPage: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    myFeedbacks,
    allFeedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    averageRating,
  } = useFeedback();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceFeedback | null>(null);
  const [tab, setTab] = useState<"mine" | "all">("all");

  const displayed = tab === "mine" ? myFeedbacks : allFeedbacks;

  const handleSubmit = (
    data: Omit<ServiceFeedback, "id" | "createdAt" | "updatedAt" | "userId" | "userName">
  ) => {
    if (editing) {
      updateFeedback(editing.id, data);
      setEditing(null);
    } else {
      addFeedback(data);
      setIsFormOpen(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-6">
      <header className="text-center space-y-3">
        <h1 className="text-2xl md:text-3xl font-black text-lurevia-dark">
          Votre avis compte
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Dites-nous comment améliorer votre expérience Lurevia : livraison,
          service client, site web… Vos retours sont précieux.
        </p>

        {allFeedbacks.length > 0 && (
          <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
            <Star size={14} className="fill-lurevia-yellow text-lurevia-yellow" />
            <span className="text-sm font-black text-lurevia-dark">
              {averageRating.toFixed(1)} / 5
            </span>
            <span className="text-xs text-slate-500">
              ({allFeedbacks.length} feedback{allFeedbacks.length > 1 ? "s" : ""})
            </span>
          </div>
        )}
      </header>

      {isAuthenticated && !isFormOpen && !editing && (
        <div className="text-center">
          <Button
            variant="primary"
            icon={MessageSquarePlus}
            onClick={() => setIsFormOpen(true)}
            className="rounded-full! px-6! py-3!"
          >
            Donner mon feedback
          </Button>
        </div>
      )}

      {/* Formulaire */}
      {(isFormOpen || editing) && isAuthenticated && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6">
          <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider mb-4">
            {editing ? "Modifier votre feedback" : "Nouveau feedback"}
          </h2>
          <ServiceFeedbackForm
            initial={editing ?? undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {!isAuthenticated && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center">
          <p className="text-xs font-bold text-amber-800">
            Connectez-vous pour laisser un feedback.
          </p>
        </div>
      )}

      {allFeedbacks.length > 0 && (
        <div className="flex gap-1 bg-slate-100 rounded-2xl p-1">
          {(["all", "mine"] as const).map((t) => {
            const count = t === "all" ? allFeedbacks.length : myFeedbacks.length;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                disabled={t === "mine" && !isAuthenticated}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 ${
                  tab === t
                    ? "bg-white text-lurevia-dark shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t === "all" ? "Tous les avis" : "Mes feedbacks"} ({count})
              </button>
            );
          })}
        </div>
      )}

      <ServiceFeedbackList
        feedbacks={displayed}
        currentUserId={user?.id}
        onEdit={setEditing}
        onDelete={(fb) => {
          if (window.confirm("Supprimer ce feedback ?")) deleteFeedback(fb.id);
        }}
      />
    </div>
  );
};