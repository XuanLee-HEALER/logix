import { useRef, useEffect } from "react";
import rough from "roughjs";
import type { CircuitConfig } from "../data";

/* ── Color palette ── */
const LIVE = "#2d5da1";
const DEAD = "#c4bfb6";
const PENCIL = "#2d2d2d";
const RED = "#ff4d4d";
const BULB_ON = "#fff9c4";
const BULB_OFF = "#e5e0d8";
const W = 380;
const H = 160;

/* roughjs options */
const RO = { roughness: 1.4, bowing: 1.2, seed: 42 };

type RC = ReturnType<typeof rough.svg>;

/* ── Primitives ── */

function wire(svg: SVGSVGElement, rc: RC, pts: number[][], live: boolean) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i]!;
    const [x2, y2] = pts[i + 1]!;
    svg.appendChild(
      rc.line(x1!, y1!, x2!, y2!, {
        ...RO,
        stroke: live ? LIVE : DEAD,
        strokeWidth: live ? 2.5 : 2,
      }),
    );
  }
}

function dot(svg: SVGSVGElement, rc: RC, x: number, y: number) {
  svg.appendChild(
    rc.circle(x, y, 7, {
      ...RO,
      fill: PENCIL,
      fillStyle: "solid",
      stroke: PENCIL,
      strokeWidth: 1,
    }),
  );
}

function sw(
  svg: SVGSVGElement,
  rc: RC,
  cx: number,
  cy: number,
  label: string,
  on: boolean,
) {
  const hw = 22;
  /* connection dots */
  dot(svg, rc, cx - hw, cy);
  dot(svg, rc, cx + hw, cy);
  if (on) {
    svg.appendChild(
      rc.line(cx - hw, cy, cx + hw, cy, {
        ...RO,
        stroke: PENCIL,
        strokeWidth: 3,
      }),
    );
  } else {
    svg.appendChild(
      rc.line(cx - hw, cy, cx + hw - 4, cy - 16, {
        ...RO,
        stroke: RED,
        strokeWidth: 2.5,
      }),
    );
  }
  txt(svg, cx, cy - 28, label, 15, "700");
  txt(svg, cx, cy + 20, on ? "ON" : "OFF", 11, "400", on ? LIVE : DEAD);
}

function bulb(svg: SVGSVGElement, rc: RC, cx: number, cy: number, on: boolean) {
  svg.appendChild(
    rc.circle(cx, cy, 26, {
      ...RO,
      fill: on ? BULB_ON : BULB_OFF,
      fillStyle: "solid",
      stroke: PENCIL,
      strokeWidth: 2.5,
    }),
  );
  if (on) {
    svg.appendChild(
      rc.line(cx - 5, cy - 5, cx + 5, cy + 5, {
        ...RO,
        stroke: "#e6a817",
        strokeWidth: 2,
      }),
    );
    svg.appendChild(
      rc.line(cx + 5, cy - 5, cx - 5, cy + 5, {
        ...RO,
        stroke: "#e6a817",
        strokeWidth: 2,
      }),
    );
  }
  txt(svg, cx, cy + 24, on ? "ON" : "OFF", 12, "700", on ? LIVE : RED);
}

function notBubble(svg: SVGSVGElement, rc: RC, cx: number, cy: number) {
  svg.appendChild(
    rc.circle(cx, cy, 12, {
      ...RO,
      fill: "#fff",
      fillStyle: "solid",
      stroke: PENCIL,
      strokeWidth: 2,
    }),
  );
  txt(svg, cx, cy + 4, "¬", 12, "700");
}

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

/* ── Layout functions ── */

function layoutSeries(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const n = switches.length;
  const gap = Math.min(100, 220 / n);
  const startX = 180 - ((n - 1) * gap) / 2;
  const y = 65;

  /* wires & switches */
  wire(
    svg,
    rc,
    [
      [30, y],
      [startX - 25, y],
    ],
    result,
  );
  for (let i = 0; i < n; i++) {
    const cx = startX + i * gap;
    if (i > 0) {
      wire(
        svg,
        rc,
        [
          [startX + (i - 1) * gap + 25, y],
          [cx - 25, y],
        ],
        result,
      );
    }
    sw(svg, rc, cx, y, switches[i]![0], switches[i]![1]);
  }
  wire(
    svg,
    rc,
    [
      [startX + (n - 1) * gap + 25, y],
      [335, y],
    ],
    result,
  );

  /* loop back */
  wire(
    svg,
    rc,
    [
      [335, y],
      [335, 135],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [335, 135],
      [30, 135],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [30, 135],
      [30, y],
    ],
    result,
  );

  bulb(svg, rc, 335, 100, result);
  txt(svg, 30, 105, "+", 18, "700", PENCIL);
  txt(svg, 30, 118, "−", 18, "700", PENCIL);
}

