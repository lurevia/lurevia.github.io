import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/Button";

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!email.includes("@")) {
      setStatus("error");
      return;
    }

    console.log("Inscription newsletter :", email);

    setStatus("success");
    setEmail("");

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = setTimeout(() => {
      setStatus("idle");
      resetTimerRef.current = null;
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          aria-label="Adresse email"
          className="flex-1 px-4 py-2 rounded-l-lg bg-emerald-900/60 text-white placeholder-emerald-200/60 border border-emerald-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          aria-label="S'inscrire à la newsletter"
          className="rounded-r-lg rounded-l-none focus-visible:ring-2 focus-visible:ring-orange-300"
        />
      </div>

      {status === "success" && (
        <p className="text-xs text-emerald-300">
          Merci ! Votre inscription est confirmée.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400">
          Veuillez saisir une adresse email valide.
        </p>
      )}
    </form>
  );
};