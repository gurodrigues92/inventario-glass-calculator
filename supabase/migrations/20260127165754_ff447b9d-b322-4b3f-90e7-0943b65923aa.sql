-- Remover a foreign key constraint problemática
ALTER TABLE public.password_reset_tokens 
DROP CONSTRAINT IF EXISTS password_reset_tokens_user_id_fkey;

-- Adicionar nova foreign key referenciando a tabela usuarios
ALTER TABLE public.password_reset_tokens 
ADD CONSTRAINT password_reset_tokens_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;