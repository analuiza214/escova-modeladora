import assert from "node:assert/strict";
import { cardAmount, validateCartItems } from "../functions/_lib/catalog.js";
import { onRequest as createOrder } from "../functions/api/orders/create.js";
import { onRequest as createCard } from "../functions/api/card/create.js";

const whiteBrush = validateCartItems([{ id: "bella-escova-branca", quantity: 1 }], "card");
assert.equal(whiteBrush.amount, 69.9);
assert.equal(whiteBrush.products, "Escova Branca (x1)");

const pixKit = validateCartItems([{ id: "bella-kit-7-em-1-bege", quantity: 2 }], "pix");
assert.equal(pixKit.amount, 233.82);
assert.equal(cardAmount(129.9, 5), 129.9);
assert.equal(cardAmount(129.9, 6), 155.02);
assert.throws(() => validateCartItems([{ id: "produto-inventado", quantity: 1 }], "pix"));

const originalFetch = globalThis.fetch;
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
  assert.equal(writes[0].valor, 62.91);
  assert.equal(writes[0].produtos, "Escova Branca (x1)");
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
      valor: 129.9,
      produtos: "Kit 7 em 1 Escova Secadora Bege (x1)",
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
  assert.equal(gatewayPayload.amount, 155.02);
  assert.equal(gatewayPayload.product.name, "Kit 7 em 1 Escova Secadora Bege (x1)");
} finally {
  globalThis.fetch = originalFetch;
}

console.log("Contratos do checkout validados.");
