import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-heading text-lg font-bold">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`wobbly border-2 border-pencil bg-white px-4 py-3 font-body text-lg placeholder:text-pencil/40 focus:border-pen-blue focus:ring-2 focus:ring-pen-blue/20 focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
