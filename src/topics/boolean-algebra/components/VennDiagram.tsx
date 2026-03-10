import type { VennMode, VennHighlight } from "../data";

interface VennDiagramProps {
  mode: VennMode;
  venn: VennHighlight;
}

const COLORS = {
  stroke: "#2d2d2d",
  fillA: "#2d5da1",
  fillB: "#ff4d4d",
  fillC: "#2d5da1",
  highlight: "rgba(255, 77, 77, 0.25)",
  highlightStroke: "#ff4d4d",
  dimFill: "rgba(45, 45, 45, 0.06)",
  dimStroke: "rgba(45, 45, 45, 0.25)",
  universeFill: "rgba(45, 93, 161, 0.08)",
  universeHighlight: "rgba(45, 93, 161, 0.15)",
};

export function VennDiagram({ mode, venn }: VennDiagramProps) {
  return (
    <svg viewBox="0 0 300 260" className="w-full">
      <Universe highlighted={venn === "universe"} />
      {mode === "const" && <ConstDiagram venn={venn} />}
      {mode === "venn1" && <Venn1 venn={venn} />}
      {mode === "venn2" && <Venn2 venn={venn} />}
      {mode === "venn3" && <Venn3 venn={venn} />}
    </svg>
  );
}

/* ── Universe rectangle ── */
function Universe({ highlighted }: { highlighted: boolean }) {
  return (
    <>
      <rect
        x="8"
        y="8"
        width="284"
        height="244"
        rx="4"
        fill={highlighted ? COLORS.universeHighlight : COLORS.universeFill}
        stroke={highlighted ? COLORS.highlightStroke : COLORS.dimStroke}
        strokeWidth="2"
        strokeDasharray={highlighted ? undefined : "6 4"}
      />
      <text
        x="20"
        y="28"
        fontSize="13"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.stroke}
        opacity={0.5}
      >
        U
      </text>
    </>
  );
}

/* ── Constant (no circles) ── */
function ConstDiagram({ venn }: { venn: VennHighlight }) {
  if (venn === "none" || venn === "universe") {
    const isZero = venn === "none";
    return (
      <text
        x="150"
        y="140"
        textAnchor="middle"
        fontSize="32"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={isZero ? "rgba(45,45,45,0.3)" : COLORS.fillA}
      >
        {isZero ? "= 0  (∅)" : "= 1  (全集)"}
      </text>
    );
  }
  /* AB highlighted as a box */
  return (
    <>
      <rect
        x="90"
        y="80"
        width="120"
        height="100"
        rx="4"
        fill={COLORS.highlight}
        stroke={COLORS.highlightStroke}
        strokeWidth="2"
      />
      <text
        x="150"
        y="138"
        textAnchor="middle"
        fontSize="28"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.highlightStroke}
      >
        = 1
      </text>
    </>
  );
}

/* ── Single circle ── */
function Venn1({ venn }: { venn: VennHighlight }) {
  const cx = 150,
    cy = 135,
    r = 70;
  const isHighlighted = venn === "A";
  const isNotA = venn === "notA";

  return (
    <>
      {/* NOT A: highlight universe but not the circle */}
      {isNotA && (
        <rect
          x="8"
          y="8"
          width="284"
          height="244"
          rx="4"
          fill="rgba(255,77,77,0.12)"
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={
          isHighlighted ? COLORS.highlight : isNotA ? "#fdfbf7" : COLORS.dimFill
        }
        stroke={isHighlighted ? COLORS.highlightStroke : COLORS.dimStroke}
        strokeWidth="2.5"
        strokeDasharray={venn === "none" ? "5 4" : undefined}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize="22"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.stroke}
      >
        A
      </text>
    </>
  );
}

/* ── Two circles ── */
function Venn2({ venn }: { venn: VennHighlight }) {
  const ax = 125,
    bx = 175,
    cy = 135,
    r = 70;

  // Determine fill for each region via clipPath
  const highlightA = ["A", "AuB", "xor", "not_AuB"].includes(venn);
  const highlightB = ["B", "AuB", "xor", "not_AuB"].includes(venn);
  const highlightAB = ["AB", "AuB", "xnor"].includes(venn);
  const highlightNotAB = venn === "not_AB";
  const highlightNotAuB = venn === "not_AuB";
  const isXnor = venn === "xnor";

  return (
    <>
      {/* Background for NOT operations */}
      {(highlightNotAB || highlightNotAuB) && (
        <rect
          x="8"
          y="8"
          width="284"
          height="244"
          rx="4"
          fill="rgba(255,77,77,0.12)"
        />
      )}

      {/* Circle A */}
      <circle
        cx={ax}
        cy={cy}
        r={r}
        fill={
          highlightA
            ? COLORS.highlight
            : highlightNotAuB
              ? "#fdfbf7"
              : COLORS.dimFill
        }
        stroke={
          highlightA || highlightAB || highlightNotAB
            ? COLORS.highlightStroke
            : COLORS.dimStroke
        }
        strokeWidth="2.5"
      />
      {/* Circle B */}
      <circle
        cx={bx}
        cy={cy}
        r={r}
        fill={
          highlightB
            ? COLORS.highlight
            : highlightNotAuB
              ? "#fdfbf7"
              : COLORS.dimFill
        }
        stroke={
          highlightB || highlightAB || highlightNotAB
            ? COLORS.highlightStroke
            : COLORS.dimStroke
        }
        strokeWidth="2.5"
      />

      {/* Intersection overlay */}
      <defs>
        <clipPath id="clipA">
          <circle cx={ax} cy={cy} r={r} />
        </clipPath>
        <clipPath id="clipB">
          <circle cx={bx} cy={cy} r={r} />
        </clipPath>
      </defs>

      {/* A∩B highlight */}
      {highlightAB && (
        <circle
          cx={ax}
          cy={cy}
          r={r}
          clipPath="url(#clipB)"
          fill="rgba(255,77,77,0.35)"
        />
      )}

      {/* NOT(A∩B): punch out only the intersection */}
      {highlightNotAB && (
        <circle cx={ax} cy={cy} r={r} clipPath="url(#clipB)" fill="#fdfbf7" />
      )}

      {/* XOR: highlight A-only and B-only, dim intersection */}
      {venn === "xor" && (
        <circle cx={ax} cy={cy} r={r} clipPath="url(#clipB)" fill="#fdfbf7" />
      )}

      {/* XNOR: highlight intersection and outside */}
      {isXnor && (
        <>
          <circle
            cx={ax}
            cy={cy}
            r={r}
            clipPath="url(#clipB)"
            fill="rgba(255,77,77,0.35)"
          />
        </>
      )}

      {/* Labels */}
      <text
        x={ax - 30}
        y={cy + 5}
        textAnchor="middle"
        fontSize="20"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.stroke}
      >
        A
      </text>
      <text
        x={bx + 30}
        y={cy + 5}
        textAnchor="middle"
        fontSize="20"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.stroke}
      >
        B
      </text>
    </>
  );
}

