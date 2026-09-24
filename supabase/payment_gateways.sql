-- Tabela de configuração dos gateways de pagamento
-- Execute no SQL Editor do Supabase (projeto da Bella Mix)

CREATE TABLE IF NOT EXISTS payment_gateways (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  method      TEXT NOT NULL CHECK (method IN ('pix', 'card')),
  enabled     BOOLEAN NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO payment_gateways (id, name, method, enabled) VALUES
  ('ironpay',     'IronPay',     'pix',  true),
  ('masterfy',    'MasterFy',    'pix',  false),
  ('umbrellapag',  'UmbrellaPag', 'pix',  false),
  ('venuspay',     'Venus Pay',   'card', true),
  ('venuspay_pix', 'Venus Pay',   'pix',  false)
ON CONFLICT (id) DO NOTHING;

-- Permite o painel admin (mesma chave anon do Supabase) ler e atualizar
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payment_gateways_all" ON payment_gateways;
CREATE POLICY "payment_gateways_all"
  ON payment_gateways
  FOR ALL
  USING (true)
  WITH CHECK (true);
