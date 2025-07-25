-- Corrigir função para definir search_path como security definer
DROP FUNCTION IF EXISTS public.update_usuarios_updated_at();

CREATE OR REPLACE FUNCTION public.update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';