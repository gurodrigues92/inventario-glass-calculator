
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
  
  // 1. Calcular base de cálculo correta
  const baseCalculo = dados.patrimonioAtualMercado && dados.patrimonioHistoricoIR 
    ? Math.max(0, dados.patrimonioAtualMercado - dados.patrimonioHistoricoIR)
    : patrimonio;
  
  // 2. Calcular ITCMD usando função correta com alíquotas reais dos estados
  const itcmdResult = calcularITCMD(baseCalculo, estado);
  
  // 3. Honorários advocatícios - 10% sem litígio, 20% com litígio
  const percentualHonorarios = temLitigio ? 0.20 : 0.10;
  const honorarios = patrimonio * percentualHonorarios;
  
  // 4. Custas de cartório - 2%
  const custasCartorio = patrimonio * 0.02;
  
  // 5. Imposto de Renda sobre ganho de capital (15% - reforma tributária 2025+)
  const ganhoCapital = baseCalculo !== patrimonio ? baseCalculo * 0.15 : 0;
  
  // 6. Total Pessoa Física (SEM ganho de capital antes da reforma)
  const custoTotalPF = itcmdResult.valor + honorarios + custasCartorio;
  
  // 7. Custos Holding S/A (honorários 1,5% do patrimônio)
  const honorariosConstituicaoHolding = patrimonio * 0.015; // 1,5% do patrimônio
  const custosCartorioHolding = 0; // 0% para a holding conforme especificado
  const custosHoldingSA = {
    honorariosConstituicao: honorariosConstituicaoHolding,
    custosCartorio: custosCartorioHolding,
    itcmd: 0, // 0% conforme tabela
    ganhoCapital: 0, // 0% conforme tabela
    total: honorariosConstituicaoHolding
  };
  
  // 8. Economia com Holding
  const economiaHolding = Math.max(0, custoTotalPF - custosHoldingSA.total);
  const percentualEconomia = custoTotalPF > 0 ? (economiaHolding / custoTotalPF * 100) : 0;
  
  // 9. Tempo estimado
  const tempoEstimado = tipoProcesso === 'judicial' 
    ? (temLitigio ? '5 a 8 anos' : '3 a 5 anos')
    : '60 a 120 dias';
  
  return {
    patrimonio,
    baseCalculo, // Adicionar base de cálculo transparente
    estado,
    tipoProcesso,
    detalhamento: {
      itcmd: {
        valor: itcmdResult.valor,
        percentual: patrimonio > 0 ? (itcmdResult.valor / patrimonio * 100) : 0,
        descricao: itcmdResult.descricao
      },
      honorarios: {
        valor: honorarios,
        percentual: percentualHonorarios * 100,
        descricao: `Honorários advocatícios (${percentualHonorarios * 100}%)`,
        tooltip: temLitigio 
          ? 'Honorários advocatícios de 20% do patrimônio em casos com litígio'
          : 'Honorários advocatícios de 10% do patrimônio sem litígio'
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
        descricao: ganhoCapital > 0 ? 'Imposto de Renda - Ganho de Capital (15%)' : 'Imposto de Renda (não aplicável)',
        tooltip: dados.patrimonioHistoricoIR ? 
          `15% sobre o ganho de capital: diferença entre valor atual (${formatCurrency(dados.patrimonioAtualMercado || patrimonio)}) e histórico IR (${formatCurrency(dados.patrimonioHistoricoIR)})` :
          'Imposto de Renda não aplicável - valor histórico IR não informado',
        informativo: 'Vigência a partir de 2025 com a reforma tributária'
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
        descricao: ganhoCapital > 0 
          ? `A partir de 2025, será incluído Imposto de Renda sobre ganho de capital de ${formatCurrency(ganhoCapital)} (15% sobre diferença de valor), aumentando o custo total.`
          : 'A partir de 2025, com a reforma tributária, será incluído o Imposto de Renda sobre ganho de capital (diferença entre valor de mercado e valor declarado no IR).'
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
