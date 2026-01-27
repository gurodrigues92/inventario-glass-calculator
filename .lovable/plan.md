
# Plano: Corrigir Meus Calculos e Esclarecer Webhook do Diagnostico

## Problemas Identificados

### Problema 1: Calculos nao aparecem em "Meus Calculos"

**Causa Raiz**: A edge function `get-user-calculos` tem uma logica ineficiente que:
1. Busca TODOS os calculos do banco
2. Filtra em memoria pelo usuario_id

Isso funciona, mas pode falhar se o calculo ainda nao foi salvo quando o usuario acessou a pagina.

**Evidencia no banco de dados**:
- O calculo `32d7398f-2a9e-45bc-a15b-89f691077145` ESTA salvo corretamente
- Vinculado ao profile `39d34163-de28-4267-bce5-915bffe08eae`
- Profile tem `usuario_id = a7519c3b-40c6-4303-9b59-142c7b17bf1b`

**Timeline do problema**:
- 15:56:40 - Usuario acessou "Meus Calculos" (0 resultados)
- 15:57:39 - Calculo foi salvo (apos a busca!)

---

## Solucao Parte 1: Otimizar Edge Function `get-user-calculos`

Mudar de buscar tudo e filtrar em memoria para buscar diretamente com filtro no banco:

**Arquivo: `supabase/functions/get-user-calculos/index.ts`**

```typescript
// ANTES (ineficiente - busca tudo e filtra em memoria)
const { data: calculos } = await supabaseAdmin
  .from('calculos_inventario')
  .select(`...`)
  .order('created_at', { ascending: false });

const calculosDoUsuario = calculos?.filter(calculo => {
  return calculo.profiles?.usuario_id === usuarioId;
}) || [];

// DEPOIS (eficiente - filtra direto no banco via join)
// Primeiro buscar o profile_id do usuario
const { data: profile } = await supabaseAdmin
  .from('profiles')
  .select('id')
  .eq('usuario_id', usuarioId)
  .maybeSingle();

if (!profile) {
  return Response({ calculos: [] });
}

// Buscar calculos apenas desse profile
const { data: calculos } = await supabaseAdmin
  .from('calculos_inventario')
  .select(`
    id, patrimonio, estado, tipo_processo, custo_total, tempo_estimado, created_at,
    custo_itcmd, custo_honorarios, custo_custas, ...
  `)
  .eq('profile_id', profile.id)
  .order('created_at', { ascending: false });
```

---

## Solucao Parte 2: Melhorar Busca no Frontend

**Arquivo: `src/components/calculos-salvos/SearchBar.tsx`**

Adicionar mais campos de busca alem de nome/email/estado:
- Buscar por valor de patrimonio
- Buscar por data
- Buscar por tipo de processo

---

## Documentacao: Webhook do Diagnostico

### Quando e disparado

O webhook do diagnostico e disparado na edge function `salvar-diagnostico` quando:

1. Usuario preenche formulario em `/diagnostico`
2. Clica no botao "Continuar para Calculadora"
3. Dados sao validados
4. Edge function executa:
   - Salva no banco de dados (tabela `diagnosticos`)
   - Envia POST para `https://n8n.altavance.media/webhook/diagnostico-calculadora-psi`
5. Usuario e redirecionado para `/` (calculadora)

### Payload do Webhook

```json
{
  "id": "uuid-do-diagnostico",
  "nome": "Nome do usuario",
  "cidade": "Cidade",
  "estado": "SP",
  "faixa_patrimonio": "5M",
  "possui_holding": false,
  "cnpj_holding": null,
  "possui_empresas_ltda": false,
  "empresas": [],
  "imoveis_alugados": false,
  "receita_aluguel": null,
  "herdeiros": [{ "nome": "...", "parentesco": "...", "tipo": "..." }],
  "observacoes": null,
  "created_at": "2026-01-27T15:00:00Z"
}
```

---

## Arquivos a Modificar

| Arquivo | Acao |
|---------|------|
| `supabase/functions/get-user-calculos/index.ts` | Otimizar query para filtrar no banco |
| `src/components/calculos-salvos/SearchBar.tsx` | Expandir campos de busca |

---

## Resultado Esperado

1. Calculos aparecerao corretamente em "Meus Calculos" para o usuario logado
2. Busca sera mais eficiente (filtra no banco ao inves de memoria)
3. Busca incluira mais campos (patrimonio, data, tipo)
4. Webhook do diagnostico continua funcionando como esta
