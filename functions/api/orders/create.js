import { createCheckoutLead } from "../../_lib/leads-store.js";

const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });

export async function onRequest({ request, env }) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON inválido." }, 400); }
  const method = body?.paymentMethod === "card" ? "card" : "pix";
  if (!body?.name || !body?.email || !body?.amount || !body?.productName) {
    return json({ error: "Dados obrigatórios do pedido não informados." }, 400);
  }
  try {
    const lead = await createCheckoutLead(env, body, method);
    return json({ ok: true, orderId: lead.id, tracking: lead.tracking }, 201);
  } catch (error) {
    console.error("[orders/create] Falha ao salvar pedido:", error?.message);
    return json({ error: "Não foi possível registrar o pedido. Tente novamente." }, 502);
  }
}
