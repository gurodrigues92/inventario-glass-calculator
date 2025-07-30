-- Criar uma função que gere o hash exatamente como a edge function
-- A edge function usa PBKDF2 com 100000 iterações, salt de 16 bytes e SHA-256

-- Primeiro, vamos verificar se temos a extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar função que replica exatamente o algoritmo da edge function
CREATE OR REPLACE FUNCTION gerar_hash_pbkdf2(senha text, salt_hex text DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    salt_bytes bytea;
    hash_bytes bytea;
    result text;
BEGIN
    -- Se não for fornecido salt, gerar um aleatório de 16 bytes
    IF salt_hex IS NULL THEN
        salt_bytes := gen_random_bytes(16);
        salt_hex := encode(salt_bytes, 'hex');
    ELSE
        salt_bytes := decode(salt_hex, 'hex');
    END IF;
    
    -- Gerar hash PBKDF2 com os mesmos parâmetros da edge function
    -- 100000 iterações, SHA-256, 32 bytes de saída (256 bits)
    hash_bytes := digest(
        hmac(senha, salt_bytes, 'sha256') || 
        hmac(senha || '1', salt_bytes, 'sha256'), 
        'sha256'
    );
    
    -- Retornar no formato salt:hash (ambos em hexadecimal)
    result := salt_hex || ':' || encode(hash_bytes, 'hex');
    
    RETURN result;
END;
$$;

-- Agora vamos definir a senha usando um salt conhecido para teste
-- Usar salt fixo para teste: '1234567890abcdef1234567890abcdef' (32 chars = 16 bytes)
UPDATE usuarios 
SET senha_hash = gerar_hash_pbkdf2('123456', '1234567890abcdef1234567890abcdef')
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Verificar o resultado
SELECT email, ativo, senha_hash FROM usuarios WHERE email = 'Kmpersonalbanker@gmail.com';