-- Criar tabela de log de compras Hotmart
CREATE TABLE log_compras_hotmart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identificadores
  request_id TEXT NOT NULL,
  hotmart_transaction_id TEXT,
  
  -- Dados do comprador
  email TEXT NOT NULL,
  nome TEXT NOT NULL,
  produto TEXT,
  
  -- Status do processamento
  status TEXT NOT NULL, 
  -- Valores: 'webhook_recebido', 'usuario_criado', 'usuario_atualizado', 
  --          'email_enviado', 'erro_validacao', 'erro_banco', 'erro_email'
  
  -- Detalhes técnicos
  etapa_falha TEXT,
  erro_mensagem TEXT,
  erro_stack TEXT,
  
  -- Métricas
  tempo_processamento_ms INTEGER,
  tentativa_numero INTEGER DEFAULT 1,
  
  -- Dados completos do webhook (para debug)
  webhook_payload JSONB,
  
  -- Rastreamento
  ip_origem TEXT,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processado_em TIMESTAMP WITH TIME ZONE,
  
  -- Relacionamento com usuario criado
  usuario_id UUID REFERENCES usuarios(id)
);

-- Índices para consultas rápidas
CREATE INDEX idx_log_compras_email ON log_compras_hotmart(email);
CREATE INDEX idx_log_compras_status ON log_compras_hotmart(status);
CREATE INDEX idx_log_compras_created_at ON log_compras_hotmart(created_at DESC);
CREATE INDEX idx_log_compras_request_id ON log_compras_hotmart(request_id);
CREATE INDEX idx_log_compras_transaction ON log_compras_hotmart(hotmart_transaction_id);

-- Enable RLS
ALTER TABLE log_compras_hotmart ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs (você pode ajustar conforme necessário)
CREATE POLICY "Admins podem ver todos os logs"
  ON log_compras_hotmart
  FOR SELECT
  USING (true);

-- Permitir inserção de logs do webhook
CREATE POLICY "Webhook pode inserir logs"
  ON log_compras_hotmart
  FOR INSERT
  WITH CHECK (true);