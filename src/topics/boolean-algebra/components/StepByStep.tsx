import type { SimplificationStep } from "../data";
import { MoveDown } from "lucide-react";

interface StepByStepProps {
  steps: SimplificationStep[];
}

export function StepByStep({ steps }: StepByStepProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={i}>
          {i > 0 && (
            <div className="flex items-center gap-2 py-1 pl-4">
              <MoveDown
                size={14}
                strokeWidth={2.5}
                className="text-pencil/30"
              />
              <span className="font-body text-sm text-pen-blue">
                {step.law}
              </span>
            </div>
          )}
          <div
            className={`wobbly-sm border-2 px-4 py-2 font-mono text-base ${
              i === steps.length - 1
                ? "border-marker-red bg-marker-red/5 font-bold text-marker-red"
                : i === 0
                  ? "border-pencil/40 bg-erased/30"
                  : "border-pencil/20 bg-white"
            }`}
          >
            {step.expr}
          </div>
        </div>
      ))}
    </div>
  );
}
