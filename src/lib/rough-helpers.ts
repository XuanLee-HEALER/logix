import rough from "roughjs";

/* ── Shared color palette for hand-drawn circuit diagrams ── */
export const LIVE = "#2d5da1";
export const DEAD = "#c4bfb6";
export const PENCIL = "#2d2d2d";
export const RED = "#ff4d4d";
export const BULB_ON = "#fff9c4";
export const BULB_OFF = "#e5e0d8";

/* ── RoughJS shared options ── */
export const RO = { roughness: 1.4, bowing: 1.2, seed: 42 };

export type RC = ReturnType<typeof rough.svg>;

/* ── Combining overline (\u0305) is unreliable on mobile browsers.
   Strip it and use text-decoration: overline instead. ── */
const OVERLINE_RE = /(.)\u0305/g;

/** Split a string into segments: plain text and overlined characters. */
export function parseOverline(s: string): { text: string; over: boolean }[] {
  const parts: { text: string; over: boolean }[] = [];
  let last = 0;
  for (const m of s.matchAll(OVERLINE_RE)) {
    if (m.index! > last)
      parts.push({ text: s.slice(last, m.index!), over: false });
    parts.push({ text: m[1]!, over: true });
    last = m.index! + m[0].length;
  }
  if (last < s.length) parts.push({ text: s.slice(last), over: false });
  return parts;
}

/* ── SVG text helper ── */
export function txt(
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

  const parts = parseOverline(content);
  if (parts.length === 1 && !parts[0]!.over) {
    el.textContent = content;
  } else {
    for (const p of parts) {
      const tspan = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "tspan",
      );
      tspan.textContent = p.text;
      if (p.over) tspan.setAttribute("text-decoration", "overline");
      el.appendChild(tspan);
    }
  }
  svg.appendChild(el);
}

/* ── Collect roughjs-drawn elements into a target group ── */
export function collectInto(
  svg: SVGSVGElement,
  target: SVGGElement,
  drawFn: () => void,
) {
  const tmp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  // Temporarily redirect roughjs output to a detached SVG
  const origAppend = svg.appendChild.bind(svg);
  svg.appendChild = <T extends Node>(node: T): T => {
    tmp.appendChild(node);
    return node;
  };
  drawFn();
  svg.appendChild = origAppend;
  // Move collected nodes into the target group
  while (tmp.firstChild) {
    target.appendChild(tmp.firstChild);
  }
}
