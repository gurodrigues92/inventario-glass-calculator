
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

// Nova função melhorada para input de moeda com decimais
export const formatSmartCurrencyInput = (inputValue: string, allowDecimals: boolean = true): string => {
  if (!inputValue) return '';
  
  // Remove R$ e espaços do início se existirem
  let cleanValue = inputValue.replace(/^R\$\s?/, '');
  
  if (allowDecimals) {
    // Para valores com decimais - aceita diferentes formatos de entrada
    // Remove tudo exceto números, vírgulas e pontos
    cleanValue = cleanValue.replace(/[^\d,\.]/g, '');
    
    // Se não tem vírgula nem ponto, trata como número inteiro
    if (!cleanValue.includes(',') && !cleanValue.includes('.')) {
      if (cleanValue) {
        const num = parseInt(cleanValue);
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(num);
      }
      return '';
    }
    
    // Se tem vírgula, trata como separador decimal brasileiro
    if (cleanValue.includes(',')) {
      // Formatos aceitos: "1000,50", "1.000,50"
      const parts = cleanValue.split(',');
      if (parts.length === 2) {
        // Remove pontos da parte inteira (milhares)
        const integerPart = parts[0].replace(/\./g, '');
        // Limita decimais a 2 dígitos
        const decimalPart = parts[1].substring(0, 2);
        
        if (integerPart && /^\d+$/.test(integerPart) && /^\d{0,2}$/.test(decimalPart)) {
          const num = parseFloat(`${integerPart}.${decimalPart.padEnd(2, '0')}`);
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(num);
        }
      }
    }
    
    // Se tem apenas ponto e é um formato como "1000.50" (formato americano)
    if (cleanValue.includes('.') && !cleanValue.includes(',')) {
      const parts = cleanValue.split('.');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Pode ser decimal no formato americano
        const num = parseFloat(cleanValue);
        if (!isNaN(num)) {
          return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(num);
        }
      }
      // Senão, trata pontos como separadores de milhares
      const integerPart = cleanValue.replace(/\./g, '');
      if (/^\d+$/.test(integerPart)) {
        const num = parseInt(integerPart);
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(num);
      }
    }
  } else {
    // Para valores sem decimais (comportamento original melhorado)
    const numValue = cleanValue.replace(/\D/g, '');
    if (numValue) {
      const num = parseInt(numValue);
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    }
  }
  
  return '';
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