function layoutParallel(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const n = switches.length;
  const topY = n <= 2 ? 45 : 30;
  const gap = n <= 2 ? 65 : 45;
  const midX = 180;
  const forkX = 75;
  const joinX = 285;
  const baseY = topY + ((n - 1) * gap) / 2;

  /* main wire in & out */
  wire(
    svg,
    rc,
    [
      [30, baseY],
      [forkX, baseY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [joinX, baseY],
      [345, baseY],
    ],
    result,
  );

  /* fork to each branch */
  for (let i = 0; i < n; i++) {
    const by = topY + i * gap;
    const swOn = switches[i]![1];
    const branchLive = swOn; // any ON switch makes result true in OR
    wire(
      svg,
      rc,
      [
        [forkX, baseY],
        [forkX, by],
      ],
      result,
    );
    wire(
      svg,
      rc,
      [
        [forkX, by],
        [midX - 25, by],
      ],
      branchLive,
    );
    sw(svg, rc, midX, by, switches[i]![0], swOn);
    wire(
      svg,
      rc,
      [
        [midX + 25, by],
        [joinX, by],
      ],
      branchLive,
    );
    wire(
      svg,
      rc,
      [
        [joinX, by],
        [joinX, baseY],
      ],
      result,
    );
  }

  /* junction dots */
  dot(svg, rc, forkX, baseY);
  dot(svg, rc, joinX, baseY);

  bulb(svg, rc, 345, baseY, result);
  txt(svg, 30, baseY + 5, "+", 16, "700");
}

function layoutNot(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const y = 70;
  /* input wire */
  wire(
    svg,
    rc,
    [
      [40, y],
      [140, y],
    ],
    !result,
  );
  txt(svg, 90, y - 16, switches[0]?.[0]?.split("→")[0] ?? "A", 16, "700");

  /* NOT gate triangle */
  svg.appendChild(
    rc.polygon(
      [
        [145, y - 20],
        [195, y],
        [145, y + 20],
      ],
      {
        ...RO,
        stroke: PENCIL,
        strokeWidth: 2.5,
        fill: "#fff",
        fillStyle: "solid",
      },
    ),
  );
  notBubble(svg, rc, 203, y);

  /* output wire */
  wire(
    svg,
    rc,
    [
      [210, y],
      [310, y],
    ],
    result,
  );
  txt(svg, 260, y - 16, "OUT", 14, "400", result ? LIVE : DEAD);

  bulb(svg, rc, 330, y, result);
}

function layoutDoubleNot(
  svg: SVGSVGElement,
  rc: RC,
  _switches: [string, boolean][],
  result: boolean,
) {
  const y = 70;
  wire(
    svg,
    rc,
    [
      [30, y],
      [90, y],
    ],
    true,
  );
  txt(svg, 60, y - 16, "A", 16, "700");

  /* first NOT */
  svg.appendChild(
    rc.polygon(
      [
        [95, y - 16],
        [135, y],
        [95, y + 16],
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
  notBubble(svg, rc, 142, y);

  wire(
    svg,
    rc,
    [
      [149, y],
      [185, y],
    ],
    false,
  );
  txt(svg, 167, y - 16, "A'", 14, "400", DEAD);

  /* second NOT */
  svg.appendChild(
    rc.polygon(
      [
        [190, y - 16],
        [230, y],
        [190, y + 16],
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
  notBubble(svg, rc, 237, y);

  wire(
    svg,
    rc,
    [
      [244, y],
      [310, y],
    ],
    true,
  );
  txt(svg, 277, y - 16, "A", 14, "700", LIVE);

  bulb(svg, rc, 330, y, result);
}

/* A · (B + C) : A in series with B||C */
function layoutAAndBoc(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const y = 70;
  /* wire in → switch A */
  wire(
    svg,
    rc,
    [
      [30, y],
      [75, y],
    ],
    result,
  );
  sw(svg, rc, 100, y, switches[0]![0], switches[0]![1]);
  wire(
    svg,
    rc,
    [
      [125, y],
      [160, y],
    ],
    result,
  );

  /* parallel B, C */
  const topY = 45;
  const botY = 95;
  const forkX = 160;
  const joinX = 275;

  wire(
    svg,
    rc,
    [
      [forkX, y],
      [forkX, topY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [forkX, topY],
      [195, topY],
    ],
    switches[1]![1],
  );
  sw(svg, rc, 218, topY, switches[1]![0], switches[1]![1]);
  wire(
    svg,
    rc,
    [
      [241, topY],
      [joinX, topY],
    ],
    switches[1]![1],
  );

  wire(
    svg,
    rc,
    [
      [forkX, y],
      [forkX, botY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [forkX, botY],
      [195, botY],
    ],
    switches[2]![1],
  );
  sw(svg, rc, 218, botY, switches[2]![0], switches[2]![1]);
  wire(
    svg,
    rc,
    [
      [241, botY],
      [joinX, botY],
    ],
    switches[2]![1],
  );

  wire(
    svg,
    rc,
    [
      [joinX, topY],
      [joinX, y],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [joinX, botY],
      [joinX, y],
    ],
    result,
  );

  dot(svg, rc, forkX, y);
  dot(svg, rc, joinX, y);

  wire(
    svg,
    rc,
    [
      [joinX, y],
      [340, y],
    ],
    result,
  );
  bulb(svg, rc, 345, y, result);
}

/* A + (A·B) : A parallel with (A series B) */
function layoutAOrAb(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const topY = 45;
  const botY = 100;
  const midY = 72;
  const forkX = 80;
  const joinX = 290;

  wire(
    svg,
    rc,
    [
      [30, midY],
      [forkX, midY],
    ],
    result,
  );

  /* top: A alone */
  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, topY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [forkX, topY],
      [160, topY],
    ],
    switches[0]![1],
  );
  sw(svg, rc, 185, topY, switches[0]![0], switches[0]![1]);
  wire(
    svg,
    rc,
    [
      [210, topY],
      [joinX, topY],
    ],
    switches[0]![1],
  );
  wire(
    svg,
    rc,
    [
      [joinX, topY],
      [joinX, midY],
    ],
    result,
  );

  /* bottom: A series B */
  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, botY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [forkX, botY],
      [125, botY],
    ],
    false,
  );
  sw(svg, rc, 148, botY, switches[1]![0], switches[1]![1]);
  wire(
    svg,
    rc,
    [
      [171, botY],
      [200, botY],
    ],
    false,
  );
  sw(svg, rc, 223, botY, switches[2]![0], switches[2]![1]);
  wire(
    svg,
    rc,
    [
      [246, botY],
      [joinX, botY],
    ],
    false,
  );
  wire(
    svg,
    rc,
    [
      [joinX, botY],
      [joinX, midY],
    ],
    result,
  );

  dot(svg, rc, forkX, midY);
  dot(svg, rc, joinX, midY);

  wire(
    svg,
    rc,
    [
      [joinX, midY],
      [340, midY],
    ],
    result,
  );
  bulb(svg, rc, 345, midY, result);
}

/* A · (A + B) : A in series with (A || B) */
function layoutAAndAob(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const y = 70;
  wire(
    svg,
    rc,
    [
      [30, y],
      [58, y],
    ],
    result,
  );
  sw(svg, rc, 80, y, switches[0]![0], switches[0]![1]);
  wire(
    svg,
    rc,
    [
      [102, y],
      [140, y],
    ],
    result,
  );

  const topY = 45;
  const botY = 100;
  const forkX = 140;
  const joinX = 280;

  wire(
    svg,
    rc,
    [
      [forkX, y],
      [forkX, topY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [forkX, topY],
      [190, topY],
    ],
    switches[1]![1],
  );
  sw(svg, rc, 210, topY, switches[1]![0], switches[1]![1]);
  wire(
    svg,
    rc,
    [
      [230, topY],
      [joinX, topY],
    ],
    switches[1]![1],
  );

  wire(
    svg,
    rc,
    [
      [forkX, y],
      [forkX, botY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [forkX, botY],
      [190, botY],
    ],
    switches[2]![1],
  );
  sw(svg, rc, 210, botY, switches[2]![0], switches[2]![1]);
  wire(
    svg,
    rc,
    [
      [230, botY],
      [joinX, botY],
    ],
    switches[2]![1],
  );

  wire(
    svg,
    rc,
    [
      [joinX, topY],
      [joinX, y],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [joinX, botY],
      [joinX, y],
    ],
    result,
  );
  dot(svg, rc, forkX, y);
  dot(svg, rc, joinX, y);

  wire(
    svg,
    rc,
    [
      [joinX, y],
      [340, y],
    ],
    result,
  );
  bulb(svg, rc, 345, y, result);
}

/* NAND: series + NOT bubble */
function layoutNand(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const y = 65;
  wire(
    svg,
    rc,
    [
      [30, y],
      [100, y],
    ],
    true,
  );
  sw(svg, rc, 125, y, switches[0]![0], switches[0]![1]);
  wire(
    svg,
    rc,
    [
      [150, y],
      [175, y],
    ],
    true,
  );
  sw(svg, rc, 200, y, switches[1]![0], switches[1]![1]);
  wire(
    svg,
    rc,
    [
      [225, y],
      [250, y],
    ],
    true,
  );

  notBubble(svg, rc, 260, y);
  txt(svg, 260, y - 18, "NOT", 11, "400", PENCIL);

  wire(
    svg,
    rc,
    [
      [268, y],
      [325, y],
    ],
    result,
  );
  bulb(svg, rc, 340, y, result);

  wire(
    svg,
    rc,
    [
      [340, y + 13],
      [340, 135],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [340, 135],
      [30, 135],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [30, 135],
      [30, y],
    ],
    result,
  );
}

/* NOR: parallel + NOT bubble */
function layoutNor(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const topY = 45;
  const botY = 90;
  const midY = 67;
  const forkX = 70;
  const joinX = 230;

  wire(
    svg,
    rc,
    [
      [30, midY],
      [forkX, midY],
    ],
    true,
  );

  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, topY],
    ],
    true,
  );
  wire(
    svg,
    rc,
    [
      [forkX, topY],
      [125, topY],
    ],
    switches[0]![1],
  );
  sw(svg, rc, 150, topY, switches[0]![0], switches[0]![1]);
  wire(
    svg,
    rc,
    [
      [175, topY],
      [joinX, topY],
    ],
    switches[0]![1],
  );
  wire(
    svg,
    rc,
    [
      [joinX, topY],
      [joinX, midY],
    ],
    true,
  );

  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, botY],
    ],
    true,
  );
  wire(
    svg,
    rc,
    [
      [forkX, botY],
      [125, botY],
    ],
    switches[1]![1],
  );
  sw(svg, rc, 150, botY, switches[1]![0], switches[1]![1]);
  wire(
    svg,
    rc,
    [
      [175, botY],
      [joinX, botY],
    ],
    switches[1]![1],
  );
  wire(
    svg,
    rc,
    [
      [joinX, botY],
      [joinX, midY],
    ],
    true,
  );

  dot(svg, rc, forkX, midY);
  dot(svg, rc, joinX, midY);

  wire(
    svg,
    rc,
    [
      [joinX, midY],
      [260, midY],
    ],
    true,
  );
  notBubble(svg, rc, 270, midY);
  txt(svg, 270, midY - 18, "NOT", 11, "400");

  wire(
    svg,
    rc,
    [
      [278, midY],
      [325, midY],
    ],
    result,
  );
  bulb(svg, rc, 340, midY, result);
}

/* XOR: cross-path circuit */
function layoutXor(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const topY = 40;
  const botY = 100;
  const midY = 70;
  const forkX = 70;
  const joinX = 300;
  const sA = switches[0]![1];
  const sB = switches[1]![1];

  /* path 1: A AND NOT B → top */
  const p1 = sA && !sB;
  /* path 2: NOT A AND B → bottom */
  const p2 = !sA && sB;

  wire(
    svg,
    rc,
    [
      [30, midY],
      [forkX, midY],
    ],
    true,
  );

  /* top path */
  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, topY],
    ],
    true,
  );
  wire(
    svg,
    rc,
    [
      [forkX, topY],
      [118, topY],
    ],
    p1,
  );
  sw(svg, rc, 140, topY, switches[0]![0], sA);
  wire(
    svg,
    rc,
    [
      [162, topY],
      [195, topY],
    ],
    p1,
  );
  sw(svg, rc, 218, topY, switches[1]![0] + "'", !sB);
  wire(
    svg,
    rc,
    [
      [241, topY],
      [joinX, topY],
    ],
    p1,
  );

  /* bottom path */
  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, botY],
    ],
    true,
  );
  wire(
    svg,
    rc,
    [
      [forkX, botY],
      [118, botY],
    ],
    p2,
  );
  sw(svg, rc, 140, botY, switches[0]![0] + "'", !sA);
  wire(
    svg,
    rc,
    [
      [162, botY],
      [195, botY],
    ],
    p2,
  );
  sw(svg, rc, 218, botY, switches[1]![0], sB);
  wire(
    svg,
    rc,
    [
      [241, botY],
      [joinX, botY],
    ],
    p2,
  );

  wire(
    svg,
    rc,
    [
      [joinX, topY],
      [joinX, midY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [joinX, botY],
      [joinX, midY],
    ],
    result,
  );
  dot(svg, rc, forkX, midY);
  dot(svg, rc, joinX, midY);

  wire(
    svg,
    rc,
    [
      [joinX, midY],
      [345, midY],
    ],
    result,
  );
  bulb(svg, rc, 350, midY, result);
}

