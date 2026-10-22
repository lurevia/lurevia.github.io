type AuthModeSwitchProps = {
  mode: "login" | "register";
  onSwitch: (mode: "login" | "register") => void;
};

export const AuthModeSwitch = ({ mode, onSwitch }: AuthModeSwitchProps) => (
  <div className="flex rounded-xl bg-stone-800/90 p-1 border border-stone-700/60">
    {(["login", "register"] as const).map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onSwitch(option)}
        className={[
          "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer",
          mode === option
            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
            : "text-stone-400 hover:text-white",
        ].join(" ")}
      >
        {option === "login" ? "Connexion" : "Inscription"}
      </button>
    ))}
  </div>
);
