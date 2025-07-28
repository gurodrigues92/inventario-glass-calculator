-- Gerar novo token de definição de senha para o usuário Kmpersonalbanker@gmail.com
UPDATE public.usuarios 
SET 
  token_definicao_senha = public.gerar_token_seguro(),
  token_gerado_em = now(),
  senha_hash = null
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Verificar resultado
SELECT 
  id,
  email,
  nome,
  ativo,
  token_definicao_senha,
  token_gerado_em
FROM public.usuarios 
WHERE email = 'Kmpersonalbanker@gmail.com';