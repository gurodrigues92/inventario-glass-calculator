-- Atualizar a função para usar gen_random_uuid() que está disponível
CREATE OR REPLACE FUNCTION public.gerar_token_seguro()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  token text;
BEGIN
  -- Generate a secure random token using gen_random_uuid
  token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  RETURN token;
END;
$function$;

-- Gerar novo token de definição de senha para o usuário gurodrigues92@gmail.com
UPDATE public.usuarios 
SET 
  token_definicao_senha = public.gerar_token_seguro(),
  token_gerado_em = now(),
  senha_hash = null
WHERE email = 'gurodrigues92@gmail.com';

-- Verificar resultado
SELECT 
  id,
  email,
  nome,
  ativo,
  token_definicao_senha,
  token_gerado_em
FROM public.usuarios 
WHERE email = 'gurodrigues92@gmail.com';