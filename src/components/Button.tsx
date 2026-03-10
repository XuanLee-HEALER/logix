import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "wobbly font-body text-lg md:text-2xl px-6 py-3 border-[3px] border-pencil cursor-pointer transition-all duration-100 min-h-12";

  const variants = {
    primary:
      "bg-white text-pencil shadow-sketch hover:bg-marker-red hover:text-white hover:shadow-sketch-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
    secondary:
      "bg-erased text-pencil shadow-sketch hover:bg-pen-blue hover:text-white hover:shadow-sketch-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
