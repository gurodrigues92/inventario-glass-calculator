

# Plano: Unificar Webhook - Diagnóstico + Cálculo

## Objetivo

Enviar os dados do diagnóstico junto com os dados da calculadora em um único webhook, permitindo ter o perfil completo do usuário + os resultados do cálculo em uma única chamada.

---

## Como é possível

Os dados do diagnóstico já estão disponíveis via `DiagnosticoContext`, que envolve toda a aplicação (incluindo a página de resultados). Basta:

1. Acessar o contexto no hook `useResultsSave`
2. Enviar os dados do diagnóstico junto para a edge function `salvar-calculo`
3. Incluir no payload do webhook

---

## Fluxo Atualizado

```
1. Usuário preenche diagnóstico → dados salvos no localStorage + contexto
2. Usuário preenche calculadora → clica "Calcular"
3. Página de resultados carrega
4. useResultsSave:
   - Lê dados do DiagnosticoContext ← NOVO
   - Chama edge function salvar-calculo com AMBOS os dados
5. Edge function:
   - Salva cálculo no banco (como antes)
   - Dispara webhook com dados UNIFICADOS
```

---

## Payload Unificado do Webhook

```json
{
  "id": "uuid-do-calculo",
  "usuario": {
    "id": "uuid-do-usuario-ou-null",
    "nome": "Nome do usuario",
    "email": "email@exemplo.com"
  },
  "diagnostico": {
    "nome": "Nome do cliente",
    "cidade": "São Paulo",
    "estado": "SP",
    "faixa_patrimonio": "5M",
    "possui_holding": false,
    "cnpj_holding": null,
    "possui_empresas_ltda": false,
    "empresas": [],
    "imoveis_alugados": true,
    "receita_aluguel": "R$ 15.000,00",
    "herdeiros": [
      { "nome": "Filho 1", "parentesco": "filho", "tipo": "herdeiro" },
      { "nome": "Filho 2", "parentesco": "filho", "tipo": "socio" }
    ],
    "observacoes": "Cliente interessado em planejamento"
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

## Arquivos a Modificar

| Arquivo | Ação |
|---------|------|
| `src/hooks/useResultsSave.ts` | Importar `useDiagnostico` e enviar dados junto |
| `supabase/functions/salvar-calculo/index.ts` | Receber e incluir dados do diagnóstico no webhook |

---

## Implementação Detalhada

### 1. Modificar `src/hooks/useResultsSave.ts`

```typescript
import { useDiagnostico } from '@/contexts/DiagnosticoContext';

export const useResultsSave = (resultado: any, formData: any, calculationType: string) => {
  const { user } = useAuth();
  const { dados: dadosDiagnostico } = useDiagnostico(); // NOVO
  
  // ... no autoSaveCalculo:
  
  const { data, error } = await supabase.functions.invoke('salvar-calculo', {
    body: {
      usuarioId: user?.id || null,
      nome: user?.nome || 'Visitante',
      email: user?.email || null,
      dadosCalculo,
      tipoCalculadora,
      dadosDiagnostico  // NOVO - enviar dados do diagnóstico
    }
  });
};
```

### 2. Modificar `supabase/functions/salvar-calculo/index.ts`

```typescript
const data = await req.json()
const { usuarioId, nome, email, dadosCalculo, tipoCalculadora, dadosDiagnostico } = data

// ... após salvar no banco, no webhook payload:

const webhookPayload = {
  id: calculo.id,
  usuario: {
    id: usuarioId || null,
    nome: nome || 'Visitante',
    email: email || null
  },
  diagnostico: dadosDiagnostico ? {
    nome: dadosDiagnostico.nome,
    cidade: dadosDiagnostico.cidade,
    estado: dadosDiagnostico.estado,
    faixa_patrimonio: dadosDiagnostico.faixaPatrimonio,
    possui_holding: dadosDiagnostico.possuiHolding,
    cnpj_holding: dadosDiagnostico.cnpjHolding || null,
    possui_empresas_ltda: dadosDiagnostico.possuiEmpresasLTDA,
    empresas: dadosDiagnostico.empresas,
    imoveis_alugados: dadosDiagnostico.imoveisAlugados,
    receita_aluguel: dadosDiagnostico.receitaAluguel || null,
    herdeiros: dadosDiagnostico.herdeiros,
    observacoes: dadosDiagnostico.observacoes || null
  } : null,
  calculo: { ... },
  resultado: { ... },
  tipo_calculadora: tipoCalculadora,
  created_at: new Date().toISOString()
};
```

---

## Comparativo: Webhooks Separados vs Unificado

| Aspecto | Antes (2 webhooks) | Depois (1 webhook) |
|---------|-------------------|-------------------|
| Disparos | 2 (diagnóstico + cálculo) | 1 (tudo junto) |
| Webhook diagnóstico | Continua existindo | Pode remover se quiser |
| Dados disponíveis | Separados no n8n | Tudo em um só payload |
| Automação | Precisa correlacionar | Dados já correlacionados |

---

## Observação Importante

O webhook do diagnóstico (`salvar-diagnostico`) **continuará funcionando** independentemente. Você terá duas opções:

1. **Manter ambos**: Diagnóstico dispara seu webhook, cálculo dispara com dados unificados
2. **Remover webhook do diagnóstico**: Só dispara quando faz o cálculo (dados completos)

---

## Resultado Esperado

1. Um único webhook terá TODOS os dados necessários
2. n8n recebe perfil completo + resultados do cálculo
3. Facilita automações (enviar para CRM, Google Sheets, etc.)
4. Correlação automática entre diagnóstico e cálculo

