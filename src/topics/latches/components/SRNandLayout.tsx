import { useRef, useEffect } from "react";
import rough from "roughjs";
import { txt, collectInto } from "@/lib/rough-helpers";
import { drawNandGate } from "./gates";
import { Wire, OutputDot, SignalDot } from "./signal-parts";

export function SRNandLayout({
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

  const Sbar = inputs["S\u0305"] ?? 1;
  const Rbar = inputs["R\u0305"] ?? 1;

  useEffect(() => {
    const g = roughRef.current;
    if (!g) return;
    g.replaceChildren();

    const svg = g.ownerSVGElement!;
    const rc = rough.svg(svg);

    collectInto(svg, g, () => drawNandGate(svg, rc, 180, 80));
    collectInto(svg, g, () => drawNandGate(svg, rc, 180, 200));
    collectInto(svg, g, () => txt(svg, 50, 72, "S\u0305", 18, "700"));
    collectInto(svg, g, () => txt(svg, 50, 212, "R\u0305", 18, "700"));
  }, []);

  const sLive = Sbar === 1;
  const rLive = Rbar === 1;
  const qLive = Q === 1;
  const qbarLive = Qbar === 1;

  return (
    <g>
      <g ref={roughRef} />

      <Wire
        points={[
          [70, 68],
          [180, 68],
        ]}
        live={sLive}
      />
      <Wire
        points={[
          [150, 92],
          [180, 92],
        ]}
        live={qbarLive}
      />
      <Wire
        points={[
          [70, 212],
          [180, 212],
        ]}
        live={rLive}
      />
      <Wire
        points={[
          [150, 188],
          [180, 188],
        ]}
        live={qLive}
      />
      <Wire
        points={[
          [245, 80],
          [310, 80],
        ]}
        live={qLive}
      />
      <Wire
        points={[
          [245, 200],
          [310, 200],
        ]}
        live={qbarLive}
      />

      {/* Cross-coupling */}
      <Wire
        points={[
          [310, 80],
          [330, 80],
          [330, 140],
          [140, 140],
          [140, 188],
          [150, 188],
        ]}
        live={qLive}
      />
      <Wire
        points={[
          [310, 200],
          [340, 200],
          [340, 148],
          [148, 148],
          [148, 92],
          [150, 92],
        ]}
        live={qbarLive}
      />

      <SignalDot cx={310} cy={80} live={qLive} />
      <SignalDot cx={310} cy={200} live={qbarLive} />

      <OutputDot cx={380} cy={80} label="Q" value={Q} forbidden={forbidden} />
      <Wire
        points={[
          [324, 80],
          [366, 80],
        ]}
        live={qLive}
      />
      <OutputDot
        cx={380}
        cy={200}
        label={"Q\u0305"}
        value={Qbar}
        forbidden={forbidden}
      />
      <Wire
        points={[
          [324, 200],
          [366, 200],
        ]}
        live={qbarLive}
      />

      <SignalDot cx={70} cy={68} live={sLive} />
      <SignalDot cx={70} cy={212} live={rLive} />
    </g>
  );
}
