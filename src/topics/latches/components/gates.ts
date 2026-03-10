import { PENCIL, RO, txt, type RC } from "@/lib/rough-helpers";

export function drawNorGate(svg: SVGSVGElement, rc: RC, x: number, y: number) {
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

  txt(svg, x + w / 2 - 2, y + 5, "NOR", 11, "700");
}

export function drawNandGate(svg: SVGSVGElement, rc: RC, x: number, y: number) {
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

export function drawAndGate(svg: SVGSVGElement, rc: RC, x: number, y: number) {
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

export function drawNotTriangle(
  svg: SVGSVGElement,
  rc: RC,
  x: number,
  y: number,
) {
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
