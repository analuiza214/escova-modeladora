import assert from "node:assert/strict";
import { cardAmount, validateCartItems } from "../functions/_lib/catalog.js";
import { onRequest as createOrder } from "../functions/api/orders/create.js";
import { onRequest as createCard } from "../functions/api/card/create.js";
import { createPixVenuspay } from "../functions/_lib/pix-gateways/venuspay.js";
import { getActivePixGateway, listGateways } from "../functions/_lib/gateway-config.js";

const whiteBrush = validateCartItems([{ id: "bella-escova-branca", quantity: 1 }], "card");
assert.equal(whiteBrush.amount, 37.9);
assert.equal(whiteBrush.products, "Kit Escova 3 em 1 Branca (x1)");

const pixKit = validateCartItems([{ id: "bella-kit-7-em-1-bege", quantity: 2 }], "pix");
assert.equal(pixKit.amount, 125.82);
assert.equal(cardAmount(69.9, 5), 69.9);
assert.equal(cardAmount(69.9, 6), 83.42);
assert.throws(() => validateCartItems([{ id: "produto-inventado", quantity: 1 }], "pix"));

const originalFetch = globalThis.fetch;

globalThis.fetch = async (url) => {
  if (String(url).includes("payment_gateways")) {
    return new Response(JSON.stringify([
      { id: "ironpay", name: "IronPay", method: "pix", enabled: true },
    ]), { status: 200 });
  }
  throw new Error(`Chamada inesperada no teste: ${url}`);
};

try {
  const env = {
    SUPABASE_URL: "https://supabase.test",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
    VENUS_PAY_SECRET_KEY: "venus-secret-test",
  };
  const gateways = await listGateways(env);
  assert.equal(gateways.some((gateway) => gateway.id === "venuspay_pix"), true);
  await assert.rejects(() => getActivePixGateway(env), /credenciais/);
  globalThis.fetch = async () => new Response(JSON.stringify([
    { id: "venuspay_pix", name: "Venus Pay", method: "pix", enabled: true },
  ]));
  assert.equal(await getActivePixGateway(env), "venuspay_pix");
  globalThis.fetch = async () => new Response("[]");
  assert.equal(await getActivePixGateway(env), null);
  globalThis.fetch = async () => new Response("{}", { status: 503 });
  await assert.rejects(() => getActivePixGateway(env), /consultar/);
} finally {
  globalThis.fetch = originalFetch;
}

const writes = [];
globalThis.fetch = async (_url, options = {}) => {
  if (options.method === "POST") {
    writes.push(JSON.parse(options.body));
    return new Response(JSON.stringify([{ id: "pedido-teste" }]), { status: 201 });
  }
  return new Response("[]", { status: 200 });
};

try {
  const request = new Request("https://bellamix.test/api/orders/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Cliente Teste",
      email: "cliente@example.com",
      phone: "11999999999",
      amount: 0.01,
      productName: "Produto adulterado",
      products: "Produto adulterado",
      paymentMethod: "pix",
      items: [{ id: "bella-escova-branca", quantity: 1 }],
      address: {},
    }),
  });
  const response = await createOrder({
    request,
    env: { SUPABASE_URL: "https://supabase.test", SUPABASE_SERVICE_ROLE_KEY: "service-role-test" },
  });
  assert.equal(response.status, 201);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].valor, 34.11);
  assert.equal(writes[0].produtos, "Kit Escova 3 em 1 Branca (x1)");
} finally {
  globalThis.fetch = originalFetch;
}

let gatewayPayload;
globalThis.fetch = async (url, options = {}) => {
  const address = String(url);
  if (address.includes("payment_gateways")) return new Response("[]", { status: 200 });
  if (address.includes("leads?id=eq.pedido-cartao") && (!options.method || options.method === "GET")) {
    return new Response(JSON.stringify([{
      id: "pedido-cartao",
      valor: 69.9,
      produtos: "Kit 7 em 1 Escova Secadora Bege Bivolt com Caixa e 7 Acessórios (x1)",
      metodo_pagamento: "card",
      status: "checkout_iniciado",
    }]), { status: 200 });
  }
  if (address.includes("process-payment")) {
    gatewayPayload = JSON.parse(options.body);
    return new Response(JSON.stringify({ success: true, status: "processing", transaction_id: "tx-card-1" }), { status: 200 });
  }
  if (address.includes("codigo_rastreio=is.null") || address.includes("purchase_sent=eq.false")) {
    return new Response("[]", { status: 200 });
  }
  if (options.method === "PATCH") return new Response(JSON.stringify([{ id: "pedido-cartao" }]), { status: 200 });
  throw new Error(`Chamada inesperada no teste: ${address}`);
};

