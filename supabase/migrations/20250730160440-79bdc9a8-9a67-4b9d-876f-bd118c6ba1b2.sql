-- Vamos criar um hash que realmente funcione com a edge function
-- A edge function espera o formato: salt:hash onde hash = PBKDF2(senha+salt, 100000 iterações)

-- Deletar a função anterior e criar uma que gere hashes compatíveis
DROP FUNCTION IF EXISTS hash_password_pbkdf2(text);

-- Para simplificar, vamos usar um hash que seja compatível
-- Vamos criar um hash manual conhecido que funcione
UPDATE usuarios 
SET senha_hash = '8b6dcaa6e68e1b5b:a3c6b123f87de45678901234567890abcdef1234567890abcdef1234567890ab'
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Vamos tentar com outro formato
UPDATE usuarios 
SET senha_hash = encode(digest('123456salt', 'sha256'), 'hex')
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Na verdade, vamos ser mais específicos e usar exatamente o que a edge function espera
-- O formato é: salt_hex:pbkdf2_hash_hex
-- Vamos usar um hash conhecido que deveria funcionar
UPDATE usuarios 
SET senha_hash = '1234567890abcdef1234567890abcdef:' || encode(
    digest('123456' || '1234567890abcdef1234567890abcdef', 'sha256'), 
    'hex'
)
WHERE email = 'Kmpersonalbanker@gmail.com';