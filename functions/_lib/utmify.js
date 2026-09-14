function trackingParams(tracking) {
  const source = tracking && typeof tracking === "object" ? tracking : {};
  return {
    src: null,
    sck: null,
    utm_source: source.utm_source || null,
    utm_campaign: source.utm_campaign || null,
    utm_medium: source.utm_medium || null,
    utm_content: source.utm_content || null,
    utm_term: source.utm_term || null,
  };
}

export async function sendUtmifyOrder(env, order) {
  const token = String(env.UTMIFY_API_TOKEN || "").trim();
  if (!token) throw new Error("UTMIFY_API_TOKEN não configurado.");

  const status = String(order.status || "paid").toLowerCase();
  const now = new Date().toISOString();
  const valueInCents = Math.max(0, Math.round(Number(order.valueInCents || 0)));
  const payload = {
    orderId: String(order.orderId || `topmix_${Date.now()}`),
    platform: "other",
    paymentMethod: order.paymentMethod || "pix",
    status,
    createdAt: order.createdAt || now,
    approvedDate: status === "paid" ? (order.paidAt || now) : null,
    refundedAt: null,
    customer: {
      name: order.customerName || "Cliente",
      email: order.customerEmail || "sem-email@topmix.com.br",
      phone: order.customerPhone || null,
      document: order.customerDocument || null,
      country: "BR",
    },
    products: [{
      id: "topmix_figurinhas",
      name: order.productName || "Kit Escova Secadora",
      planId: "topmix_figurinhas",
      planName: order.productName || "Kit Escova Secadora",
      quantity: 1,
      priceInCents: valueInCents,
    }],
    trackingParameters: trackingParams(order.tracking),
    commission: {
      totalPriceInCents: valueInCents,
      gatewayFeeInCents: 0,
      userCommissionInCents: valueInCents,
    },
    isTest: false,
  };

  const response = await fetch("https://api.utmify.com.br/api-credentials/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-token": token },
    body: JSON.stringify(payload),
  });
  const responseText = await response.text();
  if (!response.ok) throw new Error(`UTMify respondeu ${response.status}: ${responseText}`);
  return { status: response.status, body: responseText };
}
