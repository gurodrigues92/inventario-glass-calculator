

## Plano: Salvar Calculo Automaticamente ao Carregar Resultados

### Objetivo
Remover o botao "Salvar Calculo" e o modal que pede nome. O calculo sera salvo automaticamente quando a pagina de resultados carrega, usando o nome do usuario logado.

### Problema de RLS Identificado

Nos network requests, ha um erro critico:
```
POST /rest/v1/profiles → 401
"new row violates row-level security policy for table profiles"
```

A policy atual de INSERT na tabela `profiles` exige que `auth.uid() = id`, mas estamos usando autenticacao customizada (tabela `usuarios`), nao Supabase Auth. Por isso, `auth.uid()` retorna `null` e a insercao falha.

### Solucao em 2 Partes

---

## Parte 1: Corrigir RLS da tabela `profiles`

A politica atual:
```sql
Policy: "Usuários autenticados podem inserir seu próprio perfil"
WITH CHECK: (SELECT auth.uid() AS uid) = id
```

**Problema**: O sistema usa autenticacao propria (tabela `usuarios`), nao Supabase Auth. `auth.uid()` sempre sera `null`.

**Solucao**: Criar uma edge function `salvar-calculo` que use `service_role` para inserir dados, similar ao `salvar-diagnostico`.

---

## Parte 2: Implementar Auto-Save

### Arquivos a Modificar

| Arquivo | Mudanca |
|---------|---------|
| `src/hooks/useResultsSave.ts` | Adicionar funcao `autoSaveCalculo` que salva via edge function |
| `src/hooks/useResultsData.ts` | Chamar auto-save apos carregar resultados |
| `src/pages/Results.tsx` | Remover modal e botao "Salvar Calculo" |
| `src/components/ResultsActions.tsx` | Remover botao "Salvar Calculo" |
| `supabase/functions/salvar-calculo/index.ts` | Nova edge function (CRIAR) |

---

### Nova Edge Function: `salvar-calculo`

```typescript
// supabase/functions/salvar-calculo/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const data = await req.json()
    const { usuarioId, nome, email, dadosCalculo, tipoCalculadora } = data

    // 1. Buscar ou criar profile
    let profileId: string

    if (usuarioId) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('usuario_id', usuarioId)
        .maybeSingle()

      if (existingProfile) {
        profileId = existingProfile.id
      } else {
        const { data: newProfile, error } = await supabase
          .from('profiles')
          .insert({ nome, email, usuario_id: usuarioId })
          .select('id')
          .single()
        
        if (error) throw error
        profileId = newProfile.id
      }
    } else {
      // Usuario anonimo
      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert({ nome: nome || 'Anonimo' })
        .select('id')
        .single()
      
      if (error) throw error
      profileId = newProfile.id
    }

    // 2. Salvar calculo
    const { data: calculo, error: calculoError } = await supabase
      .from('calculos_inventario')
      .insert({
        profile_id: profileId,
        ...dadosCalculo
      })
      .select('id')
      .single()

    if (calculoError) throw calculoError

    // 3. Registrar historico
    await supabase.from('historico_consultas').insert({
      profile_id: profileId,
      tipo_calculadora: tipoCalculadora,
      user_agent: req.headers.get('user-agent')
    })

    return new Response(
      JSON.stringify({ success: true, calculoId: calculo.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
```

---

### Mudancas em `useResultsSave.ts`

Remover `salvarCalculo` via client e usar edge function:

```typescript
const autoSaveCalculo = async () => {
  if (!resultado || !formData || calculoSalvoId) return;

  const { data, error } = await supabase.functions.invoke('salvar-calculo', {
    body: {
      usuarioId: user?.id || null,
      nome: user?.nome || 'Visitante',
      email: user?.email || null,
      dadosCalculo: { ... },
      tipoCalculadora: calculationType === 'advanced' ? 'avancada' : 'basica'
    }
  });

  if (data?.success) {
    setCalculoSalvoId(data.calculoId);
  }
};
```

---

### Mudancas em `useResultsData.ts`

Chamar auto-save quando loading terminar:

```typescript
useEffect(() => {
  if (!isLoading && hasValidData && resultado) {
    autoSaveCalculo();
  }
}, [isLoading, hasValidData]);
```

---

### Mudancas em `Results.tsx`

1. Remover `useState(showSalvarModal)`
2. Remover import `SalvarCalculoModal`
3. Remover componente `<SalvarCalculoModal />`
4. Remover prop `onSalvar` do `ResultsActions`

---

### Mudancas em `ResultsActions.tsx`

1. Remover prop `onSalvar`
2. Remover botao "Salvar Calculo"
3. Manter apenas "Baixar PDF" e "Nova Consulta"

---

### Fluxo Resultante

```text
Usuario preenche formulario
        ↓
Clica "Calcular"
        ↓
Navega para /resultados
        ↓
useResultsData carrega dados
        ↓
Loading termina → Auto-save dispara
        ↓
Edge function salvar-calculo executa
        ↓
Calculo disponivel em "Meus Calculos"
```

---

### Arquivos Criados/Modificados

| Arquivo | Acao |
|---------|------|
| `supabase/functions/salvar-calculo/index.ts` | CRIAR |
| `src/hooks/useResultsSave.ts` | MODIFICAR (usar edge function) |
| `src/hooks/useResultsData.ts` | MODIFICAR (chamar auto-save) |
| `src/pages/Results.tsx` | MODIFICAR (remover modal) |
| `src/components/ResultsActions.tsx` | MODIFICAR (remover botao salvar) |
| `src/components/SalvarCalculoModal.tsx` | REMOVER (nao mais necessario) |

