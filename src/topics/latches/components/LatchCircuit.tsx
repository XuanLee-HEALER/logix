import type { LatchType } from "../data";
import { SRNorLayout } from "./SRNorLayout";
import { SRNandLayout } from "./SRNandLayout";
import { DLatchLayout } from "./DLatchLayout";

interface LatchCircuitProps {
  type: LatchType;
  inputs: Record<string, number>;
  Q: number;
  Qbar: number;
  forbidden: boolean;
}

export function LatchCircuit({
  type,
  inputs,
  Q,
  Qbar,
  forbidden,
}: LatchCircuitProps) {
  const viewBox = type === "d-latch" ? "0 0 520 280" : "0 0 430 280";

  return (
    <svg
      viewBox={viewBox}
      className="w-full"
      role="img"
      aria-label="锁存器电路图"
    >
      {type === "sr-nor" && (
        <SRNorLayout inputs={inputs} Q={Q} Qbar={Qbar} forbidden={forbidden} />
      )}
      {type === "sr-nand" && (
        <SRNandLayout inputs={inputs} Q={Q} Qbar={Qbar} forbidden={forbidden} />
      )}
      {type === "d-latch" && <DLatchLayout inputs={inputs} Q={Q} Qbar={Qbar} />}
    </svg>
  );
}
