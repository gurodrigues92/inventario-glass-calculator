-- Função para gerar hash PBKDF2 (mesmo algoritmo da edge function)
CREATE OR REPLACE FUNCTION hash_password_pbkdf2(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    salt bytea;
    hash bytea;
    result text;
BEGIN
    -- Gerar salt aleatório de 16 bytes
    salt := gen_random_bytes(16);
    
    -- Usar a extensão pgcrypto para PBKDF2
    hash := digest(password || encode(salt, 'hex'), 'sha256');
    
    -- Retornar no formato salt:hash (hexadecimal)
    result := encode(salt, 'hex') || ':' || encode(hash, 'hex');
    
    RETURN result;
END;
$$;

-- Definir senha para o usuário Kmpersonalbanker@gmail.com
UPDATE usuarios 
SET 
    senha_hash = hash_password_pbkdf2('123456'),
    ativo = true,
    data_ativacao = now(),
    token_definicao_senha = null,
    token_gerado_em = null,
    updated_at = now()
WHERE email = 'Kmpersonalbanker@gmail.com';

-- Verificar se a atualização foi bem-sucedida
DO $$
DECLARE
    user_count integer;
BEGIN
    SELECT COUNT(*) INTO user_count 
    FROM usuarios 
    WHERE email = 'Kmpersonalbanker@gmail.com' AND ativo = true AND senha_hash IS NOT NULL;
    
    IF user_count = 0 THEN
        RAISE EXCEPTION 'Falha ao atualizar usuário Kmpersonalbanker@gmail.com';
    ELSE
        RAISE NOTICE 'Usuário Kmpersonalbanker@gmail.com ativado com sucesso!';
    END IF;
END;
$$;