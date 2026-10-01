import type { Dispatch, SetStateAction } from "react";
import { Calendar, Mail, Phone, Save, User as UserIcon } from "lucide-react";
import type { User } from "../../bin/types/authType";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

type ProfilePersonalInfoProps = {
  user: User;
  fullName: string;
  setFullName: Dispatch<SetStateAction<string>>;
  age: number | undefined;
  setAge: Dispatch<SetStateAction<number | undefined>>;
  gender: User["gender"];
  setGender: Dispatch<SetStateAction<User["gender"]>>;
  isSaving: boolean;
  saved: boolean;
  error: string | null;
  onSave: () => void;
};

export const ProfilePersonalInfo = ({
  user,
  fullName,
  setFullName,
  age,
  setAge,
  gender,
  setGender,
  isSaving,
  saved,
  error,
  onSave,
}: ProfilePersonalInfoProps) => (
  <section className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
    <h2 className="text-sm font-black text-lurevia-dark uppercase tracking-wider">
      Informations personnelles
    </h2>
    <Input
      label="Nom complet"
      value={fullName}
      onChange={(event) => setFullName(event.target.value)}
      icon={<UserIcon size={16} />}
      autoComplete="name"
      maxLength={120}
    />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input
        label="Âge"
        type="number"
        value={age ?? ""}
        onChange={(event) =>
          setAge(parseInt(event.target.value, 10) || undefined)
        }
        icon={<Calendar size={16} />}
        placeholder="Ex: 25"
        min={0}
        max={120}
      />
      <div className="flex flex-col gap-2">
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
          Genre
        </label>
        <Select
          value={gender}
          onChange={(event) => setGender(event.target.value as User["gender"])}
        >
          <option value="MALE">Homme</option>
          <option value="FEMALE">Femme</option>
          <option value="OTHER">Autre</option>
        </Select>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input
        label="Email"
        type="email"
        value={user.email ?? "— non renseigné —"}
        readOnly
        disabled
        icon={<Mail size={16} />}
      />
      <Input
        label="Téléphone"
        type="tel"
        value={user.phone ?? "— non renseigné —"}
        readOnly
        disabled
        icon={<Phone size={16} />}
      />
    </div>
    <p className="text-[11px] text-slate-500">
      L'email et le téléphone servent d'identifiants de connexion. Leur
      modification se fait sur demande auprès du service client, après
      vérification d'identité.
    </p>
    {error && (
      <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
        <p className="text-xs font-medium text-red-600">{error}</p>
      </div>
    )}
    {saved && (
      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-xs font-medium text-amber-800">
          Votre modification a été envoyée et reste en attente d’approbation par
          notre équipe.
        </p>
      </div>
    )}
    <div className="flex items-center justify-between gap-3 pt-2 flex-wrap">
      <p className="text-[11px] text-slate-500">
        Membre depuis{" "}
        {new Date(user.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <Button
        type="button"
        variant="primary"
        icon={Save}
        onClick={onSave}
        disabled={isSaving}
        className="rounded-xl!"
      >
        {saved ? "Enregistré" : "Enregistrer"}
      </Button>
    </div>
  </section>
);
