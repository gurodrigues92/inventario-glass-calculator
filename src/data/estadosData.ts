
// Base de dados dos estados com alíquotas ITCMD reais (2025)
export interface AliquotaConfig {
  tipo: 'fixa' | 'progressiva';
  aliquota?: number;
  faixas?: Array<{
    limite: number;
    aliquota: number;
  }>;
}

export interface EstadoData {
  uf: string;
  nome: string;
  itcmd: AliquotaConfig;
}

export const ESTADOS_DATA: Record<string, EstadoData> = {
  'AC': {
    uf: 'AC',
    nome: 'Acre',
    itcmd: { tipo: 'fixa', aliquota: 0.04 }
  },
  'AL': {
    uf: 'AL',
    nome: 'Alagoas',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 100000, aliquota: 0.02 },
        { limite: 500000, aliquota: 0.04 },
        { limite: 1000000, aliquota: 0.06 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'AP': {
    uf: 'AP',
    nome: 'Amapá',
    itcmd: { tipo: 'fixa', aliquota: 0.02 }
  },
  'AM': {
    uf: 'AM',
    nome: 'Amazonas',
    itcmd: { tipo: 'fixa', aliquota: 0.02 }
  },
  'BA': {
    uf: 'BA',
    nome: 'Bahia',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 100000, aliquota: 0.02 },
        { limite: 200000, aliquota: 0.04 },
        { limite: 300000, aliquota: 0.06 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'CE': {
    uf: 'CE',
    nome: 'Ceará',
    itcmd: { tipo: 'fixa', aliquota: 0.02 }
  },
  'DF': {
    uf: 'DF',
    nome: 'Distrito Federal',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 50000, aliquota: 0.04 },
        { limite: 100000, aliquota: 0.05 },
        { limite: Infinity, aliquota: 0.06 }
      ]
    }
  },
  'ES': {
    uf: 'ES',
    nome: 'Espírito Santo',
    itcmd: { tipo: 'fixa', aliquota: 0.04 }
  },
  'GO': {
    uf: 'GO',
    nome: 'Goiás',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 25000, aliquota: 0.02 },
        { limite: 200000, aliquota: 0.04 },
        { limite: 600000, aliquota: 0.06 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'MA': {
    uf: 'MA',
    nome: 'Maranhão',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 25000, aliquota: 0.03 },
        { limite: 50000, aliquota: 0.04 },
        { limite: 100000, aliquota: 0.05 },
        { limite: 300000, aliquota: 0.06 },
        { limite: 600000, aliquota: 0.07 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'MT': {
    uf: 'MT',
    nome: 'Mato Grosso',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 5100, aliquota: 0 },
        { limite: 13600, aliquota: 0.02 },
        { limite: 27200, aliquota: 0.04 },
        { limite: 54400, aliquota: 0.06 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'MS': {
    uf: 'MS',
    nome: 'Mato Grosso do Sul',
    itcmd: { tipo: 'fixa', aliquota: 0.06 }
  },
  'MG': {
    uf: 'MG',
    nome: 'Minas Gerais',
    itcmd: { tipo: 'fixa', aliquota: 0.05 }
  },
  'PA': {
    uf: 'PA',
    nome: 'Pará',
    itcmd: { tipo: 'fixa', aliquota: 0.04 }
  },
  'PB': {
    uf: 'PB',
    nome: 'Paraíba',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 75000, aliquota: 0.02 },
        { limite: 150000, aliquota: 0.04 },
        { limite: 590000, aliquota: 0.06 },
        { limite: 1180000, aliquota: 0.06 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'PR': {
    uf: 'PR',
    nome: 'Paraná',
    itcmd: { tipo: 'fixa', aliquota: 0.04 }
  },
  'PE': {
    uf: 'PE',
    nome: 'Pernambuco',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 317412, aliquota: 0.02 },
        { limite: 476118, aliquota: 0.04 },
        { limite: 634824, aliquota: 0.06 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'PI': {
    uf: 'PI',
    nome: 'Piauí',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 10000, aliquota: 0.02 },
        { limite: 150000, aliquota: 0.04 },
        { limite: Infinity, aliquota: 0.06 }
      ]
    }
  },
  'RJ': {
    uf: 'RJ',
    nome: 'Rio de Janeiro',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 400000, aliquota: 0.04 },
        { limite: 1000000, aliquota: 0.06 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'RN': {
    uf: 'RN',
    nome: 'Rio Grande do Norte',
    itcmd: { tipo: 'fixa', aliquota: 0.04 }
  },
  'RS': {
    uf: 'RS',
    nome: 'Rio Grande do Sul',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 700000, aliquota: 0.03 },
        { limite: 1200000, aliquota: 0.04 },
        { limite: 2000000, aliquota: 0.05 },
        { limite: Infinity, aliquota: 0.06 }
      ]
    }
  },
  'RO': {
    uf: 'RO',
    nome: 'Rondônia',
    itcmd: { tipo: 'fixa', aliquota: 0.04 }
  },
  'RR': {
    uf: 'RR',
    nome: 'Roraima',
    itcmd: { tipo: 'fixa', aliquota: 0.02 }
  },
  'SC': {
    uf: 'SC',
    nome: 'Santa Catarina',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 250000, aliquota: 0.01 },
        { limite: 500000, aliquota: 0.03 },
        { limite: 1000000, aliquota: 0.05 },
        { limite: 2000000, aliquota: 0.07 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'SP': {
    uf: 'SP',
    nome: 'São Paulo',
    itcmd: {
      tipo: 'progressiva',
      faixas: [
        { limite: 276000, aliquota: 0.04 },
        { limite: 1000000, aliquota: 0.05 },
        { limite: 3000000, aliquota: 0.06 },
        { limite: 5000000, aliquota: 0.07 },
        { limite: Infinity, aliquota: 0.08 }
      ]
    }
  },
  'SE': {
    uf: 'SE',
    nome: 'Sergipe',
    itcmd: { tipo: 'fixa', aliquota: 0.02 }
  },
  'TO': {
    uf: 'TO',
    nome: 'Tocantins',
    itcmd: { tipo: 'fixa', aliquota: 0.04 }
  }
};

export const getAliquotaDisplay = (uf: string): string => {
  const estado = ESTADOS_DATA[uf];
  if (!estado) return '';
  
  if (estado.itcmd.tipo === 'fixa') {
    return `${(estado.itcmd.aliquota! * 100).toFixed(0)}%`;
  } else {
    const faixas = estado.itcmd.faixas!;
    const minAliquota = Math.min(...faixas.map(f => f.aliquota));
    const maxAliquota = Math.max(...faixas.map(f => f.aliquota));
    return `${(minAliquota * 100).toFixed(0)}% - ${(maxAliquota * 100).toFixed(0)}%`;
  }
};
