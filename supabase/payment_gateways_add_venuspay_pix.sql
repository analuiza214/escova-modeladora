-- Adiciona o PIX da Venus Pay na tabela de gateways.
-- O cartão continua sendo o id 'venuspay'; o PIX é o id 'venuspay_pix'.
-- Execute no SQL Editor do Supabase (projeto da loja TopMix).
INSERT INTO payment_gateways (id, name, method, enabled) VALUES
  ('venuspay_pix', 'Venus Pay', 'pix', false)
ON CONFLICT (id) DO NOTHING;
