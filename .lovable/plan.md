
## Plano: Corrigir Problema de Clique nos Selects e Radio Buttons

### Problema Identificado
Os elementos interativos (radio buttons da faixa de patrimonio, selects de estado/parentesco/tipo) nao conseguem receber cliques porque estao sendo cobertos por elementos decorativos posicionados absolutamente.

**Causa raiz encontrada em 3 lugares:**

1. **GlassCard.tsx (linha 58-70)**: O elemento shimmer decorativo tem `position: absolute` e `zIndex: 0`, mas os children do card nao tem `z-index` maior, fazendo com que o shimmer intercepte os cliques

2. **LuxuryRadioGroup.tsx**: Os labels dos radio buttons nao tem `position: relative` nem `z-index`, ficando "abaixo" de camadas decorativas

3. **LuxurySelect.tsx**: O select nativo nao tem `z-index` definido

### Solucao Proposta

**Arquivo 1: src/components/GlassCard.tsx**

Envolver os children em um container com z-index maior:

```tsx
// Linha 72 - antes: {children}
// Depois:
<div style={{ position: 'relative', zIndex: 1 }}>
  {children}
</div>
```

**Arquivo 2: src/components/ui/LuxuryRadioGroup.tsx**

Adicionar `position: relative` e `z-index` aos labels clicaveis:

```tsx
// Linha 32-40 - adicionar style ao label
<label
  key={option.value}
  style={{ position: 'relative', zIndex: 1 }}
  className={`
    flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300
    ${value === option.value 
      ? 'bg-primary/20 border-2 border-primary shadow-lg' 
      : 'bg-card/50 border-2 border-border/30 hover:border-primary/50 hover:bg-card/70'
    }
  `}
  // ... resto igual
>
```

**Arquivo 3: src/components/ui/LuxurySelect.tsx**

Adicionar `position: relative` e `z-index` ao select:

```tsx
// Linha 39-54 - adicionar ao style
style={{
  position: 'relative',
  zIndex: 1,
  background: '#FFFFFF',
  // ... resto dos estilos
}}
```

**Arquivo 4: src/components/ui/LuxuryField.tsx**

Garantir que o container do field tenha `position: relative`:

```tsx
// Linha 14
<div className={`space-y-3 ${className}`} style={{ position: 'relative', zIndex: 1 }}>
```

### Resultado Esperado

| Antes | Depois |
|-------|--------|
| Cliques nao registram nos radio buttons | Cliques funcionam normalmente |
| Selects nao abrem dropdown | Selects abrem e permitem selecao |
| Elementos decorativos bloqueiam interacao | Elementos interativos ficam acima das decoracoes |

### Arquivos Modificados
1. `src/components/GlassCard.tsx`
2. `src/components/ui/LuxuryRadioGroup.tsx`
3. `src/components/ui/LuxurySelect.tsx`
4. `src/components/ui/LuxuryField.tsx`

### Testes Recomendados
Apos implementacao, testar:
- Clicar em cada opcao de faixa de patrimonio (5M, 20M, 50M)
- Selecionar estado no dropdown
- Selecionar parentesco e tipo nos herdeiros
- Clicar nos radio buttons de Sim/Nao (holding, empresas, imoveis)
