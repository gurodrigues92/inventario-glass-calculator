
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatCurrencyInput = (value: string): string => {
  const numValue = value.replace(/\D/g, '');
  if (!numValue) return '';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(numValue) / 100);
};

export const parseCurrencyValue = (value: string): number => {
  return parseFloat(value.replace(/[R$.\s]/g, '').replace(',', '.')) || 0;
};
