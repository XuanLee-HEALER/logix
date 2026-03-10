import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import rough from "roughjs";
import type { LatchType } from "../data";

/* ── Color palette (matches existing design system) ── */
const LIVE = "#2d5da1";
const DEAD = "#c4bfb6";
const PENCIL = "#2d2d2d";
const RED = "#ff4d4d";

/* ── RoughJS options ── */
const RO = { roughness: 1.4, bowing: 1.2, seed: 42 };

type RC = ReturnType<typeof rough.svg>;

/* ── Helper: collect elements drawn by drawFn and move into target group ── */
function collectInto(
  svg: SVGSVGElement,
  target: SVGGElement,
  drawFn: () => void,
) {
  const before = svg.childNodes.length;
  drawFn();
  const added = svg.childNodes.length - before;
  const nodes: Node[] = [];
  for (let i = 0; i < added; i++) {
    nodes.push(svg.removeChild(svg.lastChild!));
  }
  nodes.reverse().forEach((n) => target.appendChild(n));
}

/* ── Helper: draw text on SVG ── */
function txt(
  svg: SVGSVGElement,
  x: number,
  y: number,
  content: string,
  size = 15,
  weight = "700",
  fill = PENCIL,
) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.setAttribute("x", String(x));
  el.setAttribute("y", String(y));
  el.setAttribute("text-anchor", "middle");
  el.setAttribute("font-family", "Kalam, cursive");
  el.setAttribute("font-size", String(size));
  el.setAttribute("font-weight", weight);
  el.setAttribute("fill", fill);
  el.textContent = content;
  svg.appendChild(el);
}

/* ── Gate drawing primitives ── */

function drawNorGate(svg: SVGSVGElement, rc: RC, x: number, y: number) {
  // NOR gate: curved OR body + inversion bubble
  // Body: ~60w x 40h, input at left, output at right
  const w = 60;
  const h = 40;

  // OR body curve (left side)
  svg.appendChild(
    rc.arc(x + 8, y, 20, h, -Math.PI / 2, Math.PI / 2, false, {
      ...RO,
      stroke: PENCIL,
      strokeWidth: 2.5,
      fill: "transparent",
    }),
  );

  // Top curve
  svg.appendChild(
    rc.curve(
      [
        [x + 8, y - h / 2],
        [x + w * 0.5, y - h / 2 - 2],
        [x + w - 8, y],
      ],
      { ...RO, stroke: PENCIL, strokeWidth: 2.5 },
    ),
  );

  // Bottom curve
  svg.appendChild(
    rc.curve(
      [
        [x + 8, y + h / 2],
        [x + w * 0.5, y + h / 2 + 2],
        [x + w - 8, y],
      ],
      { ...RO, stroke: PENCIL, strokeWidth: 2.5 },
    ),
  );

  // Inversion bubble
  svg.appendChild(
    rc.circle(x + w - 2, y, 10, {
      ...RO,
      fill: "#fff",
      fillStyle: "solid",
      stroke: PENCIL,
      strokeWidth: 2,
    }),
  );

  // Label
  txt(svg, x + w / 2 - 2, y + 5, "NOR", 11, "700");
}

function drawNandGate(svg: SVGSVGElement, rc: RC, x: number, y: number) {
  const w = 60;
  const h = 40;

  // AND body: flat left + curved right
  svg.appendChild(
    rc.line(x, y - h / 2, x, y + h / 2, {
      ...RO,
      stroke: PENCIL,
      strokeWidth: 2.5,
    }),
  );
  svg.appendChild(
    rc.line(x, y - h / 2, x + w * 0.4, y - h / 2, {
      ...RO,
      stroke: PENCIL,
      strokeWidth: 2.5,
    }),
  );
  svg.appendChild(
    rc.line(x, y + h / 2, x + w * 0.4, y + h / 2, {
      ...RO,
      stroke: PENCIL,
      strokeWidth: 2.5,
    }),
  );

  // Right curve
  svg.appendChild(
    rc.arc(
      x + w * 0.4,
      y,
      (w - w * 0.4) * 2 - 16,
      h,
      -Math.PI / 2,
      Math.PI / 2,
      false,
      {
        ...RO,
        stroke: PENCIL,
        strokeWidth: 2.5,
        fill: "transparent",
      },
    ),
  );

  // Inversion bubble
  svg.appendChild(
    rc.circle(x + w - 2, y, 10, {
      ...RO,
      fill: "#fff",
      fillStyle: "solid",
      stroke: PENCIL,
      strokeWidth: 2,
    }),
  );

  txt(svg, x + w / 2 - 4, y + 5, "NAND", 10, "700");
}

