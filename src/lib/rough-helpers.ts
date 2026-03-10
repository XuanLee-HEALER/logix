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
  el.textContent = content;
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
