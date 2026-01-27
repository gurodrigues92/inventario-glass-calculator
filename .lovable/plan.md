

# Plano: Adicionar Webhook para Preenchimento da Calculadora

## Objetivo
Disparar um webhook para o n8n sempre que um usuário fizer um cálculo na calculadora, similar ao que já existe para o diagnóstico.

---

## Quando será disparado

O webhook será disparado na edge function `salvar-calculo`, que é executada automaticamente quando:

1. Usuário preenche o formulário da calculadora (patrimônio, estado, etc.)
2. Clica em "Calcular Custos do Inventário"
3. Página de resultados carrega
4. `useResultsSave` dispara auto-save
5. Edge function `salvar-calculo` executa:
   - Salva no banco de dados (tabela `calculos_inventario`) ✓ já existe
   - **NOVO: Envia POST para webhook n8n**
6. Dados ficam disponíveis no n8n para automações

---

## Payload do Webhook (proposta)

```json
{
  "id": "uuid-do-calculo",
  "usuario": {
    "id": "uuid-do-usuario-ou-null",
    "nome": "Nome do usuario",
    "email": "email@exemplo.com"
  },
  "calculo": {
    "patrimonio": 5000000,
    "estado": "SP",
    "tipo_processo": "extrajudicial",
    "numero_herdeiros": 3,
    "tem_testamento": false,
    "tem_menores_incapazes": false,
    "tem_litigio": false,
    "valor_imoveis": 3000000,
    "valor_veiculos": 200000,
    "valor_investimentos": 1800000
  },
  "resultado": {
    "custo_total": 450000,
    "custo_itcmd": 200000,
    "custo_honorarios": 200000,
    "custo_custas": 50000,
    "tempo_estimado": "3 a 6 meses",
    "percentual_sobre_patrimonio": 9.0
  },
  "tipo_calculadora": "basica",
  "created_at": "2026-01-27T15:00:00Z"
}
```

---

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `supabase/functions/salvar-calculo/index.ts` | Adicionar envio de webhook após salvar |

---

## Implementação

Adicionar o seguinte código na edge function `salvar-calculo`, logo após salvar o cálculo e antes do return:

```typescript
// 4. Enviar para n8n webhook
const N8N_WEBHOOK_CALCULO_URL = 'https://n8n.altavance.media/webhook/calculo-calculadora-psi';

try {
  const webhookPayload = {
    id: calculo.id,
    usuario: {
      id: usuarioId || null,
      nome: nome || 'Visitante',
      email: email || null
    },
    calculo: {
      patrimonio: dadosCalculo.patrimonio,
      estado: dadosCalculo.estado,
      tipo_processo: dadosCalculo.tipo_processo,
      numero_herdeiros: dadosCalculo.numero_herdeiros,
      tem_testamento: dadosCalculo.tem_testamento,
      tem_menores_incapazes: dadosCalculo.tem_menores_incapazes,
      tem_litigio: dadosCalculo.tem_litigio,
      valor_imoveis: dadosCalculo.valor_imoveis,
      valor_veiculos: dadosCalculo.valor_veiculos,
      valor_investimentos: dadosCalculo.valor_investimentos
    },
    resultado: {
      custo_total: dadosCalculo.custo_total,
      custo_itcmd: dadosCalculo.custo_itcmd,
      custo_honorarios: dadosCalculo.custo_honorarios,
      custo_custas: dadosCalculo.custo_custas,
      tempo_estimado: dadosCalculo.tempo_estimado,
      percentual_sobre_patrimonio: dadosCalculo.percentual_sobre_patrimonio
    },
    tipo_calculadora: tipoCalculadora,
    created_at: new Date().toISOString()
  };

  console.log('Enviando calculo para webhook n8n...');
  
  const webhookResponse = await fetch(N8N_WEBHOOK_CALCULO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookPayload)
  });

  if (webhookResponse.ok) {
    console.log('Webhook calculo enviado com sucesso');
  } else {
    console.error('Erro ao enviar webhook calculo:', webhookResponse.status);
  }
} catch (webhookError) {
  // Não falha a operação principal se o webhook falhar
  console.error('Erro ao chamar webhook calculo:', webhookError);
}
```

---

## URL do Webhook

Estou sugerindo: `https://n8n.altavance.media/webhook/calculo-calculadora-psi`

Você precisa criar esse endpoint no n8n para receber os dados. Se preferir outra URL, me avise.

---

## Comparativo: Diagnóstico vs Calculadora

| Aspecto | Diagnóstico | Calculadora |
|---------|-------------|-------------|
| Momento | Ao clicar "Continuar" | Ao ver resultados |
| Webhook | `diagnostico-calculadora-psi` | `calculo-calculadora-psi` (novo) |
| Dados | Perfil + situação atual | Valores + resultados |
| Tabela | `diagnosticos` | `calculos_inventario` |

---

## Resultado Esperado

1. Cada cálculo feito na calculadora dispara webhook para n8n
2. n8n pode processar e enviar para Google Sheets, CRM, etc.
3. Erro no webhook NÃO bloqueia o salvamento do cálculo
4. Logs registram sucesso/falha do webhook

