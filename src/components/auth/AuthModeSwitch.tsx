type AuthModeSwitchProps = {
  mode: "login" | "register";
  onSwitch: (mode: "login" | "register") => void;
};

export const AuthModeSwitch = ({ mode, onSwitch }: AuthModeSwitchProps) => (
  <div className="flex bg-slate-100 p-1">
    {(["login", "register"] as const).map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onSwitch(option)}
        className={[
          "flex-1 py-2 text-[11px] font-bold uppercase tracking-wider",
          "transition-colors",
          mode === option
            ? "bg-white text-slate-950 shadow-sm"
            : "text-slate-500 hover:text-slate-800",
        ].join(" ")}
      >
        {option === "login" ? "Connexion" : "Inscription"}
      </button>
    ))}
  </div>
);
