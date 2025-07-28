-- Fix security warnings

-- 1. Fix function search path for the new function
CREATE OR REPLACE FUNCTION public.gerar_token_seguro()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  token text;
BEGIN
  -- Generate a secure random token
  token := encode(gen_random_bytes(32), 'hex');
  RETURN token;
END;
$$;

-- 2. Fix the existing update function that also has search path issues
CREATE OR REPLACE FUNCTION public.update_usuarios_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;