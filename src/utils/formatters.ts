
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
// Função para formatação em tempo real durante a digitação
export const formatCurrencyAsTyping = (inputValue: string, allowDecimals: boolean = true): string => {
  if (!inputValue) return '';
  
  // Remove tudo exceto números, vírgulas e pontos
  let cleanValue = inputValue.replace(/[^\d,\.]/g, '');
  
  if (!cleanValue) return '';
  
  if (allowDecimals) {
    // Se tem vírgula, trata como separador decimal
    if (cleanValue.includes(',')) {
      const parts = cleanValue.split(',');
      const integerPart = parts[0].replace(/\./g, ''); // Remove pontos da parte inteira
      const decimalPart = parts[1] ? parts[1].substring(0, 2) : ''; // Máximo 2 decimais
      
      if (/^\d+$/.test(integerPart)) {
        // Formata a parte inteira com separadores de milhares
        const formattedInteger = parseInt(integerPart).toLocaleString('pt-BR');
        return decimalPart ? `R$ ${formattedInteger},${decimalPart}` : `R$ ${formattedInteger},`;
      }
    } else {
      // Apenas números inteiros
      const num = parseInt(cleanValue.replace(/\./g, ''));
      if (!isNaN(num)) {
        return `R$ ${num.toLocaleString('pt-BR')}`;
      }
    }
  } else {
    // Sem decimais
    const num = parseInt(cleanValue.replace(/\./g, ''));
    if (!isNaN(num)) {
      return `R$ ${num.toLocaleString('pt-BR')}`;
    }
  }
  
  return '';
};

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

// Função para converter números para extenso em português brasileiro
export const numeroParaExtenso = (numero: number): string => {
  if (numero === 0) return 'zero reais';

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const converterGrupo = (num: number): string => {
    if (num === 0) return '';
    
    let resultado = '';
    const centena = Math.floor(num / 100);
    const resto = num % 100;
    const dezena = Math.floor(resto / 10);
    const unidade = resto % 10;

    if (centena === 1 && resto === 0) {
      resultado = 'cem';
    } else if (centena > 0) {
      resultado = centenas[centena];
    }

    if (resto >= 10 && resto <= 19) {
      if (resultado) resultado += ' e ';
      resultado += especiais[resto - 10];
    } else {
      if (dezena > 0) {
        if (resultado) resultado += ' e ';
        resultado += dezenas[dezena];
      }
      if (unidade > 0) {
        if (resultado) resultado += ' e ';
        resultado += unidades[unidade];
      }
    }

    return resultado;
  };

  // Separar reais e centavos
  const reais = Math.floor(numero);
  const centavos = Math.round((numero - reais) * 100);

  let resultado = '';

  if (reais > 0) {
    const bilhoes = Math.floor(reais / 1000000000);
    const milhoes = Math.floor((reais % 1000000000) / 1000000);
    const milhares = Math.floor((reais % 1000000) / 1000);
    const resto = reais % 1000;

    if (bilhoes > 0) {
      resultado += converterGrupo(bilhoes);
      resultado += bilhoes === 1 ? ' bilhão' : ' bilhões';
      if (milhoes > 0 || milhares > 0 || resto > 0) {
        resultado += (milhoes === 0 && milhares === 0) ? ' e ' : ', ';
      }
    }

    if (milhoes > 0) {
      resultado += converterGrupo(milhoes);
      resultado += milhoes === 1 ? ' milhão' : ' milhões';
      if (milhares > 0 || resto > 0) {
        resultado += milhares === 0 ? ' e ' : ', ';
      }
    }

    if (milhares > 0) {
      resultado += converterGrupo(milhares);
      resultado += ' mil';
      if (resto > 0) {
        resultado += resto < 100 ? ' e ' : ', ';
      }
    }

    if (resto > 0) {
      resultado += converterGrupo(resto);
    }

    resultado += reais === 1 ? ' real' : ' reais';
  }

  if (centavos > 0) {
    if (reais > 0) resultado += ' e ';
    resultado += converterGrupo(centavos);
    resultado += centavos === 1 ? ' centavo' : ' centavos';
  }

  // Capitalizar primeira letra
  return resultado.charAt(0).toUpperCase() + resultado.slice(1);
};
