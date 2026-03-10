const options = [2, 3, 4] as const;

interface ColumnSelectorProps {
  value: number;
  onChange: (cols: number) => void;
}

export function ColumnSelector({ value, onChange }: ColumnSelectorProps) {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <span className="text-sm text-pencil/40">每行</span>
      {options.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`wobbly-sm border-2 px-2.5 py-0.5 font-heading text-sm font-bold transition-all duration-100 ${
            n === value
              ? "border-pencil bg-postit text-pencil shadow-sketch-sm"
              : "border-pencil/20 text-pencil/40 hover:border-pencil/50"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
