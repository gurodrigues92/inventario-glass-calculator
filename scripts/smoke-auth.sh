#!/bin/bash
# Checagem minima do contrato de autenticacao das edge functions.
# Roda contra producao (nao escreve nada) e falha alto se um dos buracos
# fechados em 10/09/2026 voltar. Uso: bash scripts/smoke-auth.sh
set -u

API=${API:-https://api.supabase.altavance.media/functions/v1}
ANON=${ANON:-$(grep -oP '^ANON_KEY=\K.*' /opt/stacks/supabase/.env 2>/dev/null)}
[ -n "$ANON" ] || { echo "defina ANON com a anon key"; exit 2; }

falhas=0
chamar() { # <funcao> <body> [token]
  curl -s -X POST "$API/$1" -H "Authorization: Bearer $ANON" \
    -H "Content-Type: application/json" ${3:+-H "x-sessao: $3"} -d "$2"
}
verificar() { # <nome> <esperado no corpo> <corpo>
  if echo "$3" | grep -q "$2"; then
    echo "ok   $1"
  else
    echo "FALHA $1 -> $3"
    falhas=$((falhas + 1))
  fi
}

# 1. Erro de login nao pode devolver o token de definicao de senha.
resp=$(chamar auth-login '{"email":"gustavodoads@gmail.com","password":"senha-errada-de-proposito"}')
if echo "$resp" | grep -q '"token"'; then
  echo "FALHA auth-login voltou a vazar token -> $resp"; falhas=$((falhas + 1))
else
  echo "ok   auth-login nao vaza token de definicao de senha"
fi

# 2. E-mail com caixa diferente encontra a conta (regressao de 09/09/2026).
resp=$(chamar auth-login '{"email":"GustavoDoAds@GMAIL.com","password":"senha-errada-de-proposito"}')
verificar "busca de email ignora caixa" "SENHA_NAO_DEFINIDA" "$resp"

# 3. Dado de usuario exige sessao assinada, nunca um id no corpo.
resp=$(chamar get-user-calculos '{"usuarioId":"00000000-0000-0000-0000-000000000000"}')
verificar "get-user-calculos recusa id vindo do corpo" "SESSAO_INVALIDA" "$resp"

resp=$(chamar get-user-calculos '{}' 'psi1.eyJzdWIiOiJmYWtlIiwiZXhwIjo5OTk5OTk5OTk5fQ.assinatura-falsa')
verificar "get-user-calculos recusa token forjado" "SESSAO_INVALIDA" "$resp"

resp=$(chamar auth-sessao '{}')
verificar "auth-sessao recusa chamada sem sessao" "SESSAO_INVALIDA" "$resp"

resp=$(chamar salvar-diagnostico '{"nome":"x","cidade":"x","estado":"SP","faixaPatrimonio":"x"}')
verificar "salvar-diagnostico exige sessao" "SESSAO_INVALIDA" "$resp"

echo
[ "$falhas" -eq 0 ] && echo "todos os checks passaram" || echo "$falhas check(s) falharam"
exit $falhas
