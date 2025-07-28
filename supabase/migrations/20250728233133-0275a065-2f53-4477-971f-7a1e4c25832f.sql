-- Gerar novo token de definição de senha para o usuário gurodrigues92@gmail.com
UPDATE public.usuarios 
SET 
  token_definicao_senha = public.gerar_token_seguro(),
  token_gerado_em = now(),
  senha_hash = null
WHERE email = 'gurodrigues92@gmail.com';

-- Verificar se a atualização foi bem-sucedida
SELECT 
  id,
  email,
  nome,
  ativo,
  token_definicao_senha,
  token_gerado_em,
  CASE WHEN senha_hash IS NULL THEN 'Token gerado - senha limpa' ELSE 'Senha ainda presente' END as status_senha
FROM public.usuarios 
WHERE email = 'gurodrigues92@gmail.com';