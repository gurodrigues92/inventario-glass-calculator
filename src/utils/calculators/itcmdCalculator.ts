
import { ESTADOS_DATA } from '../../data/estadosData';

// Função corrigida para ITCMD progressivo (especialmente RS)
export const calcularITCMDProgressivo = (patrimonio: number, estado: string): number => {
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
  
  return Math.round(imposto); // Garantir valor inteiro
};

export const calcularITCMD = (patrimonio: number, estado: string): { valor: number; descricao: string } => {
  const estadoData = ESTADOS_DATA[estado];
  let itcmd = 0;
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
  
  return { valor: itcmd, descricao: descricaoITCMD };
};
