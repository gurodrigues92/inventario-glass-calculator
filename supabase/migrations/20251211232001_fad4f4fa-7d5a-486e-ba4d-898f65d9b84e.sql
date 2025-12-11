-- Remove a política permissiva que permite qualquer um inserir
DROP POLICY IF EXISTS "Permitir inserção através de webhook" ON public.usuarios;

-- Não precisamos criar uma nova policy porque o webhook usa SUPABASE_SERVICE_ROLE_KEY
-- que bypassa RLS completamente. Usuários normais não devem poder inserir.