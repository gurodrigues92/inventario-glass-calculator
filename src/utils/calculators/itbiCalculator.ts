
import { DetalhamentoCusto } from '../types/calculator';

// Dados de isenções ITBI por estado aprimorados
const ISENCOES_ITBI = {
  'SP': { limite: 200000, percentual: 100, descricao: 'Imóvel único até R$ 200.000' },
  'RJ': { limite: 150000, percentual: 100, descricao: 'Primeiro imóvel até R$ 150.000' },
  'MG': { limite: 100000, percentual: 50, descricao: '50% de redução até R$ 100.000' },
  'RS': { limite: 250000, percentual: 100, descricao: 'Imóvel residencial único até R$ 250.000' },
  'PR': { limite: 180000, percentual: 100, descricao: 'Imóvel único até R$ 180.000' },
  'SC': { limite: 120000, percentual: 100, descricao: 'Imóvel residencial até R$ 120.000' }
};

// ITBI inteligente com isenções por estado
export const calcularITBIInteligente = (valorImoveis: number, estado: string): DetalhamentoCusto => {
  const aliquotaPadrao = 0.03; // 3%
  let itbi = valorImoveis * aliquotaPadrao;
  let descricao = `ITBI sobre imóveis (3%)`;
  let informativo = undefined;

  const isencao = ISENCOES_ITBI[estado];
  if (isencao && valorImoveis <= isencao.limite) {
    if (isencao.percentual === 100) {
      itbi = 0;
      informativo = `✅ ${isencao.descricao} - Isento de ITBI em ${estado}`;
      descricao = `ITBI - Isento em ${estado}`;
    } else {
      const reducao = itbi * (isencao.percentual / 100);
      itbi = itbi - reducao;
      informativo = `✅ ${isencao.descricao} - Redução de ${isencao.percentual}% no ITBI`;
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