/* ── Three circles ── */
function Venn3({ venn }: { venn: VennHighlight }) {
  const ax = 130,
    bx = 170,
    cy1 = 120,
    cy2 = 160,
    cx3 = 150,
    r = 60;

  const isAll = venn === "ABC";
  const isUnion = venn === "AuBuC";
  const isAandBuC = venn === "A_and_BuC";
  const isAorBC = venn === "A_or_BC";
  const active = isAll || isUnion || isAandBuC || isAorBC;

  return (
    <>
      {/* clipPaths for intersection calculations */}
      <defs>
        <clipPath id="v3a">
          <circle cx={ax} cy={cy1} r={r} />
        </clipPath>
        <clipPath id="v3b">
          <circle cx={bx} cy={cy1} r={r} />
        </clipPath>
        <clipPath id="v3c">
          <circle cx={cx3} cy={cy2} r={r} />
        </clipPath>
      </defs>

      {/* Base circles — always dim fill */}
      <circle cx={ax} cy={cy1} r={r} fill={COLORS.dimFill} />
      <circle cx={bx} cy={cy1} r={r} fill={COLORS.dimFill} />
      <circle cx={cx3} cy={cy2} r={r} fill={COLORS.dimFill} />

      {/* ── Highlight overlays (drawn above base fills) ── */}

      {/* AuBuC: all three highlighted */}
      {isUnion && (
        <>
          <circle cx={ax} cy={cy1} r={r} fill={COLORS.highlight} />
          <circle cx={bx} cy={cy1} r={r} fill={COLORS.highlight} />
          <circle cx={cx3} cy={cy2} r={r} fill={COLORS.highlight} />
        </>
      )}

      {/* ABC: triple intersection */}
      {isAll && (
        <g clipPath="url(#v3a)">
          <circle
            cx={cx3}
            cy={cy2}
            r={r}
            clipPath="url(#v3b)"
            fill="rgba(255,77,77,0.4)"
          />
        </g>
      )}

      {/* A∩(B∪C): B clipped by A + C clipped by A */}
      {isAandBuC && (
        <>
          <circle
            cx={bx}
            cy={cy1}
            r={r}
            clipPath="url(#v3a)"
            fill="rgba(255,77,77,0.3)"
          />
          <circle
            cx={cx3}
            cy={cy2}
            r={r}
            clipPath="url(#v3a)"
            fill="rgba(255,77,77,0.3)"
          />
        </>
      )}

      {/* A∪(B∩C): full A + B∩C */}
      {isAorBC && (
        <>
          <circle cx={ax} cy={cy1} r={r} fill={COLORS.highlight} />
          <circle
            cx={cx3}
            cy={cy2}
            r={r}
            clipPath="url(#v3b)"
            fill="rgba(255,77,77,0.3)"
          />
        </>
      )}

      {/* ── Borders redrawn on top so they're not hidden by overlays ── */}
      <circle
        cx={ax}
        cy={cy1}
        r={r}
        fill="none"
        stroke={active ? COLORS.highlightStroke : COLORS.dimStroke}
        strokeWidth="2.5"
      />
      <circle
        cx={bx}
        cy={cy1}
        r={r}
        fill="none"
        stroke={active ? COLORS.highlightStroke : COLORS.dimStroke}
        strokeWidth="2.5"
      />
      <circle
        cx={cx3}
        cy={cy2}
        r={r}
        fill="none"
        stroke={active ? COLORS.highlightStroke : COLORS.dimStroke}
        strokeWidth="2.5"
      />

      {/* Labels */}
      <text
        x={ax - 28}
        y={cy1 - 12}
        textAnchor="middle"
        fontSize="18"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.stroke}
      >
        A
      </text>
      <text
        x={bx + 28}
        y={cy1 - 12}
        textAnchor="middle"
        fontSize="18"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.stroke}
      >
        B
      </text>
      <text
        x={cx3}
        y={cy2 + 45}
        textAnchor="middle"
        fontSize="18"
        fontFamily="Kalam, cursive"
        fontWeight="700"
        fill={COLORS.stroke}
      >
        C
      </text>
    </>
  );
}
