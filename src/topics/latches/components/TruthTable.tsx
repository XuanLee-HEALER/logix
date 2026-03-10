import { AlertTriangle } from "lucide-react";
import { Overlined } from "@/lib/Overlined";
import type { TruthTableRow } from "../data";

interface TruthTableProps {
  inputLabels: string[];
  rows: TruthTableRow[];
  currentInputs: Record<string, number>;
}

function matchesRow(
  row: TruthTableRow,
  currentInputs: Record<string, number>,
): boolean {
  return Object.entries(row.inputs).every(
    ([key, val]) => currentInputs[key] === val,
  );
}

export function TruthTable({
  inputLabels,
  rows,
  currentInputs,
}: TruthTableProps) {
  return (
    <div className="wobbly-md overflow-hidden border-2 border-pencil">
      <table className="w-full text-center font-body">
        <thead>
          <tr className="bg-erased font-heading text-sm font-bold tracking-wide">
            {inputLabels.map((label) => (
              <th key={label} className="border-b-2 border-pencil px-3 py-2">
                <Overlined text={label} />
              </th>
            ))}
            <th className="border-b-2 border-l-2 border-pencil px-3 py-2">Q</th>
            <th className="border-b-2 border-l-2 border-pencil px-3 py-2">
              <span style={{ textDecoration: "overline" }}>Q</span>
            </th>
            <th className="border-b-2 border-l-2 border-pencil px-3 py-2">
              状态
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isActive = matchesRow(row, currentInputs);
            const isForbidden = row.forbidden;

            return (
              <tr
                key={i}
                className={`transition-colors duration-200 ${
                  isActive
                    ? isForbidden
                      ? "bg-marker-red/15 font-bold"
                      : "bg-pen-blue/10 font-bold"
                    : "hover:bg-erased/30"
                }`}
              >
                {inputLabels.map((label) => (
                  <td
                    key={label}
                    className={`border-t border-pencil/20 px-3 py-2 font-mono text-lg ${
                      isActive ? "text-pencil" : "text-pencil/60"
                    }`}
                  >
                    {row.inputs[label]}
                  </td>
                ))}
                <td
                  className={`border-t border-l-2 border-pencil/20 px-3 py-2 font-mono text-lg ${
                    isActive
                      ? isForbidden
                        ? "text-marker-red"
                        : "text-pen-blue"
                      : "text-pencil/60"
                  }`}
                >
                  <Overlined text={row.outputs.Q} />
                </td>
                <td
                  className={`border-t border-l-2 border-pencil/20 px-3 py-2 font-mono text-lg ${
                    isActive
                      ? isForbidden
                        ? "text-marker-red"
                        : "text-pen-blue"
                      : "text-pencil/60"
                  }`}
                >
                  <Overlined text={row.outputs.Qbar} />
                </td>
                <td
                  className={`border-t border-l-2 border-pencil/20 px-3 py-2 text-base ${
                    isActive
                      ? isForbidden
                        ? "text-marker-red"
                        : "text-pen-blue"
                      : "text-pencil/40"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    {isForbidden && (
                      <AlertTriangle size={14} strokeWidth={2.5} />
                    )}
                    {row.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
