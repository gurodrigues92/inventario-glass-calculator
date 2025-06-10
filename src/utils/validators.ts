
interface DadosInventario {
  patrimonio: number;
  estado: string;
  tipoProcesso: string;
  temTestamento?: boolean;
  temMenoresIncapazes?: boolean;
  temLitigio?: boolean;
}

export interface ValidacaoResult {
  permitido: boolean;
  impedimentos: string[];
  mensagem: string;
}

export interface Alerta {
  tipo: 'info' | 'warning' | 'success';
  mensagem: string;
}

export const verificarExtrajudicial = (dados: DadosInventario): ValidacaoResult => {
  const impedimentos: string[] = [];
  
  if (dados.temMenoresIncapazes) {
    impedimentos.push('Há herdeiros menores ou incapazes');
  }
  
  if (dados.temLitigio) {
    impedimentos.push('Existe possibilidade de litígio entre herdeiros');
  }
  
  return {
    permitido: impedimentos.length === 0,
    impedimentos,
    mensagem: impedimentos.length > 0 ? 
      `O inventário extrajudicial não é possível porque: ${impedimentos.join(', ')}` : 
      'Inventário extrajudicial é possível neste caso'
  };
};

export const gerarAlertas = (patrimonio: number, estado: string): Alerta[] => {
  const alertas: Alerta[] = [];
  
  if (patrimonio > 5000000) {
    alertas.push({
      tipo: 'info',
      mensagem: 'Para patrimônios elevados, considere consultoria especializada em planejamento sucessório'
    });
  }
  
  if (['SC', 'AL', 'PE', 'BA', 'PR', 'MG', 'RJ', 'SP'].includes(estado) && patrimonio > 2000000) {
    alertas.push({
      tipo: 'warning',
      mensagem: 'Este estado possui alíquota progressiva que pode chegar a 8% para patrimônios elevados'
    });
  }
  
  if (['AM', 'AP', 'CE', 'RR', 'SE'].includes(estado)) {
    alertas.push({
      tipo: 'success',
      mensagem: 'Este estado possui uma das menores alíquotas de ITCMD do país (2%)'
    });
  }
  
  return alertas;
};
