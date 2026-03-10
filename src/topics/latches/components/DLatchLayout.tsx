import { useRef, useEffect } from "react";
import rough from "roughjs";
import { DEAD, txt, collectInto } from "@/lib/rough-helpers";
import { drawAndGate, drawNotTriangle, drawNorGate } from "./gates";
import { Wire, OutputDot, SignalDot } from "./signal-parts";

export function DLatchLayout({
  inputs,
  Q,
  Qbar,
}: {
  inputs: Record<string, number>;
  Q: number;
  Qbar: number;
}) {
  const roughRef = useRef<SVGGElement>(null);

  const D = inputs["D"] ?? 0;
  const E = inputs["E"] ?? 0;

  useEffect(() => {
    const g = roughRef.current;
    if (!g) return;
    g.replaceChildren();

    const svg = g.ownerSVGElement!;
    const rc = rough.svg(svg);

    collectInto(svg, g, () => drawAndGate(svg, rc, 160, 70));
    collectInto(svg, g, () => drawNotTriangle(svg, rc, 100, 210));
    collectInto(svg, g, () => drawAndGate(svg, rc, 160, 210));
    collectInto(svg, g, () => drawNorGate(svg, rc, 290, 100));
    collectInto(svg, g, () => drawNorGate(svg, rc, 290, 180));
    collectInto(svg, g, () => txt(svg, 35, 65, "D", 18, "700"));
    collectInto(svg, g, () => txt(svg, 35, 143, "E", 18, "700"));
    collectInto(svg, g, () => txt(svg, 320, 155, "SR", 11, "400", DEAD));
  }, []);

  const dLive = D === 1;
  const eLive = E === 1;
  const sInternal = D === 1 && E === 1;
  const rInternal = D === 0 && E === 1;
  const notD = D === 0;
  const qLive = Q === 1;
  const qbarLive = Qbar === 1;

  return (
    <g>
      <g ref={roughRef} />

      {/* D input → top AND gate input 1 */}
      <Wire
        points={[
          [50, 58],
          [160, 58],
        ]}
        live={dLive}
      />

      {/* D input → NOT gate → bottom AND gate */}
      <Wire
        points={[
          [50, 58],
          [50, 210],
          [100, 210],
        ]}
        live={dLive}
      />
      {/* NOT output → bottom AND input 1 */}
      <Wire
        points={[
          [135, 210],
          [148, 210],
          [148, 198],
          [160, 198],
        ]}
        live={notD}
      />

      {/* E input → top AND gate input 2 */}
      <Wire
        points={[
          [50, 140],
          [130, 140],
          [130, 82],
          [160, 82],
        ]}
        live={eLive}
      />
      {/* E input → bottom AND gate input 2 */}
      <Wire
        points={[
          [130, 140],
          [130, 222],
          [160, 222],
        ]}
        live={eLive}
      />

      {/* Top AND output (S) → top NOR gate input 1 */}
      <Wire
        points={[
          [213, 70],
          [260, 70],
          [260, 88],
          [290, 88],
        ]}
        live={sInternal}
      />
      {/* Bottom AND output (R) → bottom NOR gate input 2 */}
      <Wire
        points={[
          [213, 210],
          [260, 210],
          [260, 192],
          [290, 192],
        ]}
        live={rInternal}
      />

      {/* NOR feedback wires (cross-coupled) */}
      <Wire
        points={[
          [250, 112],
          [290, 112],
        ]}
        live={qLive}
      />
      <Wire
        points={[
          [250, 168],
          [290, 168],
        ]}
        live={qbarLive}
      />

      {/* NOR outputs */}
      <Wire
        points={[
          [355, 100],
          [410, 100],
        ]}
        live={qbarLive}
      />
      <Wire
        points={[
          [355, 180],
          [410, 180],
        ]}
        live={qLive}
      />

      {/* Cross-coupling feedback */}
      <Wire
        points={[
          [410, 100],
          [430, 100],
          [430, 140],
          [240, 140],
          [240, 168],
          [250, 168],
        ]}
        live={qbarLive}
      />
      <Wire
        points={[
          [410, 180],
          [440, 180],
          [440, 148],
          [248, 148],
          [248, 112],
          [250, 112],
        ]}
        live={qLive}
      />

      <SignalDot cx={410} cy={100} live={qbarLive} />
      <SignalDot cx={410} cy={180} live={qLive} />
      <SignalDot cx={50} cy={58} live={dLive} />
      <SignalDot cx={130} cy={140} live={eLive} />

      {/* Output indicators */}
      <OutputDot
        cx={475}
        cy={100}
        label={"Q\u0305"}
        value={Qbar}
        forbidden={false}
      />
      <Wire
        points={[
          [424, 100],
          [461, 100],
        ]}
        live={qbarLive}
      />
      <OutputDot cx={475} cy={180} label="Q" value={Q} forbidden={false} />
      <Wire
        points={[
          [424, 180],
          [461, 180],
        ]}
        live={qLive}
      />
    </g>
  );
}
