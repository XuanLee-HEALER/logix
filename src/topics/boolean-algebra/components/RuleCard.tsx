import type { BooleanRule } from "../data";

interface RuleCardProps {
  rule: BooleanRule;
  active: boolean;
  onClick: () => void;
}

export function RuleCard({ rule, active, onClick }: RuleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`wobbly-sm flex w-full items-center gap-3 border-2 px-4 py-3 text-left transition-all duration-100 ${
        active
          ? "border-marker-red bg-marker-red/5 shadow-sketch-sm -rotate-1"
          : "border-pencil/30 bg-white hover:border-pencil hover:shadow-sketch-sm hover:rotate-1"
      }`}
    >
      <span
        className={`font-mono text-base md:text-lg ${
          active ? "text-marker-red font-bold" : "text-pencil"
        }`}
      >
        {rule.formula}
      </span>
      <span
        className={`wobbly ml-auto shrink-0 border px-2 py-0.5 text-xs ${
          active
            ? "border-marker-red/40 bg-marker-red/10 text-marker-red"
            : "border-pencil/20 bg-erased/50 text-pencil/60"
        }`}
      >
        {rule.name}
      </span>
    </button>
  );
}
