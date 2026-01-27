-- Criar tabela para armazenar diagnósticos dos usuários
CREATE TABLE public.diagnosticos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  possui_holding BOOLEAN NOT NULL DEFAULT false,
  cnpj_holding TEXT,
  possui_empresas_ltda BOOLEAN NOT NULL DEFAULT false,
  empresas JSONB DEFAULT '[]'::jsonb,
  faixa_patrimonio TEXT NOT NULL,
  imoveis_alugados BOOLEAN NOT NULL DEFAULT false,
  receita_aluguel TEXT,
  herdeiros JSONB NOT NULL DEFAULT '[]'::jsonb,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

-- Política: Service role pode inserir (via edge function)
CREATE POLICY "Service role pode inserir diagnósticos"
ON public.diagnosticos
FOR INSERT
WITH CHECK (true);

-- Política: Service role pode ler todos (para exportação admin)
CREATE POLICY "Service role pode ler diagnósticos"
ON public.diagnosticos
FOR SELECT
USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_diagnosticos_updated_at
BEFORE UPDATE ON public.diagnosticos
FOR EACH ROW
EXECUTE FUNCTION public.update_usuarios_updated_at();

-- Índices para melhor performance
CREATE INDEX idx_diagnosticos_created_at ON public.diagnosticos(created_at DESC);
CREATE INDEX idx_diagnosticos_estado ON public.diagnosticos(estado);
CREATE INDEX idx_diagnosticos_faixa_patrimonio ON public.diagnosticos(faixa_patrimonio);