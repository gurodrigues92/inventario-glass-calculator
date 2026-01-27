

## Plano: Corrigir Radio Buttons e Selects que Nao Respondem a Cliques

### Problema Identificado

O componente `LuxuryRadioGroup` nao tem nenhum evento de clique configurado. Os labels sao puramente visuais e nao disparam a funcao `onChange` quando clicados.

**Codigo atual (linha 32-64 de LuxuryRadioGroup.tsx):**

```tsx
<label
  key={option.value}
  className={...}
  style={{ ... }}
>
  // Visual do radio button
  // Texto da opcao
</label>
```

**O que falta**: Um `onClick` handler no label para chamar `onChange(option.value)`.

---

### Solucao

**Arquivo: `src/components/ui/LuxuryRadioGroup.tsx`**

Adicionar `onClick` ao label para disparar a mudanca de valor:

```tsx
<label
  key={option.value}
  onClick={() => onChange(option.value)}  // <-- ADICIONAR ISSO
  className={`
    flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300
    ${value === option.value 
      ? 'bg-primary/20 border-2 border-primary shadow-lg' 
      : 'bg-card/50 border-2 border-border/30 hover:border-primary/50 hover:bg-card/70'
    }
  `}
  style={{ 
    minWidth: orientation === 'horizontal' ? '140px' : 'auto',
    position: 'relative',
    zIndex: 1
  }}
>
```

---

### Mudanca Completa

Linha 32-46 do arquivo `src/components/ui/LuxuryRadioGroup.tsx`:

**Antes:**
```tsx
<label
  key={option.value}
  className={`
    flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300
    ${value === option.value 
      ? 'bg-primary/20 border-2 border-primary shadow-lg' 
      : 'bg-card/50 border-2 border-border/30 hover:border-primary/50 hover:bg-card/70'
    }
  `}
  style={{ 
    minWidth: orientation === 'horizontal' ? '140px' : 'auto',
    position: 'relative',
    zIndex: 1
  }}
>
```

**Depois:**
```tsx
<label
  key={option.value}
  onClick={() => onChange(option.value)}
  className={`
    flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300
    ${value === option.value 
      ? 'bg-primary/20 border-2 border-primary shadow-lg' 
      : 'bg-card/50 border-2 border-border/30 hover:border-primary/50 hover:bg-card/70'
    }
  `}
  style={{ 
    minWidth: orientation === 'horizontal' ? '140px' : 'auto',
    position: 'relative',
    zIndex: 1
  }}
>
```

---

### Resultado Esperado

| Componente | Antes | Depois |
|------------|-------|--------|
| Faixa de Patrimonio (5M, 20M, 50M) | Nao responde a clique | Seleciona ao clicar |
| Radio "Possui Holding?" | Nao responde a clique | Alterna Sim/Nao ao clicar |
| Radio "Empresas LTDA?" | Nao responde a clique | Alterna Sim/Nao ao clicar |
| Radio "Imoveis Alugados?" | Nao responde a clique | Alterna Sim/Nao ao clicar |

### Arquivo Modificado

- `src/components/ui/LuxuryRadioGroup.tsx` (1 linha adicionada)

### Observacao sobre os Selects

Os selects (`LuxurySelect`) ja possuem o `onChange` corretamente configurado no elemento `<select>`. Se eles nao estiverem funcionando, pode ser um problema de z-index que o fix anterior ja deveria ter resolvido. Apos corrigir o LuxuryRadioGroup, testaremos se os selects tambem voltam a funcionar.

