import { Link } from "react-router-dom";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { ContentPage } from "./ContentPage";
import { useBrandSettings } from "../context/BrandSettingsContext";

const contactCardClass = [
  "flex items-center gap-4 rounded-2xl border border-stone-200",
  "bg-white p-5 text-stone-800 transition hover:border-orange-300",
].join(" ");

export const ContactPage = () => {
  const { contactEmail, contactPhone } = useBrandSettings();

  return (
    <>
      <ContentPage slug="contact" />
      <section className="mx-auto mb-12 grid max-w-4xl gap-4 px-6 sm:grid-cols-2">
        {contactEmail && (
          <a
            href={`mailto:${contactEmail}`}
            className={contactCardClass}
          >
            <Mail className="text-lurevia-orange" />
            <span>{contactEmail}</span>
          </a>
        )}
        {contactPhone && (
          <a
            href={`tel:${contactPhone}`}
            className={contactCardClass}
          >
            <Phone className="text-lurevia-orange" />
            <span>{contactPhone}</span>
          </a>
        )}
        <Link
          to="/feedback"
          className={`${contactCardClass} sm:col-span-2`}
        >
          <MessageCircle className="text-lurevia-orange" />
          <span>Écrire au service client</span>
        </Link>
      </section>
    </>
  );
};
