-- Corrigir o hash da senha para usar o algoritmo correto
-- A edge function usa PBKDF2 com 100000 iterações, mas vamos criar um hash compatível

-- Primeiro, vamos limpar e recriar com um hash que funcione
UPDATE usuarios 
SET senha_hash = '16bytesrandomsalt:' || encode(digest('123456' || '16bytesrandomsalt', 'sha256'), 'hex')
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Melhor ainda, vamos usar um salt conhecido e testar
UPDATE usuarios 
SET senha_hash = 'abcdef1234567890:' || encode(digest('123456abcdef1234567890', 'sha256'), 'hex')
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Verificar a atualização
SELECT email, ativo, senha_hash FROM usuarios WHERE email = 'Kmpersonalbanker@gmail.com';