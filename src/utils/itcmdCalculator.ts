
import { formatCurrency } from './formatters';
import { gerarAlertas, verificarExtrajudicial } from './validators';
import { calcularITCMD } from './calculators/itcmdCalculator';
import {
  DadosCalculoInventario,
  DetalhamentoCusto,
  ComparacaoProcesso,
  InsightPersonalizado,
  ResultadoCalculo
} from './types/calculator';

export const calcularCustosInventario = (dados: DadosCalculoInventario): ResultadoCalculo => {
  const {
    patrimonio,
    estado,
    tipoProcesso = 'extrajudicial',
    temLitigio = false
  } = dados;
  
  // 1. Calcular ITCMD baseado na tabela real dos estados
  const itcmdResult = calcularITCMD(patrimonio, estado);
  
  // 2. Honorários advocatícios corrigidos - 10% a 20% (média 15%)
  const percentualHonorariosMin = 0.10; // 10%
  const percentualHonorariosMax = 0.20; // 20%
  const percentualHonorariosMedio = 0.15; // 15% (média)
  
  const honorariosMin = patrimonio * percentualHonorariosMin;
  const honorariosMax = patrimonio * percentualHonorariosMax;
  const honorarios = patrimonio * percentualHonorariosMedio; // Usar média para cálculos
  
  // 3. Custas de cartório - 2% fixo (conforme PDF)
  const custasCartorio = patrimonio * 0.02;
  
  // 4. Total Pessoa Física
  const custoTotalPF = itcmdResult.valor + honorarios + custasCartorio;
  
  // 5. Custos Holding S/A (valores fixos conforme página 13 do PDF)
  const custosHoldingSA = {
    honorariosConstituicao: 150000, // R$ 150.000 fixo
    custosCartorio: 16000, // R$ 16.000 fixo (0,16%)
    itcmd: 0, // 0% conforme PDF
    ganhoCapital: 0, // 0% conforme PDF
    total: 166000 // R$ 166.000 total
  };
  
  // 6. Economia com Holding
  const economiaHolding = Math.max(0, custoTotalPF - custosHoldingSA.total);
  const percentualEconomia = custoTotalPF > 0 ? (economiaHolding / custoTotalPF * 100) : 0;
  
  // 7. Tempo estimado
  const tempoEstimado = tipoProcesso === 'judicial' 
    ? (temLitigio ? '5 a 8 anos' : '3 a 5 anos')
    : '60 a 120 dias';
  
  return {
    patrimonio,
    estado,
    tipoProcesso,
    detalhamento: {
      itcmd: {
        valor: itcmdResult.valor,
        percentual: (itcmdResult.valor / patrimonio * 100),
        descricao: `ITCMD ${estado} - ${itcmdResult.descricao.split(' - ')[1]}`
      },
      honorarios: {
        valor: honorarios,
        valorMinimo: honorariosMin,
        valorMaximo: honorariosMax,
        percentual: percentualHonorariosMedio * 100,
        descricao: `Honorários advocatícios (10% a 20% - média 15%)`,
        isRange: true,
        tooltip: 'Honorários advocatícios variam entre 10% e 20% do patrimônio, com média de 15%'
      },
      custas: {
        valor: custasCartorio,
        percentual: 2,
        descricao: 'Custas de cartório e registro (2%)'
      },
      cartorio: {
        valor: 0, // Incluído nas custas
        percentual: 0,
        descricao: 'Incluído nas custas'
      },
      itbi: {
        valor: 0, // Não aplicável para inventário
        percentual: 0,
        descricao: 'Não aplicável',
        informativo: 'ITBI não incide sobre inventário'
      }
    },
    resumo: {
      custoTotal: custoTotalPF,
      custoTotalFormatado: formatCurrency(custoTotalPF),
      tempoEstimado,
      economiaHolding,
      percentualSobrePatrimonio: (custoTotalPF / patrimonio * 100).toFixed(1)
    },
    comparacao: {
      judicial: {
        custo: custoTotalPF * 1.2, // 20% mais caro que extrajudicial
        tempo: temLitigio ? '5 a 8 anos' : '3 a 5 anos'
      },
      extrajudicial: {
        custo: custoTotalPF,
        tempo: '60 a 120 dias'
      },
      holding: {
        custo: custosHoldingSA.total,
        economia: economiaHolding,
        tempo: '30 a 60 dias para constituição'
      }
    },
    insights: [
      {
        tipo: 'economia',
        titulo: 'Economia com Holding Familiar S/A',
        descricao: `Você pode economizar ${formatCurrency(economiaHolding)} (${percentualEconomia.toFixed(0)}%) constituindo uma Holding Familiar S/A`,
        valor: economiaHolding
      },
      {
        tipo: 'informacao',
        titulo: 'Reforma Tributária 2025',
        descricao: 'A partir de 2025, com a reforma tributária, estes custos podem chegar até o dobro do valor, a depender de cada estado.'
      },
      {
        tipo: 'estrategia',
        titulo: 'Constituição Rápida',
        descricao: 'A Holding Familiar S/A pode ser constituída em 30 a 60 dias, bem mais rápido que um inventário tradicional.'
      }
    ],
    alertas: gerarAlertas(patrimonio, estado),
    validacao: verificarExtrajudicial({ patrimonio, estado, tipoProcesso, temTestamento: false, temMenoresIncapazes: false, temLitigio })
  };
};

// Re-export types for backward compatibility
export type {
  DadosCalculoInventario,
  DetalhamentoCusto,
  ComparacaoProcesso,
  InsightPersonalizado,
  ResultadoCalculo
};
