import { useRef, useEffect } from "react";
import rough from "roughjs";
import { txt, collectInto } from "@/lib/rough-helpers";
import { drawNorGate } from "./gates";
import { Wire, OutputDot, SignalDot } from "./signal-parts";

export function SRNorLayout({
  inputs,
  Q,
  Qbar,
  forbidden,
}: {
  inputs: Record<string, number>;
  Q: number;
  Qbar: number;
  forbidden: boolean;
}) {
  const roughRef = useRef<SVGGElement>(null);

  const S = inputs["S"] ?? 0;
  const R = inputs["R"] ?? 0;

  useEffect(() => {
    const g = roughRef.current;
    if (!g) return;
    g.replaceChildren();

    const svg = g.ownerSVGElement!;
    const rc = rough.svg(svg);

    collectInto(svg, g, () => drawNorGate(svg, rc, 180, 80));
    collectInto(svg, g, () => drawNorGate(svg, rc, 180, 200));
    collectInto(svg, g, () => txt(svg, 55, 72, "S", 18, "700"));
    collectInto(svg, g, () => txt(svg, 55, 212, "R", 18, "700"));
  }, []);

  const sLive = S === 1;
  const rLive = R === 1;
  const qLive = Q === 1;
  const qbarLive = Qbar === 1;

  return (
    <g>
      {/* Static rough layer */}
      <g ref={roughRef} />

      {/* S input wire → top NOR gate input 1 */}
      <Wire
        points={[
          [70, 68],
          [180, 68],
        ]}
        live={sLive}
      />
      {/* Q feedback → top NOR gate input 2 (cross-coupled from bottom gate) */}
      <Wire
        points={[
          [150, 92],
          [180, 92],
        ]}
        live={qLive}
      />

      {/* R input wire → bottom NOR gate input 2 */}
      <Wire
        points={[
          [70, 212],
          [180, 212],
        ]}
        live={rLive}
      />
      {/* Q̄ feedback → bottom NOR gate input 1 (cross-coupled from top gate) */}
      <Wire
        points={[
          [150, 188],
          [180, 188],
        ]}
        live={qbarLive}
      />

      {/* Top NOR output → Q̄ */}
      <Wire
        points={[
          [245, 80],
          [310, 80],
        ]}
        live={qbarLive}
      />
      {/* Bottom NOR output → Q */}
      <Wire
        points={[
          [245, 200],
          [310, 200],
        ]}
        live={qLive}
      />

      {/* Cross-coupling feedback: Q̄ → bottom NOR input */}
      <Wire
        points={[
          [310, 80],
          [330, 80],
          [330, 140],
          [140, 140],
          [140, 188],
          [150, 188],
        ]}
        live={qbarLive}
      />
      {/* Cross-coupling feedback: Q → top NOR input */}
      <Wire
        points={[
          [310, 200],
          [340, 200],
          [340, 148],
          [148, 148],
          [148, 92],
          [150, 92],
        ]}
        live={qLive}
      />

      {/* Connection dots */}
      <SignalDot cx={310} cy={80} live={qbarLive} />
      <SignalDot cx={310} cy={200} live={qLive} />

      {/* Output indicators */}
      <OutputDot
        cx={380}
        cy={80}
        label={"Q\u0305"}
        value={Qbar}
        forbidden={forbidden}
      />
      <Wire
        points={[
          [324, 80],
          [366, 80],
        ]}
        live={qbarLive}
      />
      <OutputDot cx={380} cy={200} label="Q" value={Q} forbidden={forbidden} />
      <Wire
        points={[
          [324, 200],
          [366, 200],
        ]}
        live={qLive}
      />

      {/* Input signal dots */}
      <SignalDot cx={70} cy={68} live={sLive} />
      <SignalDot cx={70} cy={212} live={rLive} />
    </g>
  );
}
