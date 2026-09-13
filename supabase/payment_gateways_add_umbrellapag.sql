-- Adiciona UmbrellaPag na tabela de gateways (execute se a tabela já existia antes)
INSERT INTO payment_gateways (id, name, method, enabled) VALUES
  ('umbrellapag', 'UmbrellaPag', 'pix', false)
ON CONFLICT (id) DO NOTHING;
