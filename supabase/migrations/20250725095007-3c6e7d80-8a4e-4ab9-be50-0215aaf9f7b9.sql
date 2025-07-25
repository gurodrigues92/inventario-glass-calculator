-- Corrigir função removendo trigger primeiro
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
DROP FUNCTION IF EXISTS public.update_usuarios_updated_at();

CREATE OR REPLACE FUNCTION public.update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Recriar trigger
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_usuarios_updated_at();