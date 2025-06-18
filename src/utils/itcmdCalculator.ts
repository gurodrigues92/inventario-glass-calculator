
import { ESTADOS_DATA } from '../data/estadosData';
import { formatCurrency } from './formatters';
import { gerarAlertas, verificarExtrajudicial } from './validators';

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

// Dados de isenções ITBI por estado
const ISENCOES_ITBI = {
  'SP': { limite: 200000, percentual: 100 }, // Isenção total até R$ 200k
  'RJ': { limite: 150000, percentual: 100 }, // Isenção total até R$ 150k
  'MG': { limite: 100000, percentual: 50 },  // 50% de redução até R$ 100k
  'RS': { limite: 250000, percentual: 100 }, // Isenção total até R$ 250k
  'PR': { limite: 180000, percentual: 100 }, // Isenção total até R$ 180k
};

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
  alertas: ReturnType<typeof gerarAlertas>;
  validacao: ReturnType<typeof verificarExtrajudicial>;
}

interface DadosRefinamento {
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

interface ResultadoRefinado {
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

const calcularITCMDProgressivo = (patrimonio: number, estado: string): number => {
  const estadoData = ESTADOS_DATA[estado];
  if (!estadoData || estadoData.itcmd.tipo !== 'progressiva') {
    return 0;
  }
  
  const faixas = estadoData.itcmd.faixas!;
  let imposto = 0;
  let valorRestante = patrimonio;
  let faixaAnterior = 0;
  
  for (const faixa of faixas) {
    const valorNaFaixa = Math.min(valorRestante, faixa.limite - faixaAnterior);
    if (valorNaFaixa > 0) {
      imposto += valorNaFaixa * faixa.aliquota;
      valorRestante -= valorNaFaixa;
      faixaAnterior = faixa.limite;
    }
    if (valorRestante <= 0) break;
  }
  
  return imposto;
};

const calcularHonorariosVariaveis = (patrimonio: number, tipoProcesso: string, temLitigio: boolean = false) => {
  if (temLitigio) {
    return {
      valor: patrimonio * 0.20,
      percentual: 20,
      descricao: 'Honorários com litígio (20%)',
      isRange: false
    };
  }

  if (tipoProcesso === 'judicial') {
    const minimo = patrimonio * 0.015; // 1,5%
    const maximo = patrimonio * 0.017; // 1,7%
    return {
      valor: (minimo + maximo) / 2, // Valor médio para cálculos
      valorMinimo: minimo,
      valorMaximo: maximo,
      percentual: 1.6, // Percentual médio
      descricao: 'Honorários advocatícios (1,5% a 1,7%)',
      isRange: true
    };
  } else {
    const minimo = patrimonio * 0.015; // 1,5%
    const maximo = patrimonio * 0.017; // 1,7%
    return {
      valor: (minimo + maximo) / 2,
      valorMinimo: minimo,
      valorMaximo: maximo,
      percentual: 1.6,
      descricao: 'Honorários extrajudiciais (1,5% a 1,7%)',
      isRange: true
    };
  }
};

const calcularITBIInteligente = (valorImoveis: number, estado: string) => {
  const aliquotaPadrao = 0.03; // 3%
  let itbi = valorImoveis * aliquotaPadrao;
  let descricao = `ITBI sobre imóveis (3%)`;
  let informativo = null;

  const isencao = ISENCOES_ITBI[estado];
  if (isencao && valorImoveis <= isencao.limite) {
    if (isencao.percentual === 100) {
      itbi = 0;
      informativo = `Imóvel isento de ITBI em ${estado} até ${formatCurrency(isencao.limite)}`;
      descricao = `ITBI - Isento em ${estado}`;
    } else {
      const reducao = itbi * (isencao.percentual / 100);
      itbi = itbi - reducao;
      informativo = `Redução de ${isencao.percentual}% no ITBI em ${estado} até ${formatCurrency(isencao.limite)}`;
      descricao = `ITBI com redução de ${isencao.percentual}% (${estado})`;
    }
  }

  return {
    valor: itbi,
    percentual: valorImoveis > 0 ? (itbi / valorImoveis * 100) : 0,
    descricao,
    informativo
  };
};

const gerarInsights = (dados: DadosCalculoInventario, custoTotal: number, economiaHolding: number): InsightPersonalizado[] => {
  const insights: InsightPersonalizado[] = [];
  
  // Insight sobre economia com extrajudicial
  if (dados.tipoProcesso === 'judicial' && !dados.temMenoresIncapazes && !dados.temLitigio) {
    const economiaExtrajudicial = (dados.patrimonio * 0.04) + 2000;
    insights.push({
      tipo: 'economia',
      titulo: 'Economia com Inventário Extrajudicial',
      descricao: `Você poderia economizar aproximadamente ${formatCurrency(economiaExtrajudicial)} optando pelo inventário extrajudicial.`,
      valor: economiaExtrajudicial
    });
  }
  
  // Insight sobre holding - com destaque especial
  if (economiaHolding > 100000) {
    insights.push({
      tipo: 'estrategia',
      titulo: '💡 Holding Familiar S/A - Recomendado para Grandes Patrimônios',
      descricao: `Uma Holding Familiar S/A poderia gerar economia de ${formatCurrency(economiaHolding)} nos custos sucessórios e ainda profissionalizar a gestão do patrimônio.`,
      valor: economiaHolding
    });
  }
  
  // Insight sobre testamento
  if (!dados.temTestamento && dados.tipoProcesso === 'extrajudicial') {
    insights.push({
      tipo: 'informacao',
      titulo: 'Testamento Acelera o Processo',
      descricao: 'Com um testamento válido, o inventário extrajudicial pode ser concluído em até 60 dias.'
    });
  }

  // Insight sobre Lei da Legítima
  insights.push({
    tipo: 'informacao',
    titulo: 'Lei da Legítima',
    descricao: '50% do patrimônio obrigatoriamente pertence aos herdeiros legais (descendentes, ascendentes ou cônjuge). Os outros 50% podem ser dispostos livremente.'
  });
  
  return insights;
};

export const calcularCustosInventario = (dados: DadosCalculoInventario): ResultadoCalculo => {
  const {
    patrimonio,
    estado,
    tipoProcesso,
    temTestamento = false,
    temMenoresIncapazes = false,
    temLitigio = false,
    valorImoveis = 0
  } = dados;
  
  // 1. Calcular ITCMD
  let itcmd = 0;
  const estadoData = ESTADOS_DATA[estado];
  let descricaoITCMD = '';
  
  if (estadoData) {
    if (estadoData.itcmd.tipo === 'fixa') {
      itcmd = patrimonio * estadoData.itcmd.aliquota!;
      descricaoITCMD = `ITCMD ${estado} - ${(estadoData.itcmd.aliquota! * 100).toFixed(0)}%`;
    } else {
      itcmd = calcularITCMDProgressivo(patrimonio, estado);
      descricaoITCMD = `ITCMD ${estado} - Alíquota progressiva`;
    }
  }
  
  // 2. Calcular honorários advocatícios (VARIÁVEIS)
  const honorarios = calcularHonorariosVariaveis(patrimonio, tipoProcesso, temLitigio);
  
  // 3. Calcular custas e emolumentos
  let custas = 0;
  if (tipoProcesso === 'judicial') {
    custas = Math.max(5000, patrimonio * 0.001);
  } else {
    custas = Math.max(3000, patrimonio * 0.0005);
  }
  
  // 4. Calcular cartório/registro
  const cartorio = patrimonio * 0.01;
  
  // 5. Calcular ITBI inteligente com isenções
  const itbiResult = calcularITBIInteligente(valorImoveis, estado);
  
  // 6. Calcular custos holding
  const custosHolding = patrimonio * 0.045;
  
  // 7. Tempo estimado
  const tempoEstimado = tipoProcesso === 'judicial' 
    ? (temLitigio ? '5 a 8 anos' : '3 a 5 anos')
    : (temTestamento ? '60 a 90 dias' : '90 a 120 dias');
  
  // 8. Cálculo total
  const custoTotal = itcmd + honorarios.valor + custas + cartorio + itbiResult.valor;
  const economiaHolding = Math.max(0, custoTotal - custosHolding);
  
  // 9. Comparações
  const custoJudicial = itcmd + (patrimonio * 0.016) + 5000 + cartorio + itbiResult.valor; // Usando média dos honorários
  const custoExtrajudicial = itcmd + (patrimonio * 0.016) + 3000 + cartorio + itbiResult.valor;
  
  return {
    patrimonio,
    estado,
    tipoProcesso,
    detalhamento: {
      itcmd: {
        valor: itcmd,
        percentual: (itcmd / patrimonio * 100),
        descricao: descricaoITCMD
      },
      honorarios: {
        valor: honorarios.valor,
        valorMinimo: honorarios.valorMinimo,
        valorMaximo: honorarios.valorMaximo,
        percentual: honorarios.percentual,
        descricao: honorarios.descricao,
        isRange: honorarios.isRange
      },
      custas: {
        valor: custas,
        descricao: 'Custas processuais e emolumentos'
      },
      cartorio: {
        valor: cartorio,
        percentual: 1,
        descricao: 'Registro e averbações'
      },
      itbi: {
        valor: itbiResult.valor,
        percentual: itbiResult.percentual,
        descricao: itbiResult.descricao
      }
    },
    resumo: {
      custoTotal,
      custoTotalFormatado: formatCurrency(custoTotal),
      tempoEstimado,
      economiaHolding,
      percentualSobrePatrimonio: (custoTotal / patrimonio * 100).toFixed(2)
    },
    comparacao: {
      judicial: {
        custo: custoJudicial,
        tempo: temLitigio ? '5 a 8 anos' : '3 a 5 anos'
      },
      extrajudicial: {
        custo: custoExtrajudicial,
        tempo: temTestamento ? '60 a 90 dias' : '90 a 120 dias'
      },
      holding: {
        custo: custosHolding,
        economia: economiaHolding,
        tempo: '30 a 60 dias para constituição'
      }
    },
    insights: gerarInsights(dados, custoTotal, economiaHolding),
    alertas: gerarAlertas(patrimonio, estado),
    validacao: verificarExtrajudicial({ patrimonio, estado, tipoProcesso, temTestamento, temMenoresIncapazes, temLitigio })
  };
};

const parseCurrencyToNumber = (value: string | undefined): number => {
  if (!value) return 0;
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
};

export const aplicarRefinamentos = (calculoBase: ResultadoCalculo, dadosRefinados: DadosRefinamento): ResultadoRefinado => {
  let calculoRefinado = { ...calculoBase };
  const ajustes: Array<{ nome: string; impacto: string; descricao: string }> = [];
  const isencoes: Array<{ tipo: string; valor: number }> = [];

  // 1. Ajustar valores de patrimônio
  let patrimonioAjustado = calculoBase.patrimonio;
  
  if (dadosRefinados.valorVenalImoveis) {
    const valorVenal = parseCurrencyToNumber(dadosRefinados.valorVenalImoveis);
    // Alguns estados usam valor venal como base
    if (['SP', 'RJ', 'MG'].includes(calculoBase.estado)) {
      const diferenca = valorVenal - (calculoBase.patrimonio * 0.7); // Assume que 70% do patrimônio são imóveis
      if (Math.abs(diferenca) > 50000) {
        patrimonioAjustado += diferenca;
        ajustes.push({
          nome: 'Ajuste por Valor Venal',
          impacto: formatCurrency(diferenca),
          descricao: `Patrimônio ajustado baseado no valor venal dos imóveis`
        });
      }
    }
  }

  // 2. Deduzir dívidas
  const dividasGarantia = parseCurrencyToNumber(dadosRefinados.dividasGarantia);
  const debitosTributarios = parseCurrencyToNumber(dadosRefinados.debitosTributarios);
  const despesasMedicas = parseCurrencyToNumber(dadosRefinados.despesasMedicas);
  
  const totalDividas = dividasGarantia + debitosTributarios + despesasMedicas;
  const patrimonioLiquido = patrimonioAjustado - totalDividas;

  if (totalDividas > 0) {
    ajustes.push({
      nome: 'Dedução de Dívidas',
      impacto: formatCurrency(-totalDividas),
      descricao: `Dívidas deduzidas do patrimônio bruto`
    });
  }

  // 3. Recalcular ITCMD com patrimônio líquido
  let itcmdRefinado = 0;
  const estadoData = ESTADOS_DATA[calculoBase.estado];
  
  if (estadoData) {
    if (estadoData.itcmd.tipo === 'fixa') {
      itcmdRefinado = patrimonioLiquido * estadoData.itcmd.aliquota!;
    } else {
      itcmdRefinado = calcularITCMDProgressivo(patrimonioLiquido, calculoBase.estado);
    }
  }

  // 4. Ajustar honorários baseado em informações específicas
  let honorariosRefinados = calculoBase.detalhamento.honorarios.valor;
  
  if (dadosRefinados.percentualHonorarios) {
    const percentual = parseFloat(dadosRefinados.percentualHonorarios) / 100;
    honorariosRefinados = patrimonioLiquido * percentual;
    
    const diferencaHonorarios = honorariosRefinados - calculoBase.detalhamento.honorarios.valor;
    if (Math.abs(diferencaHonorarios) > 5000) {
      ajustes.push({
        nome: 'Honorários Específicos',
        impacto: formatCurrency(diferencaHonorarios),
        descricao: `Honorários baseados na proposta específica (${dadosRefinados.percentualHonorarios}%)`
      });
    }
  }

  // 5. Aplicar situações especiais
  if (dadosRefinados.temTestamento && !calculoBase.tipoProcesso.includes('testamento')) {
    const reducaoCustas = calculoBase.detalhamento.custas.valor * 0.1;
    ajustes.push({
      nome: 'Benefício por Testamento',
      impacto: formatCurrency(-reducaoCustas),
      descricao: 'Redução de custas por existir testamento válido'
    });
  }

  if (dadosRefinados.temLitigio && !calculoBase.tipoProcesso.includes('litígio')) {
    const aumentoHonorarios = patrimonioLiquido * 0.10; // 10% adicional por litígio
    honorariosRefinados += aumentoHonorarios;
    ajustes.push({
      nome: 'Custos por Litígio',
      impacto: formatCurrency(aumentoHonorarios),
      descricao: 'Aumento de honorários por possibilidade de litígio'
    });
  }

  // 6. Aplicar isenções
  if (dadosRefinados.unicoImovelResidencial && patrimonioLiquido < 500000) {
    const isencao = itcmdRefinado * 0.5; // 50% de isenção em alguns estados
    isencoes.push({
      tipo: 'Único imóvel residencial',
      valor: isencao
    });
  }

  if (dadosRefinados.herdeirosComIsencao) {
    const isencao = itcmdRefinado * 0.3; // 30% de isenção
    isencoes.push({
      tipo: 'Herdeiros com deficiência',
      valor: isencao
    });
  }

  // 7. Calcular total refinado
  const totalIsencoes = isencoes.reduce((sum, i) => sum + i.valor, 0);
  const totalRefinado = 
    itcmdRefinado + 
    honorariosRefinados + 
    calculoBase.detalhamento.custas.valor + 
    calculoBase.detalhamento.cartorio.valor - 
    totalIsencoes;

  // 8. Gerar comparativo
  const diferenca = totalRefinado - calculoBase.resumo.custoTotal;
  const percentualDiferenca = ((totalRefinado / calculoBase.resumo.custoTotal - 1) * 100).toFixed(2);

  return {
    totalRefinado,
    patrimonioLiquido,
    ajustes,
    isencoes,
    comparativo: {
      calculoOriginal: calculoBase.resumo.custoTotal,
      calculoRefinado: totalRefinado,
      diferenca,
      percentualDiferenca
    },
    temLitigio: dadosRefinados.temLitigio
  };
};

export type { DadosRefinamento, ResultadoRefinado };
