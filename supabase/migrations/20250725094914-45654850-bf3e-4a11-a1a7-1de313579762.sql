-- Criar tabela de usuários para sistema de autenticação
CREATE TABLE public.usuarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT,
  ativo BOOLEAN NOT NULL DEFAULT false,
  data_ativacao TIMESTAMP WITH TIME ZONE,
  produto TEXT,
  token_definicao_senha TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para usuários
CREATE POLICY "Usuários podem ver apenas seus próprios dados" 
ON public.usuarios 
FOR SELECT 
USING (auth.uid()::text = id::text OR ativo = true);

CREATE POLICY "Permitir inserção através de webhook" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar apenas seus próprios dados" 
ON public.usuarios 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION public.update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp automaticamente
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_usuarios_updated_at();

-- Índices para performance
CREATE INDEX idx_usuarios_email ON public.usuarios(email);
CREATE INDEX idx_usuarios_token ON public.usuarios(token_definicao_senha);
CREATE INDEX idx_usuarios_ativo ON public.usuarios(ativo);