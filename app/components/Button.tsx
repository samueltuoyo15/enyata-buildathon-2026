import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 children: ReactNode;
 variant?: "primary" | "secondary" | "outline";
 icon?: ReactNode;
 className?: string;
}

const Button = ({
 children,
 variant = "primary",
 icon,
 className = "",
 ...props
}: ButtonProps) => {
 const baseClasses =
  "font-bold text-center transition-all px-6 py-3 rounded-brutal flex items-center justify-center gap-2";

 const variants = {
  primary:
   "bg-primary text-text-main border-brutal border-border shadow-brutal hover:bg-primary-dark hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-active disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
   "bg-secondary text-text-main border-brutal border-border shadow-brutal hover:bg-[#d8d8f6] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-active disabled:opacity-50 disabled:cursor-not-allowed",
  outline:
   "bg-transparent text-text-main border-brutal border-border hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
 };

 return (
  <button
   className={`${baseClasses} ${variants[variant]} ${className}`}
   {...props}
  >
   {icon && <span className="flex items-center justify-center">{icon}</span>}
   {children}
  </button>
 );
};

export default Button;
