/** Configuração de gateways — Supabase (tabela payment_gateways) com fallback padrão. */

const DEFAULT_GATEWAYS = [
  { id: "ironpay", name: "IronPay", method: "pix", enabled: true },
  { id: "masterfy", name: "MasterFy", method: "pix", enabled: false },
  { id: "umbrellapag", name: "UmbrellaPag", method: "pix", enabled: false },
  { id: "venuspay", name: "Venus Pay", method: "card", enabled: true },
  { id: "venuspay_pix", name: "Venus Pay", method: "pix", enabled: false },
];

function supabaseHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function supabaseFetch(env, path, options = {}) {
  const url = (env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return null;

  const res = await fetch(`${url}${path}`, {
    ...options,
    headers: { ...supabaseHeaders(key), ...(options.headers || {}) },
  });

  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export function gatewayConfigured(env, id) {
  if (id === "ironpay") {
    return [env.IRONPAY_API_TOKEN, env.IRONPAY_OFFER_HASH, env.IRONPAY_PRODUCT_HASH]
      .every((value) => String(value || "").trim());
  }
  if (id === "masterfy") {
    return !!String(env.MASTERFY_API_KEY || "").trim();
  }
  if (id === "umbrellapag") {
    return !!String(env.UMBRELLAPAG_API_KEY || "").trim();
  }
  // Cartão e PIX da Venus Pay usam a mesma credencial
  if (id === "venuspay" || id === "venuspay_pix") {
    return !!String(env.VENUS_PAY_SECRET_KEY || "").trim();
  }
  return false;
}

export async function listGateways(env) {
  const rows = await supabaseFetch(env, "/rest/v1/payment_gateways?select=id,name,method,enabled,updated_at&order=method,id");
  const saved = Array.isArray(rows) ? rows : [];
  const savedById = new Map(saved.map((gateway) => [gateway.id, gateway]));
  const source = DEFAULT_GATEWAYS.map((gateway) => ({
    ...gateway,
    ...(savedById.get(gateway.id) || {}),
  }));

  return source.map((g) => ({
    id: g.id,
    name: g.name,
    method: g.method,
    enabled: !!g.enabled,
    configured: gatewayConfigured(env, g.id),
    updated_at: g.updated_at || null,
  }));
}

export async function getActivePixGateway(env) {
  const gateways = await listGateways(env);
  const activeConfigured = gateways.find((g) => g.method === "pix" && g.enabled && g.configured);
  if (activeConfigured) return activeConfigured.id;

  // Recupera automaticamente uma configuração válida quando o banco ainda
  // aponta para um gateway antigo ou sem as credenciais necessárias.
  const configuredFallback = gateways.find((g) => g.method === "pix" && g.configured);
  return configuredFallback?.id ?? null;
}

export async function setGatewayEnabled(env, id, enabled) {
  const url = (env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  const key = (env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) {
    throw new Error("Supabase não configurado. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  }

  const all = await listGateways(env);
  const target = all.find((g) => g.id === id);
  if (!target) throw new Error("Gateway não encontrado.");

  const headers = supabaseHeaders(key);

  if (enabled && target.method === "pix") {
    const otherPix = all.filter((g) => g.method === "pix" && g.id !== id && g.enabled);
    for (const g of otherPix) {
      await fetch(`${url}/rest/v1/payment_gateways?id=eq.${encodeURIComponent(g.id)}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ enabled: false, updated_at: new Date().toISOString() }),
      });
    }
  }

  const res = await fetch(`${url}/rest/v1/payment_gateways?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ enabled: !!enabled, updated_at: new Date().toISOString() }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(err || "Erro ao atualizar gateway.");
  }

  return listGateways(env);
}
