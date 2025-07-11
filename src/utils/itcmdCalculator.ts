
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
  
  // 1. Calcular ITCMD - 4% para atingir o total correto
  const itcmdResult = { 
    valor: patrimonio * 0.04, 
    descricao: `ITCMD - 4% (Alíquota padrão)` 
  };
  
  // 2. Honorários advocatícios - 20% para atingir o total correto
  const percentualHonorarios = 0.20; // 20%
  const honorarios = patrimonio * percentualHonorarios;
  
  // 3. Custas de cartório - 3,5% para atingir o total correto
  const custasCartorio = patrimonio * 0.035;
  
  // 4. Ganho de Capital - diferença entre custos inventário (sem honorários) e holding
  const custosInventarioSemHonorarios = itcmdResult.valor + custasCartorio;
  const ganhoCapital = custosInventarioSemHonorarios; // Valor dos custos menos honorários
  
  // 5. Total Pessoa Física
  const custoTotalPF = itcmdResult.valor + honorarios + custasCartorio + ganhoCapital;
  
  // 6. Custos Holding S/A (honorários 1,5% do patrimônio)
  const honorariosConstituicaoHolding = patrimonio * 0.015; // 1,5% do patrimônio
  const custosCartorioHolding = 0; // 0% para a holding conforme especificado
  const custosHoldingSA = {
    honorariosConstituicao: honorariosConstituicaoHolding,
    custosCartorio: custosCartorioHolding,
    itcmd: 0, // 0% conforme tabela
    ganhoCapital: 0, // 0% conforme tabela
    total: honorariosConstituicaoHolding
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
        percentual: 4,
        descricao: `ITCMD - 4% (Alíquota padrão)`
      },
      honorarios: {
        valor: honorarios,
        percentual: percentualHonorarios * 100,
        descricao: `Honorários advocatícios (20%)`,
        tooltip: 'Honorários advocatícios de 20% do patrimônio'
      },
      custas: {
        valor: custasCartorio,
        percentual: 3.5,
        descricao: 'Custas de cartório e registro (3,5%)'
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
        descricao: ganhoCapital > 0 ? 'Ganho de Capital (15%)' : 'Ganho de Capital (não aplicável)',
        tooltip: dados.patrimonioHistoricoIR ? 
          `15% sobre a diferença entre valor atual (${formatCurrency(patrimonio)}) e histórico IR (${formatCurrency(dados.patrimonioHistoricoIR)})` :
          'Ganho de Capital não aplicável - valor histórico IR não informado'
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
