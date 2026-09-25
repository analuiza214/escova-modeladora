// Exposes only the public pixel identifier, never the conversion API token.
export function onRequest({ request, env }) {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }
  const pixelId = String(env.FB_PIXEL_ID || "").trim();
  return new Response(JSON.stringify({ facebookPixelId: /^\d+$/.test(pixelId) ? pixelId : null }), { headers });
}
