-- Resetar a senha e gerar novo token para o usuário com problema de acesso
UPDATE usuarios 
SET 
  senha_hash = NULL,
  token_definicao_senha = gerar_token_seguro(),
  token_gerado_em = now(),
  ativo = false,
  data_ativacao = NULL
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Retornar o novo token gerado para que possamos informar ao usuário
SELECT email, token_definicao_senha, token_gerado_em 
FROM usuarios 
WHERE email = 'Kmpersonalbanker@gmail.com';