import { useEffect, useRef, useState } from "react";
import type { FC, FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { newsletterApi } from "../../api/newsletter";
import { toErrorMessage } from "../../api/http";

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const NewsletterForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    },
    []
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus("error");
      setMessage("Veuillez saisir une adresse email valide.");
      return;
    }

    void (async () => {
      setStatus("loading");
      try {
        await newsletterApi.subscribe(email);
        setStatus("success");
        setMessage("Merci ! Votre inscription est confirmée.");
        setEmail("");

        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        resetTimerRef.current = setTimeout(() => {
          setStatus("idle");
          setMessage("");
          resetTimerRef.current = null;
        }, 4000);
      } catch (error) {
        setStatus("error");
        setMessage(toErrorMessage(error, "Inscription impossible pour le moment."));
      }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          aria-label="Adresse email"
          autoComplete="email"
          maxLength={150}
          wrapperClassName="flex-1"
          className="rounded-l-lg! rounded-r-none! bg-emerald-900/60! text-white! placeholder-emerald-200/60! border-emerald-800! focus:ring-orange-400!"
        />
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          disabled={status === "loading"}
          aria-label="S'inscrire à la newsletter"
          className="rounded-r-lg rounded-l-none focus-visible:ring-2 focus-visible:ring-orange-300"
        />
      </div>

      {status === "success" && <p className="text-xs text-emerald-300">{message}</p>}
      {status === "error" && <p className="text-xs text-red-400">{message}</p>}
    </form>
  );
};