/* XNOR: non-crossed parallel paths (AB + A'B') */
function layoutXnor(
  svg: SVGSVGElement,
  rc: RC,
  switches: [string, boolean][],
  result: boolean,
) {
  const topY = 40;
  const botY = 100;
  const midY = 70;
  const forkX = 70;
  const joinX = 300;
  const sA = switches[0]![1];
  const sB = switches[1]![1];

  /* path 1: A AND B → top */
  const p1 = sA && sB;
  /* path 2: NOT A AND NOT B → bottom */
  const p2 = !sA && !sB;

  wire(
    svg,
    rc,
    [
      [30, midY],
      [forkX, midY],
    ],
    true,
  );

  /* top path: A, B */
  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, topY],
    ],
    true,
  );
  wire(
    svg,
    rc,
    [
      [forkX, topY],
      [118, topY],
    ],
    p1,
  );
  sw(svg, rc, 140, topY, switches[0]![0], sA);
  wire(
    svg,
    rc,
    [
      [162, topY],
      [195, topY],
    ],
    p1,
  );
  sw(svg, rc, 218, topY, switches[1]![0], sB);
  wire(
    svg,
    rc,
    [
      [241, topY],
      [joinX, topY],
    ],
    p1,
  );

  /* bottom path: A', B' */
  wire(
    svg,
    rc,
    [
      [forkX, midY],
      [forkX, botY],
    ],
    true,
  );
  wire(
    svg,
    rc,
    [
      [forkX, botY],
      [118, botY],
    ],
    p2,
  );
  sw(svg, rc, 140, botY, switches[0]![0] + "'", !sA);
  wire(
    svg,
    rc,
    [
      [162, botY],
      [195, botY],
    ],
    p2,
  );
  sw(svg, rc, 218, botY, switches[1]![0] + "'", !sB);
  wire(
    svg,
    rc,
    [
      [241, botY],
      [joinX, botY],
    ],
    p2,
  );

  wire(
    svg,
    rc,
    [
      [joinX, topY],
      [joinX, midY],
    ],
    result,
  );
  wire(
    svg,
    rc,
    [
      [joinX, botY],
      [joinX, midY],
    ],
    result,
  );
  dot(svg, rc, forkX, midY);
  dot(svg, rc, joinX, midY);

  wire(
    svg,
    rc,
    [
      [joinX, midY],
      [345, midY],
    ],
    result,
  );
  bulb(svg, rc, 350, midY, result);
}

/* ── Dispatch ── */

const LAYOUTS: Record<
  string,
  (
    svg: SVGSVGElement,
    rc: RC,
    switches: [string, boolean][],
    result: boolean,
  ) => void
> = {
  series: layoutSeries,
  parallel: layoutParallel,
  not: layoutNot,
  "double-not": layoutDoubleNot,
  "a-and-boc": layoutAAndBoc,
  "a-or-ab": layoutAOrAb,
  "a-and-aob": layoutAAndAob,
  nand: layoutNand,
  nor: layoutNor,
  xor: layoutXor,
  xnor: layoutXnor,
};

/* ── Component ── */

export function CircuitDiagram({ config }: { config: CircuitConfig }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.replaceChildren();

    const rc = rough.svg(svg);
    const layout = LAYOUTS[config.type];
    if (layout) {
      layout(svg, rc, config.switches, config.result);
    }
  }, [config]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="电路图"
    />
  );
}
