
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatCurrencyWithDecimals = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatCurrencyInput = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numValue = value.replace(/\D/g, '');
  if (!numValue) return '';
  
  // Converte para número (em centavos)
  const num = Number(numValue) / 100;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatCurrencyInputWithoutDecimals = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numValue = value.replace(/\D/g, '');
  if (!numValue) return '';
  
  // Converte diretamente para número
  const num = Number(numValue);
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

export const parseCurrencyValue = (value: string): number => {
  if (!value) return 0;
  // Remove R$, espaços, pontos de milhar e substitui vírgula por ponto
  const cleanValue = value
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};
