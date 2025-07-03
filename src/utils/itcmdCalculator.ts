
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
  
  // 1. Calcular ITCMD - 8% fixo conforme tabela
  const itcmdResult = { 
    valor: patrimonio * 0.08, 
    descricao: `ITCMD - 8% (Alíquota padrão)` 
  };
  
  // 2. Honorários advocatícios - 10% conforme tabela
  const percentualHonorarios = 0.10; // 10%
  const honorarios = patrimonio * percentualHonorarios;
  
  // 3. Custas de cartório - 2% conforme tabela
  const custasCartorio = patrimonio * 0.02;
  
  // 4. Ganho de Capital - 15% sobre a diferença (se aplicável)
  const patrimonioHistorico = dados.patrimonioHistoricoIR || patrimonio;
  const diferencaGanhoCapital = Math.max(0, patrimonio - patrimonioHistorico);
  const ganhoCapital = diferencaGanhoCapital * 0.15; // 15%
  
  // 5. Total Pessoa Física
  const custoTotalPF = itcmdResult.valor + honorarios + custasCartorio + ganhoCapital;
  
  // 6. Custos Holding S/A (honorários 1,5% do patrimônio)
  const honorariosConstituicaoHolding = patrimonio * 0.015; // 1,5% do patrimônio
  const custosCartorioHolding = patrimonio * 0.02; // 2% do patrimônio
  const custosHoldingSA = {
    honorariosConstituicao: honorariosConstituicaoHolding,
    custosCartorio: custosCartorioHolding,
    itcmd: 0, // 0% conforme tabela
    ganhoCapital: 0, // 0% conforme tabela
    total: honorariosConstituicaoHolding + custosCartorioHolding
  };
  
  // 7. Economia com Holding
  const economiaHolding = Math.max(0, custoTotalPF - custosHoldingSA.total);
  const percentualEconomia = custoTotalPF > 0 ? (economiaHolding / custoTotalPF * 100) : 0;
  
  // 8. Tempo estimado
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
        percentual: 8,
        descricao: `ITCMD - 8% (Alíquota padrão)`
      },
      honorarios: {
        valor: honorarios,
        percentual: percentualHonorarios * 100,
        descricao: `Honorários advocatícios (10%)`,
        tooltip: 'Honorários advocatícios de 10% do patrimônio'
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
      },
      ganhoCapital: {
        valor: ganhoCapital,
        percentual: 15,
        descricao: 'Ganho de Capital (15%)',
        tooltip: `15% sobre a diferença entre valor atual (${formatCurrency(patrimonio)}) e histórico IR (${formatCurrency(patrimonioHistorico)})`
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
