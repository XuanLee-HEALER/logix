import { motion } from "motion/react";

interface InputToggleProps {
  label: string;
  value: number;
  onToggle: () => void;
}

export function InputToggle({ label, value, onToggle }: InputToggleProps) {
  const isOn = value === 1;

  return (
    <motion.button
      onClick={onToggle}
      className={`wobbly border-[3px] px-5 py-2.5 font-heading text-xl font-bold transition-colors ${
        isOn
          ? "border-pen-blue bg-pen-blue text-white shadow-sketch-sm"
          : "border-pencil/40 bg-white text-pencil/60 shadow-sketch"
      }`}
      whileHover={{ rotate: isOn ? -2 : 2 }}
      whileTap={{ scale: 0.95, y: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {label} = {value}
    </motion.button>
  );
}
