-- Phase 1: Fix Critical RLS Policy Issues

-- 1. Update usuarios table RLS policies to be user-specific only
DROP POLICY IF EXISTS "Usuários podem ver apenas seus próprios dados" ON public.usuarios;

CREATE POLICY "Usuários podem ver apenas seus próprios dados" 
ON public.usuarios 
FOR SELECT 
USING ((auth.uid())::text = (id)::text);

-- 2. Fix calculation tables RLS policies to require authentication and user-specific access

-- Update calculos_inventario policies
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.calculos_inventario;
DROP POLICY IF EXISTS "Permitir inserção pública" ON public.calculos_inventario;

CREATE POLICY "Usuários autenticados podem inserir seus próprios cálculos" 
ON public.calculos_inventario 
FOR INSERT 
TO authenticated
WITH CHECK (profile_id IS NULL OR (SELECT auth.uid()) = profile_id);

CREATE POLICY "Usuários podem ver seus próprios cálculos" 
ON public.calculos_inventario 
FOR SELECT 
TO authenticated
USING (profile_id IS NULL OR (SELECT auth.uid()) = profile_id);

-- Update calculos_refinados policies  
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.calculos_refinados;
DROP POLICY IF EXISTS "Permitir inserção pública" ON public.calculos_refinados;

CREATE POLICY "Usuários autenticados podem inserir cálculos refinados" 
ON public.calculos_refinados 
FOR INSERT 
TO authenticated
WITH CHECK (
  calculo_original_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM public.calculos_inventario 
    WHERE id = calculo_original_id 
    AND (profile_id IS NULL OR profile_id = (SELECT auth.uid()))
  )
);

CREATE POLICY "Usuários podem ver seus próprios cálculos refinados" 
ON public.calculos_refinados 
FOR SELECT 
TO authenticated
USING (
  calculo_original_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM public.calculos_inventario 
    WHERE id = calculo_original_id 
    AND (profile_id IS NULL OR profile_id = (SELECT auth.uid()))
  )
);

-- Update historico_consultas policies
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.historico_consultas;
DROP POLICY IF EXISTS "Permitir inserção pública" ON public.historico_consultas;

CREATE POLICY "Usuários autenticados podem inserir histórico" 
ON public.historico_consultas 
FOR INSERT 
TO authenticated
WITH CHECK (profile_id IS NULL OR (SELECT auth.uid()) = profile_id);

CREATE POLICY "Usuários podem ver seu próprio histórico" 
ON public.historico_consultas 
FOR SELECT 
TO authenticated
USING (profile_id IS NULL OR (SELECT auth.uid()) = profile_id);

-- Update profiles policies
DROP POLICY IF EXISTS "Permitir leitura pública" ON public.profiles;
DROP POLICY IF EXISTS "Permitir inserção pública" ON public.profiles;

CREATE POLICY "Usuários autenticados podem inserir seu próprio perfil" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Usuários podem ver apenas seu próprio perfil" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING ((SELECT auth.uid()) = id);

-- 3. Add token_gerado_em column to usuarios table for better token security
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS token_gerado_em timestamp with time zone;

-- 4. Create function to generate secure password reset token
CREATE OR REPLACE FUNCTION public.gerar_token_seguro()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  token text;
BEGIN
  -- Generate a secure random token
  token := encode(gen_random_bytes(32), 'hex');
  RETURN token;
END;
$$;