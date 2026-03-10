import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  decoration?: "tape" | "tack" | "none";
  className?: string;
  postit?: boolean;
}

export function Card({
  children,
  decoration = "none",
  className = "",
  postit = false,
}: CardProps) {
  const bg = postit ? "bg-postit" : "bg-white";

  return (
    <div
      className={`wobbly-md relative border-2 border-pencil p-6 shadow-sketch-subtle transition-transform duration-100 hover:rotate-1 ${bg} ${className}`}
    >
      {decoration === "tape" && <TapeDecoration />}
      {decoration === "tack" && <TackDecoration />}
      {children}
    </div>
  );
}

function TapeDecoration() {
  return (
    <div
      className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-pencil/10"
      style={{ borderRadius: "2px" }}
    />
  );
}

function TackDecoration() {
  return (
    <div className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-pencil bg-marker-red shadow-sketch-sm" />
  );
}
