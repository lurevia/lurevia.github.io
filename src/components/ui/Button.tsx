import type { ButtonHTMLAttributes, FC } from "react";
import type { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

export const Button: FC<ButtonProps> = ({
  label,
  variant = "primary",
  icon: Icon,
  iconPosition = "left",
  children,
  className = "",
  ...props
}) => {
  const baseStyle =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors";

  const variantStyle =
    variant === "primary"
      ? "bg-orange-500 text-white hover:bg-orange-600"
      : "bg-red-400 text-gray-800 hover:bg-red-500";

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon size={18} />}
      {label || children}
      {Icon && iconPosition === "right" && <Icon size={18} />}
    </button>
  );
};