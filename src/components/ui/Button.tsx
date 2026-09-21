import type { ButtonHTMLAttributes, FC } from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  round?: boolean;
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button: FC<ButtonProps> = ({
  label,
  variant = "primary",
  icon: Icon,
  iconPosition = "left",
  round = false,
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none";

  const variantStyle = {
    primary:
      "bg-linear-to-b from-lurevia-blue-500 to-lurevia-blue-600 text-white shadow-[0_8px_24px_-6px_rgba(47,123,246,0.55)] hover:from-lurevia-blue-400 hover:to-lurevia-blue-500 hover:shadow-[0_10px_28px_-6px_rgba(47,123,246,0.65)] active:scale-[0.98]",
    secondary:
      "glass text-lurevia-blue-700 hover:bg-white/80 border-lurevia-blue-100!",
    ghost: "bg-transparent text-slate-700 hover:bg-lurevia-blue-50",
  }[variant];

  const sizeStyle = {
    sm: "text-xs px-3 py-1.5 rounded-lg",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-5 py-2.5 rounded-xl",
    icon: "p-2 rounded-full",
  }[size];

  const roundStyle = round ? "rounded-full" : "";

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${roundStyle} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={18} />}
      {label || children}
      {Icon && iconPosition === "right" && <Icon size={18} />}
    </button>
  );
};