
export interface DadosCalculoInventario {
  patrimonio: number;
  estado: string;
  tipoProcesso: 'judicial' | 'extrajudicial';
  numeroHerdeiros?: number;
  temTestamento?: boolean;
  temMenoresIncapazes?: boolean;
  temLitigio?: boolean;
  valorImoveis?: number;
  valorVeiculos?: number;
  valorInvestimentos?: number;
  valorOutrosBens?: number;
  dividasEspolio?: number;
  // Novos campos para versão avançada
  valorImoveisIR?: number;
  valorImoveisMercado?: number;
  valorBensIR?: number;
  valorBensMercado?: number;
}

export interface DetalhamentoCusto {
  valor: number;
  valorMinimo?: number;
  valorMaximo?: number;
  percentual?: number;
  descricao: string;
  isRange?: boolean;
  informativo?: string;
  tooltip?: string;
}

export interface ComparacaoProcesso {
  custo: number;
  tempo: string;
  economia?: number;
}

export interface InsightPersonalizado {
  tipo: 'economia' | 'estrategia' | 'informacao';
  titulo: string;
  descricao: string;
  valor?: number;
}

export interface ResultadoCalculo {
  patrimonio: number;
  estado: string;
  tipoProcesso: string;
  detalhamento: {
    itcmd: DetalhamentoCusto;
    honorarios: DetalhamentoCusto;
    custas: DetalhamentoCusto;
    cartorio: DetalhamentoCusto;
    itbi: DetalhamentoCusto;
  };
  resumo: {
    custoTotal: number;
    custoTotalFormatado: string;
    tempoEstimado: string;
    economiaHolding: number;
    percentualSobrePatrimonio: string;
  };
  comparacao: {
    judicial: ComparacaoProcesso;
    extrajudicial: ComparacaoProcesso;
    holding: ComparacaoProcesso;
  };
  insights: InsightPersonalizado[];
  alertas: ReturnType<typeof import('../validators').gerarAlertas>;
  validacao: ReturnType<typeof import('../validators').verificarExtrajudicial>;
}

export interface DadosRefinamento {
  valorVenalImoveis?: string;
  valorMercadoImoveis?: string;
  valorFipeVeiculos?: string;
  temTestamento?: boolean;
  temMenoresIncapazes?: boolean;
  temLitigio?: boolean;
  separacaoTotalBens?: boolean;
  dividasGarantia?: string;
  debitosTributarios?: string;
  despesasMedicas?: string;
  percentualHonorarios?: string;
  comarca?: string;
  unicoImovelResidencial?: boolean;
  herdeirosComIsencao?: boolean;
  empresaFamiliar?: boolean;
}

export interface ResultadoRefinado {
  totalRefinado: number;
  patrimonioLiquido: number;
  ajustes: Array<{
    nome: string;
    impacto: string;
    descricao: string;
  }>;
  isencoes: Array<{
    tipo: string;
    valor: number;
  }>;
  comparativo: {
    calculoOriginal: number;
    calculoRefinado: number;
    diferenca: number;
    percentualDiferenca: string;
  };
  temLitigio?: boolean;
}
