
import { calcularITCMD } from './itcmdCalculator';

export interface ResultadoHoldingLTDA {
  ganhoCapital: number;
  itcmdDoacao: number;
  honorariosAdvogado: number;
  cartorio: number;
  itbi: number;
  total: number;
  detalhamento: {
    ganhoCapital: { valor: number; percentual: number; descricao: string };
    itcmdDoacao: { valor: number; percentual: number; descricao: string };
    honorariosAdvogado: { valor: number; percentual: number; descricao: string };
    cartorio: { valor: number; percentual: number; descricao: string };
    itbi: { valor: number; percentual: number; descricao: string };
  };
}

export const calcularHoldingLTDA = (
  patrimonio: number,
  estado: string,
  patrimonioHistoricoIR?: number,
  patrimonioAtualMercado?: number
): ResultadoHoldingLTDA => {
  // Base para ganho de capital (diferença entre valor atual e histórico)
  const valorMercado = patrimonioAtualMercado || patrimonio;
  const valorHistorico = patrimonioHistoricoIR || patrimonio;
  const baseGanhoCapital = Math.max(0, valorMercado - valorHistorico);
  
  // 1. Ganho de Capital: 15% sobre a diferença (valor mercado - valor histórico IR)
  const ganhoCapital = baseGanhoCapital * 0.15;
  
  // 2. ITCMD Doação: alíquota do estado sobre o patrimônio
  const itcmdResult = calcularITCMD(patrimonio, estado);
  const itcmdDoacao = itcmdResult.valor;
  
  // 3. Honorários do Advogado: R$ 60.000 (valor fixo)
  const honorariosAdvogado = 60000;
  
  // 4. Cartório: 0,5% do patrimônio
  const cartorio = patrimonio * 0.005;
  
  // 5. ITBI: 3% sobre a diferença de valor (transferência de imóveis para a holding)
  const itbi = baseGanhoCapital * 0.03;
  
  // Total
  const total = ganhoCapital + itcmdDoacao + honorariosAdvogado + cartorio + itbi;
  
  return {
    ganhoCapital,
    itcmdDoacao,
    honorariosAdvogado,
    cartorio,
    itbi,
    total,
    detalhamento: {
      ganhoCapital: {
        valor: ganhoCapital,
        percentual: 15,
        descricao: 'Ganho de Capital (15% sobre diferença)'
      },
      itcmdDoacao: {
        valor: itcmdDoacao,
        percentual: patrimonio > 0 ? (itcmdDoacao / patrimonio) * 100 : 0,
        descricao: `ITCMD Doação (${estado})`
      },
      honorariosAdvogado: {
        valor: honorariosAdvogado,
        percentual: patrimonio > 0 ? (honorariosAdvogado / patrimonio) * 100 : 0,
        descricao: 'Honorários Advocatícios (fixo)'
      },
      cartorio: {
        valor: cartorio,
        percentual: 0.5,
        descricao: 'Custas de Cartório (0,5%)'
      },
      itbi: {
        valor: itbi,
        percentual: 3,
        descricao: 'ITBI (3% sobre diferença)'
      }
    }
  };
};
