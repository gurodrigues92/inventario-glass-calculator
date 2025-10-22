# 🚨 PROCESSO DE EMERGÊNCIA - HOTMART

## Se um cliente reportar que não recebeu acesso:

### PASSO 1: Verificar no Dashboard
1. Acesse: `/admin/monitoramento-hotmart` (requer autenticação de admin)
2. Busque pelo email do cliente
3. Verifique o status da compra

### PASSO 2: Se compra não aparece no sistema
- Verifique na Hotmart se a compra foi aprovada
- Verifique se o webhook está configurado corretamente
- URL do webhook: `https://xpfvjkzmoydapxzofphc.supabase.co/functions/v1/webhook-hotmart`
- Certifique-se que o webhook está ativo na Hotmart

### PASSO 3: Se compra aparece com erro
1. No dashboard, clique em "Ver detalhes" da compra
2. Leia a mensagem de erro específica
3. Identifique a etapa que falhou:
   - **erro_validacao**: Dados inválidos no webhook
   - **erro_banco**: Problema ao criar/atualizar usuário
   - **erro_email**: Falha no envio do email de boas-vindas

### PASSO 4: Criar acesso manualmente

#### 4.1 Acesse o SQL Editor do Supabase
Link: https://supabase.com/dashboard/project/xpfvjkzmoydapxzofphc/sql/new

#### 4.2 Execute o SQL abaixo (substituindo os dados do cliente):

```sql
-- Criar usuário manualmente
INSERT INTO usuarios (nome, email, ativo, data_ativacao, produto, token_definicao_senha, token_gerado_em)
VALUES (
  'NOME_COMPLETO_CLIENTE',           -- Substitua pelo nome
  'email@cliente.com',                -- Substitua pelo email
  true,
  NOW(),
  'Calculadora Inventário',           -- Ou nome do produto correto
  (SELECT gerar_token_seguro()),
  NOW()
)
RETURNING id, token_definicao_senha, email;
```

#### 4.3 Copie os dados retornados:
- `id`: ID do usuário criado
- `token_definicao_senha`: Token para definir senha
- `email`: Email do cliente

### PASSO 5: Enviar email manualmente

#### Opção A: Via Edge Function
Use a edge function `send-welcome-email` diretamente:

```bash
curl -X POST \
  https://xpfvjkzmoydapxzofphc.supabase.co/functions/v1/send-welcome-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [SUPABASE_ANON_KEY]" \
  -d '{
    "userId": "ID_DO_USUARIO",
    "email": "email@cliente.com",
    "nome": "Nome do Cliente",
    "resetToken": "TOKEN_COPIADO"
  }'
```

#### Opção B: Enviar email manual
Envie um email para o cliente com o seguinte conteúdo:

**Assunto:** Bem-vindo à Calculadora de Inventário - Defina sua senha

**Corpo:**
```
Olá [NOME],

Sua compra foi confirmada! Para acessar a plataforma, você precisa definir sua senha.

Clique no link abaixo para criar sua senha:
https://[SEU_DOMINIO]/definir-senha?token=[TOKEN_COPIADO]

Este link é válido por 24 horas.

Qualquer dúvida, entre em contato conosco.

Atenciosamente,
Equipe Calculadora de Inventário
```

### PASSO 6: Registrar no log

Após resolver manualmente, registre no sistema:

```sql
-- Registrar resolução manual
INSERT INTO log_compras_hotmart (
  request_id,
  email,
  nome,
  produto,
  status,
  etapa_falha,
  erro_mensagem,
  usuario_id
)
VALUES (
  'manual_' || gen_random_uuid()::text,
  'email@cliente.com',
  'Nome do Cliente',
  'Calculadora Inventário',
  'email_enviado',
  'processamento_manual',
  'Acesso criado manualmente após falha no webhook',
  'ID_DO_USUARIO_CRIADO'
);
```

---

## 🔍 TROUBLESHOOTING COMUM

### Email não está sendo enviado
1. Verifique se o RESEND_API_KEY está configurado
2. Verifique se o domínio está validado no Resend
3. Veja os logs da edge function `send-welcome-email`:
   https://supabase.com/dashboard/project/xpfvjkzmoydapxzofphc/functions/send-welcome-email/logs

### Webhook não está recebendo dados
1. Teste o webhook manualmente com curl:
```bash
curl -X POST \
  https://xpfvjkzmoydapxzofphc.supabase.co/functions/v1/webhook-hotmart \
  -H "Content-Type: application/json" \
  -d '{
    "event": "PURCHASE_COMPLETE",
    "data": {
      "buyer": {
        "email": "teste@example.com",
        "name": "Cliente Teste"
      },
      "product": {
        "name": "Calculadora Inventário"
      },
      "purchase": {
        "status": "approved",
        "transaction": "TEST123"
      }
    }
  }'
```

2. Verifique os logs do webhook:
   https://supabase.com/dashboard/project/xpfvjkzmoydapxzofphc/functions/webhook-hotmart/logs

### Cliente não consegue definir senha
1. Verifique se o token ainda é válido:
```sql
SELECT 
  email,
  token_gerado_em,
  NOW() - token_gerado_em as idade_token,
  CASE 
    WHEN NOW() - token_gerado_em > INTERVAL '24 hours' THEN 'EXPIRADO'
    ELSE 'VÁLIDO'
  END as status_token
FROM usuarios
WHERE email = 'email@cliente.com';
```

2. Se expirado, gere um novo token:
```sql
UPDATE usuarios
SET 
  token_definicao_senha = (SELECT gerar_token_seguro()),
  token_gerado_em = NOW()
WHERE email = 'email@cliente.com'
RETURNING token_definicao_senha;
```

3. Envie novo email com o token atualizado

---

## 📞 CONTATOS DE EMERGÊNCIA

- Dashboard Supabase: https://supabase.com/dashboard/project/xpfvjkzmoydapxzofphc
- Logs do Webhook: https://supabase.com/dashboard/project/xpfvjkzmoydapxzofphc/functions/webhook-hotmart/logs
- Hotmart: https://app.hotmart.com
- Resend (emails): https://resend.com/emails

---

## ⏱️ TEMPO DE RESPOSTA

- **Crítico** (cliente não consegue acessar): Resolver em até 1 hora
- **Médio** (email não chegou mas pode reenviar): Resolver em até 4 horas
- **Baixo** (dúvidas gerais): Resolver em até 24 horas

---

## 📊 MONITORAMENTO CONTÍNUO

1. Verificar dashboard diariamente: `/admin/monitoramento-hotmart`
2. Revisar email de resumo diário (enviado às 20h)
3. Responder alertas do Telegram imediatamente
4. Manter taxa de sucesso acima de 95%