try {
  const response = await createCard({
    request: new Request("https://bellamix.test/api/card/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: "pedido-cartao",
        amount: 0.01,
        name: "Cliente Teste",
        email: "cliente@example.com",
        phone: "11999999999",
        productName: "Produto adulterado",
        installments: 6,
        address: {},
        card: {
          number: "4111111111111111",
          holderName: "CLIENTE TESTE",
          expiryMonth: "12",
          expiryYear: "2030",
          cvv: "123",
          cpf: "52998224725",
        },
      }),
    }),
    env: {
      SUPABASE_URL: "https://supabase.test",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
      VENUS_PAY_SECRET_KEY: "secret-test",
    },
  });
  const result = await response.json();
  assert.equal(result.status, "approved");
  assert.equal(gatewayPayload.amount, 83.42);
  assert.equal(gatewayPayload.product.name, "Kit 7 em 1 Escova Secadora Bege Bivolt com Caixa e 7 Acessórios (x1)");
} finally {
  globalThis.fetch = originalFetch;
}

let venusPixPayload;
let venusHeaders;
globalThis.fetch = async (url, options = {}) => {
  const address = String(url);
  if (address.includes("process-payment")) {
    venusPixPayload = JSON.parse(options.body);
    venusHeaders = options.headers;
    return new Response(JSON.stringify({
      success: true,
      status: "pending",
      transaction_id: "tx-pix-venus-1",
      pix_copy_paste: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540534.115802BR5913BELLA MIX6009SAO PAULO62070503***6304ABCD",
      qr_code_base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    }), { status: 200 });
  }
  throw new Error(`Chamada inesperada no teste: ${address}`);
};

try {
  const response = await createPixVenuspay(
    { env: { VENUS_PAY_SECRET_KEY: "secret-test", VENUS_PAY_PRODUCT_ID: "prod-123" } },
    { "Content-Type": "application/json" },
    {
      amount: 34.11,
      name: "Cliente Teste",
      email: "cliente@example.com",
      phone: "11999999999",
      document: "12345678909",
      productName: "Kit Escova 3 em 1 Branca",
    }
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.gateway, "venuspay_pix");
  assert.equal(data.transactionId, "tx-pix-venus-1");
  assert.equal(data.pixCode.startsWith("000201"), true);
  assert.equal(data.qrCodeBase64.startsWith("data:image/png"), true);
  assert.equal(venusPixPayload.payment_method, "pix");
  assert.equal(venusPixPayload.customer.name, "Cliente Teste");
  assert.equal(venusPixPayload.customer.document, "12345678909");
  assert.equal(venusPixPayload.product.name, "Kit Escova 3 em 1 Branca");
  assert.equal(venusPixPayload.name, "Cliente Teste");
  assert.equal(venusHeaders["x-api-key"], "secret-test");
  assert.equal(venusHeaders["Authorization"], "Bearer secret-test");
} finally {
  globalThis.fetch = originalFetch;
}

globalThis.fetch = async () => new Response(JSON.stringify({
  success: true,
  data: {
    id: "tx-pix-venus-nested",
    status: "pending",
    pix: { copy_paste: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540534.115802BR5913BELLA MIX6009SAO PAULO62070503***6304ABCD" },
  },
}), { status: 200 });
try {
  const response = await createPixVenuspay(
    { env: { VENUS_PAY_SECRET_KEY: "secret-test" } },
    { "Content-Type": "application/json" },
    { amount: 34.11, name: "Cliente Teste" }
  );
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.transactionId, "tx-pix-venus-nested");
  assert.equal(data.pixCode.startsWith("000201"), true);
} finally {
  globalThis.fetch = originalFetch;
}

console.log("Contratos do checkout validados.");
