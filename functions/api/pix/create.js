// Cloudflare Pages Function — /api/pix/create
// Proteção por IP: máximo 5 tentativas por hora por IP usando Cloudflare KV
// Roteia para IronPay, MasterFy, UmbrellaPag ou Venus Pay conforme o gateway PIX
// ativo no painel admin.
//
// Fluxo:
//   1. Rate limit por IP (KV binding: PIX_RATELIMIT)
//   2. Consulta qual gateway PIX está ativo (Supabase → payment_gateways)
//   3. Delega para ironpay.js, masterfy.js, umbrellapag.js ou venuspay.js

import { getActivePixGateway } from "../../_lib/gateway-config.js";
import { createPixIronpay } from "../../_lib/pix-gateways/ironpay.js";
import { createPixMasterfy } from "../../_lib/pix-gateways/masterfy.js";
import { createPixUmbrellapag } from "../../_lib/pix-gateways/umbrellapag.js";
import { createPixVenuspay } from "../../_lib/pix-gateways/venuspay.js";
import { getLeadById, savePixLead } from "../../_lib/leads-store.js";
import { sendUtmifyOrder } from "../../_lib/utmify.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

const LIMITE_TENTATIVAS = 5;      // máximo de PIX por IP
const JANELA_SEGUNDOS   = 3600;   // janela de 1 hora (em segundos)

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === "OPTIONS") {
    return new Response("", { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

  // ──────────────────────────────────────────────────────────────
  // PROTEÇÃO POR IP — Cloudflare KV
  // ──────────────────────────────────────────────────────────────
  if (env.PIX_RATELIMIT) {
    // CF-Connecting-IP é o IP real do visitante injetado pelo Cloudflare
    const ip = request.headers.get("CF-Connecting-IP") ||
               request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
               "unknown";

    const kvKey = `ratelimit:pix:${ip}`;

    try {
      // Lê o contador atual (retorna null se não existe)
      const atual = await env.PIX_RATELIMIT.get(kvKey);
      const contagem = atual ? parseInt(atual, 10) : 0;

      if (contagem >= LIMITE_TENTATIVAS) {
        console.log(`[RATE LIMIT] IP bloqueado: ${ip} — ${contagem} tentativas`);
        return new Response(
          JSON.stringify({
            error: "Muitas tentativas. Aguarde 1 hora antes de tentar novamente.",
            bloqueado: true,
          }),
          { status: 429, headers: corsHeaders }
        );
      }

      // Incrementa o contador; se for a primeira vez, define o TTL de 1 hora
      await env.PIX_RATELIMIT.put(kvKey, String(contagem + 1), {
        expirationTtl: JANELA_SEGUNDOS,
      });

      console.log(`[RATE LIMIT] IP: ${ip} — tentativa ${contagem + 1}/${LIMITE_TENTATIVAS}`);
    } catch (kvErr) {
      // Se o KV falhar por algum motivo, não bloqueia o cliente (fail open)
      console.error("[RATE LIMIT] Erro ao verificar KV:", kvErr);
    }
  }
  // ──────────────────────────────────────────────────────────────

  // ── Parse do body (lido uma vez aqui e repassado ao provider) ──
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "JSON invalido." }), { status: 400, headers: corsHeaders });
  }

  let order;
  try {
    order = await getLeadById(env, body.orderId);
  } catch {
    return new Response(JSON.stringify({ error: "Não foi possível validar o pedido." }), { status: 502, headers: corsHeaders });
  }
  if (!order || order.metodo_pagamento !== "pix" || order.status !== "checkout_iniciado") {
    return new Response(JSON.stringify({ error: "Pedido PIX inválido ou já processado." }), { status: 409, headers: corsHeaders });
  }
  const safeBody = {
    ...body,
    amount: Number(order.valor),
    productName: order.produtos,
  };

  // ── Roteamento de gateway PIX (configurado no painel /admin) ──
  const activeGateway = await getActivePixGateway(env);

  if (!activeGateway) {
    return new Response(
      JSON.stringify({ error: "Nenhum gateway PIX ativo. Ative um gateway no painel admin." }),
      { status: 503, headers: corsHeaders }
    );
  }

  let response;
  if (activeGateway === "masterfy") response = await createPixMasterfy(context, corsHeaders, safeBody);
  else if (activeGateway === "umbrellapag") response = await createPixUmbrellapag(context, corsHeaders, safeBody);
  else if (activeGateway === "venuspay_pix") response = await createPixVenuspay(context, corsHeaders, safeBody);
  else response = await createPixIronpay(context, corsHeaders, safeBody);

  if (!response.ok) return response;
  try {
    const result = await response.clone().json();
    await savePixLead(env, safeBody, result, activeGateway);
    try {
      await sendUtmifyOrder(env, {
        orderId: result.transactionId,
        status: "waiting_payment",
        paymentMethod: "pix",
        customerName: safeBody.name,
        customerEmail: safeBody.email,
        customerPhone: String(safeBody.phone || "").replace(/\D/g, ""),
        customerDocument: safeBody.document || null,
        productName: safeBody.productName,
        valueInCents: Math.round(Number(safeBody.amount) * 100),
        tracking: safeBody.tracking,
      });
    } catch (trackingError) {
      console.error("[pix/create] Falha ao registrar PIX na UTMify:", trackingError?.message);
    }
  } catch (persistError) {
    console.error("[pix/create] PIX criado, mas não foi possível vinculá-lo ao pedido:", persistError?.message);
    return new Response(JSON.stringify({ error: "PIX gerado, mas o pedido não pôde ser registrado. Tente novamente." }), { status: 502, headers: corsHeaders });
  }
  return response;
}
