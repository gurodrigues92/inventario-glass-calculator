
## Plano: Adicionar Webhook n8n de Producao

### Objetivo
Integrar o webhook de producao do n8n para enviar dados do diagnostico em tempo real para alimentar uma planilha Google Sheets.

### Webhook URL (Producao)
```
https://n8n.altavance.media/webhook/diagnostico-calculadora-psi
```

### Alteracoes em `supabase/functions/salvar-diagnostico/index.ts`

Adicionar chamada ao webhook apos salvar o diagnostico com sucesso (linha 88):

```typescript
// Enviar para n8n webhook
const N8N_WEBHOOK_URL = 'https://n8n.altavance.media/webhook/diagnostico-calculadora-psi';

try {
  const webhookPayload = {
    id: diagnostico.id,
    nome: data.nome,
    cidade: data.cidade,
    estado: data.estado,
    faixa_patrimonio: data.faixaPatrimonio,
    possui_holding: data.possuiHolding,
    cnpj_holding: data.cnpjHolding || null,
    possui_empresas_ltda: data.possuiEmpresasLTDA,
    empresas: data.empresas,
    imoveis_alugados: data.imoveisAlugados,
    receita_aluguel: data.receitaAluguel || null,
    herdeiros: data.herdeiros,
    observacoes: data.observacoes || null,
    created_at: diagnostico.created_at
  };

  console.log('Enviando para webhook n8n...');
  
  const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookPayload)
  });

  if (webhookResponse.ok) {
    console.log('Webhook n8n enviado com sucesso');
  } else {
    console.error('Erro ao enviar webhook n8n:', webhookResponse.status);
  }
} catch (webhookError) {
  // Nao falha a operacao principal se o webhook falhar
  console.error('Erro ao chamar webhook n8n:', webhookError);
}
```

### Comportamento
| Cenario | Resultado |
|---------|-----------|
| Banco salva + Webhook OK | Usuario ve sucesso, dados vao para planilha |
| Banco salva + Webhook falha | Usuario ve sucesso, log de erro (dados seguros no banco) |
| Banco falha | Usuario ve erro, webhook nao e chamado |

### Dados Enviados ao n8n

| Campo | Tipo | Exemplo |
|-------|------|---------|
| id | UUID | "abc123..." |
| nome | string | "Joao Silva" |
| cidade | string | "Sao Paulo" |
| estado | string | "SP" |
| faixa_patrimonio | string | "5M a 20M" |
| possui_holding | boolean | false |
| cnpj_holding | string/null | null |
| possui_empresas_ltda | boolean | true |
| empresas | array | [{"cnpj": "...", "faturamentoAnual": "..."}] |
| imoveis_alugados | boolean | true |
| receita_aluguel | string/null | "R$ 15.000" |
| herdeiros | array | [{"nome": "...", "parentesco": "...", "tipo": "..."}] |
| observacoes | string/null | "Texto livre" |
| created_at | timestamp | "2026-01-27T14:30:00Z" |

### Proximos Passos no n8n
Voce precisara configurar no n8n:
1. O **Webhook node** ja deve estar configurado para receber POST
2. Adicionar **Google Sheets node** para inserir linha
3. Mapear os campos JSON para as colunas da planilha

### Resultado
Cada diagnostico preenchido sera enviado automaticamente para sua planilha Google Sheets em tempo real.
