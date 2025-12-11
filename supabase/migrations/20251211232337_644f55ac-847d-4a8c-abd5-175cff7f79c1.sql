-- Remove a política permissiva que permite leitura pública
DROP POLICY IF EXISTS "Service role can manage tokens" ON public.password_reset_tokens;

-- Não criamos nova policy - service role (edge functions) bypassa RLS automaticamente
-- Usuários públicos e autenticados ficam completamente bloqueados