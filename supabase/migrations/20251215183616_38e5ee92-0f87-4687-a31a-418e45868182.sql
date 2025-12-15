-- Adicionar coluna usuario_id na tabela profiles para vincular ao usuário autenticado
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS usuario_id uuid REFERENCES public.usuarios(id);

-- Criar índice para melhor performance nas buscas
CREATE INDEX IF NOT EXISTS idx_profiles_usuario_id ON public.profiles(usuario_id);