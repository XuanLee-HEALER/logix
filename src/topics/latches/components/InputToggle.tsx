import { Overlined } from "@/lib/Overlined";

interface InputToggleProps {
  label: string;
  value: number;
  onToggle: () => void;
}

export function InputToggle({ label, value, onToggle }: InputToggleProps) {
  const isOn = value === 1;

  return (
    <button
      onClick={onToggle}
      className={`wobbly border-[3px] px-5 py-2.5 font-heading text-xl font-bold transition-all duration-150 hover:rotate-2 active:scale-95 active:translate-y-1 ${
        isOn
          ? "border-pen-blue bg-pen-blue text-white shadow-sketch-sm hover:-rotate-2"
          : "border-pencil/40 bg-white text-pencil/60 shadow-sketch"
      }`}
    >
      <Overlined text={label} /> = {value}
    </button>
  );
}
