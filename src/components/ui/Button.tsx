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
    "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none";

  const variantStyle = {
    primary: "bg-orange-500 text-white hover:bg-orange-600",
    secondary: "bg-red-400 text-gray-800 hover:bg-red-500",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
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