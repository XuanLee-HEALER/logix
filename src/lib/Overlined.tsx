import { parseOverline } from "./rough-helpers";

/**
 * Renders a string that may contain combining overline (\u0305) using
 * CSS text-decoration instead, for reliable mobile browser rendering.
 */
export function Overlined({ text }: { text: string }) {
  const parts = parseOverline(text);
  if (parts.length === 1 && !parts[0]!.over) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.over ? (
          <span key={i} style={{ textDecoration: "overline" }}>
            {p.text}
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
