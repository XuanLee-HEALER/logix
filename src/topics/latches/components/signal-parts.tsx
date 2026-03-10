import { LIVE, DEAD, PENCIL, RED, parseOverline } from "@/lib/rough-helpers";

export function Wire({
  points,
  live,
}: {
  points: [number, number][];
  live: boolean;
}) {
  if (points.length < 2) return null;

  const segments = [];
  for (let i = 0; i < points.length - 1; i++) {
    segments.push(
      <line
        key={i}
        x1={points[i]![0]}
        y1={points[i]![1]}
        x2={points[i + 1]![0]}
        y2={points[i + 1]![1]}
        stroke={live ? LIVE : DEAD}
        strokeWidth={live ? 2.5 : 2}
        strokeLinecap="round"
        style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
      />,
    );
  }
  return <>{segments}</>;
}

export function OutputDot({
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
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill={forbidden ? RED : isOn ? LIVE : DEAD}
        stroke={PENCIL}
        strokeWidth={2}
        style={{ transition: "fill 0.3s" }}
        className={forbidden ? "animate-forbidden-blink" : undefined}
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
        {parseOverline(label).map((p, i) =>
          p.over ? (
            <tspan key={i} textDecoration="overline">
              {p.text}
            </tspan>
          ) : (
            <tspan key={i}>{p.text}</tspan>
          ),
        )}
      </text>
    </g>
  );
}

export function SignalDot({
  cx,
  cy,
  live,
}: {
  cx: number;
  cy: number;
  live: boolean;
}) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3.5}
      fill={live ? LIVE : DEAD}
      style={{ transition: "fill 0.3s" }}
    />
  );
}
