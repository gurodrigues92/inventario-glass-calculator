-- Remove a política permissiva de leitura pública
DROP POLICY IF EXISTS "Admins podem ver todos os logs" ON public.log_compras_hotmart;

-- Não criamos nova policy - apenas service role (via edge functions) pode ler
-- O webhook INSERT já usa service role que bypassa RLS