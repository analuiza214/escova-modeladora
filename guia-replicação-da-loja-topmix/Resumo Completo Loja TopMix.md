# Guia resumido de replicação da Loja TopMix

Atualizado em 04/09/2026. Este resumo acompanha o guia completo e permite recriar a loja mudando produtos, banners, avaliações, textos, identidade e credenciais, sem alterar os contratos que mantêm checkout, pagamentos, painel, rastreio e atribuição funcionando.

## 1. Arquitetura

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind e shadcn/ui | Vitrine, carrinho, checkout, sucesso, rastreio e admin |
| Backend | Cloudflare Pages Functions | Pedidos, pagamentos, conciliação, webhooks, emails, cron, Facebook CAPI e UTMify |
| Banco | Supabase/PostgreSQL | `leads`, rastreio, gateways e comprovantes |
| Limite de PIX | Cloudflare KV `PIX_RATELIMIT` | Até cinco gerações por IP/hora |
| Pagamentos | IronPay, MasterFy, UmbrellaPag e Venus Pay | PIX; Venus Pay também processa cartão |
| Emails | Resend | Rastreio e recuperação de carrinho |

O pedido deve nascer somente em `POST /api/orders/create`. O frontend não pode fazer outro `insert` direto em `leads`.

## 2. Arquivos centrais

```text
functions/
  _lib/                     autenticação, gateways, leads e finalização
  api/
    orders/create.js        cria pedido e consolida a atribuição UTM
    pix/create.js           gera PIX no gateway ativo
    pix/status.js           consulta PIX e conclui de forma idempotente
    pix/webhook.js          recebe evento e confirma no gateway
    card/create.js          processa cartão pela Venus Pay
    card/status.js          consulta cartão
    reconcile-payments.js  concilia PIX pendentes dos últimos sete dias
    gateways.js             lista e altera gateways ativos
    admin-*.js              sessão e operações protegidas do painel
    send-*.js               emails transacionais
    process-recovery-queue.js
src/
  lib/data.ts               produtos, preços, imagens e avaliações
  lib/tracking.ts           UTMs, cookies e identificadores de anúncios
  pages/checkout.tsx        valida dados e inicia o pagamento
  pages/success.tsx         acompanha o status e oferece troca para PIX
  pages/admin.tsx           pedidos, filtros, conciliação e atualização silenciosa
  pages/rastrear-pedido.tsx
public/images/              banners, produtos, logo, avaliações e mídia
```

## 3. Banco de dados

- `leads`: um registro para cada tentativa independente de pagamento, com cliente, endereço, produtos, valor, método, status, gateway, `transaction_id`, rastreio, atribuição, erros e datas.
- `rastreio_origem`: `codigo`, `origem_at` e `nome_cliente`. O código deve existir aqui e em `leads.codigo_rastreio`.
- `payment_gateways`: configuração e ativação dos provedores PIX/cartão.
- `comprovantes_taxa` e Storage correspondente, quando esse fluxo estiver habilitado.

Estados: `checkout_iniciado`, `pix_gerado`, `cartao_processando`, `cartao_recusado`, `pago`, `expirado`, `reembolsado` e `abandonou`.

Regras críticas:

1. Nunca combinar `.order()` ou `.limit()` diretamente com `.update()`; selecione os IDs e atualize por ID.
2. `SUPABASE_SERVICE_ROLE_KEY` fica somente nas Functions e nunca recebe prefixo `VITE_`.
3. O admin consulta o registro atual no servidor antes de operações importantes.
4. O webhook identifica a transação, mas o backend confirma o status diretamente no gateway.
5. Finalização, email, Facebook Purchase e UTMify são idempotentes.

## 4. Fluxos obrigatórios

### PIX normal

```text
Checkout validado
→ /api/orders/create cria checkout_iniciado e devolve orderId
→ /api/pix/create usa esse orderId e grava pix_gerado, gateway e transaction_id
→ tela de sucesso, webhook ou reconcile-payments podem confirmar
→ um único finalizador marca pago, gera rastreio e dispara integrações uma vez
```

### Cartão

```text
Checkout validado
→ /api/orders/create cria checkout_iniciado
→ /api/card/create processa pela Venus Pay
→ aprovado: pago + rastreio + email + Facebook CAPI + UTMify
→ recusado/indisponível: mantém o pedido como cartao_recusado
```

### Troca de cartão recusado para PIX

