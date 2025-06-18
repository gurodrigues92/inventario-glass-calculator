
import { formatCurrency } from './formatters';
import { gerarAlertas, verificarExtrajudicial } from './validators';
import { calcularITCMD } from './calculators/itcmdCalculator';
import { calcularHonorariosVariaveis } from './calculators/honorariosCalculator';
import { calcularITBIInteligente } from './calculators/itbiCalculator';
import { gerarInsights, detectarComplexidade } from './calculators/insightsGenerator';
import { aplicarRefinamentos } from './calculators/refinamentoCalculator';
import {
  DadosCalculoInventario,
  DetalhamentoCusto,
  ComparacaoProcesso,
  InsightPersonalizado,
  ResultadoCalculo,
  DadosRefinamento,
  ResultadoRefinado
} from './types/calculator';

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
  const itcmdResult = calcularITCMD(patrimonio, estado);
  
  // 2. Calcular honorários advocatícios (VARIÁVEIS APRIMORADOS)
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
  
  // 6. Calcular custos holding (estrutura completa)
  const custosHolding = patrimonio * 0.045;
  
  // 7. Tempo estimado
  const tempoEstimado = tipoProcesso === 'judicial' 
    ? (temLitigio ? '5 a 8 anos' : '3 a 5 anos')
    : (temTestamento ? '60 a 90 dias' : '90 a 120 dias');
  
  // 8. Cálculo total
  const custoTotal = itcmdResult.valor + honorarios.valor + custas + cartorio + itbiResult.valor;
  const economiaHolding = Math.max(0, custoTotal - custosHolding);
  
  // 9. Comparações
  const custoJudicial = itcmdResult.valor + (patrimonio * 0.016) + 5000 + cartorio + itbiResult.valor;
  const custoExtrajudicial = itcmdResult.valor + (patrimonio * 0.016) + 3000 + cartorio + itbiResult.valor;
  
  return {
    patrimonio,
    estado,
    tipoProcesso,
    detalhamento: {
      itcmd: {
        valor: itcmdResult.valor,
        percentual: (itcmdResult.valor / patrimonio * 100),
        descricao: itcmdResult.descricao
      },
      honorarios: {
        valor: honorarios.valor,
        valorMinimo: honorarios.valorMinimo,
        valorMaximo: honorarios.valorMaximo,
        percentual: honorarios.percentual,
        descricao: honorarios.descricao,
        isRange: honorarios.isRange,
        tooltip: honorarios.tooltip
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
        descricao: itbiResult.descricao,
        informativo: itbiResult.informativo
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

// Re-export types and functions for backward compatibility
export type {
  DadosCalculoInventario,
  DetalhamentoCusto,
  ComparacaoProcesso,
  InsightPersonalizado,
  ResultadoCalculo,
  DadosRefinamento,
  ResultadoRefinado
};

export { detectarComplexidade, aplicarRefinamentos };