function drawAndGate(svg: SVGSVGElement, rc: RC, x: number, y: number) {
  const w = 50;
  const h = 34;

  svg.appendChild(
    rc.line(x, y - h / 2, x, y + h / 2, {
      ...RO,
      stroke: PENCIL,
      strokeWidth: 2.5,
    }),
  );
  svg.appendChild(
    rc.line(x, y - h / 2, x + w * 0.4, y - h / 2, {
      ...RO,
      stroke: PENCIL,
      strokeWidth: 2.5,
    }),
  );
  svg.appendChild(
    rc.line(x, y + h / 2, x + w * 0.4, y + h / 2, {
      ...RO,
      stroke: PENCIL,
      strokeWidth: 2.5,
    }),
  );

  svg.appendChild(
    rc.arc(
      x + w * 0.4,
      y,
      (w - w * 0.4) * 2,
      h,
      -Math.PI / 2,
      Math.PI / 2,
      false,
      {
        ...RO,
        stroke: PENCIL,
        strokeWidth: 2.5,
        fill: "transparent",
      },
    ),
  );

  txt(svg, x + w / 2 - 2, y + 5, "AND", 10, "700");
}

function drawNotTriangle(svg: SVGSVGElement, rc: RC, x: number, y: number) {
  svg.appendChild(
    rc.polygon(
      [
        [x, y - 12],
        [x + 25, y],
        [x, y + 12],
      ],
      {
        ...RO,
        stroke: PENCIL,
        strokeWidth: 2,
        fill: "#fff",
        fillStyle: "solid",
      },
    ),
  );
  svg.appendChild(
    rc.circle(x + 30, y, 8, {
      ...RO,
      fill: "#fff",
      fillStyle: "solid",
      stroke: PENCIL,
      strokeWidth: 2,
    }),
  );
  txt(svg, x + 12, y + 4, "NOT", 8, "700");
}

/* ── Animated wire component ── */
function Wire({ points, live }: { points: [number, number][]; live: boolean }) {
  if (points.length < 2) return null;

  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    segments.push(
      <motion.line
        key={i}
        x1={points[i]![0]}
        y1={points[i]![1]}
        x2={points[i + 1]![0]}
        y2={points[i + 1]![1]}
        animate={{ stroke: live ? LIVE : DEAD }}
        transition={{ duration: 0.3 }}
        strokeWidth={live ? 2.5 : 2}
        strokeLinecap="round"
      />,
    );
  }
  return <>{segments}</>;
}

/* ── Output indicator ── */
function OutputDot({
  cx,
  cy,
  label,
  value,
  forbidden,
}: {
  cx: number;
  cy: number;
  label: string;
  value: number;
  forbidden: boolean;
}) {
  const isOn = value === 1;
  return (
    <g>
      <motion.circle
        cx={cx}
        cy={cy}
        r={14}
        animate={{
          fill: forbidden ? RED : isOn ? LIVE : DEAD,
          opacity: forbidden ? [1, 0.4, 1] : 1,
        }}
        transition={
          forbidden ? { duration: 0.8, repeat: Infinity } : { duration: 0.3 }
        }
        stroke={PENCIL}
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontFamily="Kalam, cursive"
        fontSize="13"
        fontWeight="700"
        fill="#fff"
      >
        {forbidden ? "?" : value}
      </text>
      <text
        x={cx}
        y={cy - 22}
        textAnchor="middle"
        fontFamily="Kalam, cursive"
        fontSize="14"
        fontWeight="700"
        fill={PENCIL}
      >
        {label}
      </text>
    </g>
  );
}

/* ── Signal dot on connection points ── */
function SignalDot({
  cx,
  cy,
  live,
}: {
  cx: number;
  cy: number;
  live: boolean;
}) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={3.5}
      animate={{ fill: live ? LIVE : DEAD }}
      transition={{ duration: 0.3 }}
    />
  );
}

/* ── SR NOR Layout ── */
function SRNorLayout({
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

  // Wire signals
  const sLive = S === 1;
  const rLive = R === 1;
  const qLive = Q === 1;
  const qbarLive = Qbar === 1;

  return (
    <g>
      {/* Static rough layer */}
      <g ref={roughRef} />

      {/* Dynamic wire layer */}
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

/* ── SR NAND Layout ── */
function SRNandLayout({
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

/* ── D Latch Layout ── */
function DLatchLayout({
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

/* ── Main Component ── */

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
