import { getPreferences, setPreferences } from "./db";
import type { Preferences } from "./db";

const DIST = "./dist";
const port = Number(process.env.PORT) || 3000;

function getClientIP(
  req: Request,
  server: { requestIP(req: Request): { address: string } | null },
): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return server.requestIP(req)?.address ?? "unknown";
}

function isValidPreferences(body: unknown): body is Preferences {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.topicOrder)) return false;
  if (!b.topicOrder.every((v: unknown) => typeof v === "string")) return false;
  if (typeof b.columns !== "number" || ![2, 3, 4].includes(b.columns))
    return false;
  return true;
}

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // API: preferences
    if (url.pathname === "/api/preferences") {
      const ip = getClientIP(req, server);

      if (req.method === "GET") {
        const prefs = getPreferences(ip);
        return Response.json(prefs ?? {});
      }

      if (req.method === "PUT") {
        const body = await req.json().catch(() => null);
        if (!isValidPreferences(body)) {
          return Response.json({ error: "invalid body" }, { status: 400 });
        }
        setPreferences(ip, body);
        return Response.json({ ok: true });
      }

      return new Response("Method Not Allowed", { status: 405 });
    }

    // Static files
    const filePath = `${DIST}${url.pathname}`;
    const file = Bun.file(filePath);
    if (await file.exists()) {
      const headers: Record<string, string> = {};
      // Cache hashed assets aggressively
      if (url.pathname.startsWith("/assets/")) {
        headers["Cache-Control"] = "public, max-age=2592000, immutable";
      }
      return new Response(file, { headers });
    }

    // SPA fallback
    return new Response(Bun.file(`${DIST}/index.html`), {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.log(`Logix server listening on :${server.port}`);