Esta é a exceção intencional em que existem dois pedidos:

1. O cartão original permanece `cartao_recusado`; ele nunca é transformado em PIX.
2. Ao clicar em **Pagar via Pix agora**, novos cliques ficam bloqueados durante a ação.
3. Copiam-se nome, email, telefone, CPF, CEP, endereço completo, produtos e atribuição/tracking.
4. Removem-se o `orderId` antigo e qualquer dado de cartão do novo conteúdo.
5. Aplica-se o preço PIX, incluindo o desconto configurado.
6. `/api/orders/create` cria outro pedido com método PIX e devolve outro `orderId`.
7. Só depois `/api/pix/create` gera a cobrança nesse novo pedido.
8. O PIX recebe horário, valor, gateway e `transaction_id` próprios.
9. O admin mostra os dois: cartão recusado e PIX gerado/pago.
10. A conciliação atualiza apenas o segundo registro PIX.

Se a criação do segundo pedido falhar, não gerar a cobrança, evitando PIX órfão.

### Admin e conciliação

- O carregamento completo aparece somente na primeira busca.
- A cada 60 segundos, atualizar silenciosamente, mantendo a lista visível.
- Em paralelo, `/api/reconcile-payments` confere até 50 PIX pendentes dos últimos sete dias com token admin ou `CRON_SECRET`.
- Após conciliar, buscar novamente e atualizar apenas os dados.
- Exibir método, status, data/hora, gateway e transação do pedido correto.

### Atribuição e recuperação

- Preservar `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `src`, `sck`, `fbclid`, `fbc` e `fbp`.
- A atribuição deve sobreviver por até 30 dias e ser consolidada no servidor ao criar o pedido.
- UTMify recebe `waiting_payment` na geração e `paid` na conclusão.
- A recuperação usa `CRON_SECRET`, controla tentativas e evita email duplicado.

## 5. Ambiente e serviços

```text
VITE_SUPABASE_URL
VITE_SUPABASE_KEY
VITE_ENCRYPT_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_USER
ADMIN_PASS
ADMIN_SESSION_SECRET
IRONPAY_API_TOKEN
IRONPAY_OFFER_HASH
IRONPAY_PRODUCT_HASH
MASTERFY_API_KEY
UMBRELLAPAG_API_KEY
VENUS_PAY_SECRET_KEY
VENUS_PAY_PRODUCT_ID
RESEND_API_KEY
RESEND_FROM_EMAIL
FB_PIXEL_ID
FB_ACCESS_TOKEN
UTMIFY_API_TOKEN
SITE_URL
CRON_SECRET
```

Criar o KV `pix-ratelimit` com binding `PIX_RATELIMIT`. Alterações em `VITE_*` exigem novo build/deploy. Configurar webhooks para `{SITE_URL}/api/pix/webhook` quando suportados.

## 6. O que mudar na nova loja

- Produtos, preços, preço PIX, parcelas, slugs e avaliações em `src/lib/data.ts`.
- Banners, fotos, vídeos, logo, favicon e mídia em `public/images/`.
- Textos de venda, provas sociais e páginas institucionais.
- Nome, domínio, identidade e prefixo de rastreio.
- Identidade dos emails.
- Novo projeto/tabelas do Supabase e credenciais.
- Projeto Cloudflare, domínio, variáveis, KV e cron.
- Produtos/ofertas, webhooks e credenciais dos gateways.
- Pixel, CAPI e token UTMify.

Não alterar os contratos de criação de pedido, troca cartão→PIX, idempotência, conciliação, rastreio, atribuição nem atualização silenciosa do admin.

## 7. Checklist de validação

- Build de produção sem erros.
- PIX testado em cada gateway habilitado.
- Cartão aprovado e recusado testados.
- Cartão recusado → PIX cria dois registros independentes com os mesmos dados cadastrais.
- Clique duplo não duplica pedidos.
- Admin mantém a lista visível durante a atualização de 60 segundos.
- Tela, webhook e conciliação convergem para uma única conclusão do PIX.
- Rastreio existe nas duas tabelas e o email sai uma única vez.
- UTM original reaparece em retorno dentro de 30 dias e chega à UTMify.
- Recuperação e autenticação admin funcionam.
- Layout revisado em celular e desktop.
- Nenhuma chave privada aparece no frontend ou repositório.

Consulte o HTML/PDF principal desta pasta para SQL, rotas, solução de problemas e instruções completas para outra IA.
