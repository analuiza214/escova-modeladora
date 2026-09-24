-- Adiciona a coluna que guarda qual gateway PIX gerou a cobrança do pedido.
-- Usada no painel admin para mostrar "PIX · IronPay", "PIX · UmbrellaPag" etc.
-- Pedidos antigos ficam com NULL e simplesmente não exibem o selo.
-- Execute no SQL Editor do Supabase (projeto da Bella Mix).
ALTER TABLE leads ADD COLUMN IF NOT EXISTS gateway text;
