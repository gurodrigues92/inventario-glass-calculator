

## Plano: Padronizar LuxuryInput com Tema Claro

### Problema Identificado
O componente `LuxuryInput` está usando estilos do tema escuro antigo:
- Fundo escuro: `rgba(26, 26, 26, 0.7)`
- Texto claro: `#e1e5ea`
- Borda escura: `rgba(133, 149, 171, 0.3)`

Enquanto os componentes `LuxurySelect` e `LuxuryTextarea` já foram atualizados para tema claro.

### Solução
Atualizar `src/components/ui/LuxuryInput.tsx` para usar o mesmo padrão visual dos outros componentes.

### Alterações em `src/components/ui/LuxuryInput.tsx`

**De (atual):**
```tsx
style={{
  background: 'rgba(26, 26, 26, 0.7)',
  border: '1px solid rgba(133, 149, 171, 0.3)',
  borderRadius: '12px',
  color: '#e1e5ea',
  padding: '20px',
  fontSize: '18px',
  fontWeight: '600',
  transition: 'all 0.3s ease'
}}
```

**Para (novo):**
```tsx
style={{
  background: '#FFFFFF',
  border: '1px solid #E8E2DD',
  borderRadius: '8px',
  color: '#2C2C2C',
  padding: '16px',
  fontSize: '16px',
  fontWeight: '500',
  transition: 'all 0.3s ease'
}}
onFocus={(e) => {
  e.currentTarget.style.borderColor = '#9FB7D4';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
}}
onBlur={(e) => {
  e.currentTarget.style.borderColor = '#E8E2DD';
  e.currentTarget.style.boxShadow = 'none';
}}
```

### Também atualizar a mensagem de hint
**De:**
```tsx
<div className="text-xs text-purple-300 italic">
  💡 {hint}
</div>
```

**Para:**
```tsx
<div className="text-xs italic" style={{ color: '#476D9E' }}>
  💡 {hint}
</div>
```

### Campos que serão corrigidos automaticamente
Todos os inputs que usam `LuxuryInput` terão fundo branco:
- Nome Completo
- Cidade
- CNPJ da Holding
- CNPJ das empresas
- Faturamento Anual
- Receita de Aluguel
- Nome dos herdeiros

### Resultado Esperado
Todos os campos de input terão a mesma aparência visual dos selects e textarea, com fundo branco harmonizando com o resto da página.

