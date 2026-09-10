
import { ResultadoCalculo, DadosRefinamento, ResultadoRefinado } from '../types/calculator';
import { ESTADOS_DATA } from '../../data/estadosData';
import { formatCurrency } from '../formatters';
import { calcularITCMDProgressivo } from './itcmdCalculator';

const parseCurrencyToNumber = (value: string | undefined): number => {
  if (!value) return 0;
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0;
};

export const aplicarRefinamentos = (calculoBase: ResultadoCalculo, dadosRefinados: DadosRefinamento): ResultadoRefinado => {
  const calculoRefinado = { ...calculoBase };
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
