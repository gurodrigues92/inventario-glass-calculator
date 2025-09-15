import { ESTADOS_DATA, getAliquotaDisplay } from '../../data/estadosData';
import { calcularITCMD, calcularITCMDProgressivo } from '../calculators/itcmdCalculator';

export interface ResultadoAuditoria {
  uf: string;
  nome: string;
  tipo: 'fixa' | 'progressiva';
  aliquotaExibida: string;
  valorCalculado: number;
  aliquotaEfetiva: number;
  patrimonioTeste: number;
  status: 'OK' | 'DISCREPANCIA' | 'ERRO';
  observacoes: string[];
}

export interface ResumoAuditoria {
  totalEstados: number;
  estadosOK: number;
  estadosComDiscrepancia: number;
  estadosComErro: number;
  discrepanciasEncontradas: ResultadoAuditoria[];
}

// Função para calcular manualmente ITCMD progressivo para validação
const calcularManualProgressivo = (patrimonio: number, estado: string): number => {
  const estadoData = ESTADOS_DATA[estado];
  if (!estadoData || estadoData.itcmd.tipo !== 'progressiva') {
    return 0;
  }
  
  const faixas = estadoData.itcmd.faixas!;
  let imposto = 0;
  let valorRestante = patrimonio;
  let limiteAnterior = 0;
  
  for (const faixa of faixas) {
    const valorFaixa = Math.min(valorRestante, faixa.limite - limiteAnterior);
    if (valorFaixa > 0) {
      imposto += valorFaixa * faixa.aliquota;
      valorRestante -= valorFaixa;
      limiteAnterior = faixa.limite;
    }
    if (valorRestante <= 0) break;
  }
  
  return Math.round(imposto);
};

// Função para validar se a alíquota exibida está correta
const validarAliquotaExibida = (uf: string, resultado: ResultadoAuditoria): string[] => {
  const observacoes: string[] = [];
  const estado = ESTADOS_DATA[uf];
  
  if (!estado) {
    observacoes.push('Estado não encontrado na base de dados');
    return observacoes;
  }
  
  if (estado.itcmd.tipo === 'fixa') {
    const aliquotaEsperada = `${(estado.itcmd.aliquota! * 100).toFixed(0)}%`;
    if (resultado.aliquotaExibida !== aliquotaEsperada) {
      observacoes.push(`Alíquota exibida incorreta. Esperado: ${aliquotaEsperada}`);
    }
  } else {
    // Para progressiva, verificar se está no formato "X% - Y%"
    const faixas = estado.itcmd.faixas!;
    const minAliquota = Math.min(...faixas.map(f => f.aliquota));
    const maxAliquota = Math.max(...faixas.map(f => f.aliquota));
    const aliquotaEsperada = `${(minAliquota * 100).toFixed(0)}% - ${(maxAliquota * 100).toFixed(0)}%`;
    
    if (resultado.aliquotaExibida !== aliquotaEsperada) {
      observacoes.push(`Faixa de alíquota exibida incorreta. Esperado: ${aliquotaEsperada}`);
    }
  }
  
  return observacoes;
};

// Função principal de auditoria
export const executarAuditoriaITCMD = (patrimonioTeste: number = 5000000): ResumoAuditoria => {
  const resultados: ResultadoAuditoria[] = [];
  
  Object.keys(ESTADOS_DATA).forEach(uf => {
    const estado = ESTADOS_DATA[uf];
    const aliquotaExibida = getAliquotaDisplay(uf);
    
    try {
      // Calcular usando a função oficial
      const { valor: valorCalculado } = calcularITCMD(patrimonioTeste, uf);
      
      // Calcular alíquota efetiva
      const aliquotaEfetiva = (valorCalculado / patrimonioTeste) * 100;
      
      const resultado: ResultadoAuditoria = {
        uf,
        nome: estado.nome,
        tipo: estado.itcmd.tipo,
        aliquotaExibida,
        valorCalculado,
        aliquotaEfetiva,
        patrimonioTeste,
        status: 'OK',
        observacoes: []
      };
      
      // Validar alíquota exibida
      resultado.observacoes.push(...validarAliquotaExibida(uf, resultado));
      
      // Para estados com alíquota progressiva, validar cálculo manual
      if (estado.itcmd.tipo === 'progressiva') {
        const valorManual = calcularManualProgressivo(patrimonioTeste, uf);
        if (Math.abs(valorCalculado - valorManual) > 1) {
          resultado.observacoes.push(`Discrepância no cálculo progressivo. Manual: R$ ${valorManual.toLocaleString()}`);
        }
        
        // Verificar se a alíquota efetiva não excede o máximo esperado
        const maxAliquota = Math.max(...estado.itcmd.faixas!.map(f => f.aliquota));
        if (aliquotaEfetiva > (maxAliquota * 100) + 0.01) { // Tolerância de 0.01%
          resultado.observacoes.push(`Alíquota efetiva (${aliquotaEfetiva.toFixed(2)}%) excede o máximo esperado (${(maxAliquota * 100).toFixed(0)}%)`);
        }
      } else {
        // Para alíquota fixa, verificar se coincide exatamente
        const aliquotaEsperada = estado.itcmd.aliquota! * 100;
        if (Math.abs(aliquotaEfetiva - aliquotaEsperada) > 0.01) {
          resultado.observacoes.push(`Alíquota efetiva (${aliquotaEfetiva.toFixed(2)}%) difere da esperada (${aliquotaEsperada.toFixed(0)}%)`);
        }
      }
      
      // Definir status baseado nas observações
      if (resultado.observacoes.length > 0) {
        resultado.status = 'DISCREPANCIA';
      }
      
      resultados.push(resultado);
      
    } catch (error) {
      resultados.push({
        uf,
        nome: estado.nome,
        tipo: estado.itcmd.tipo,
        aliquotaExibida,
        valorCalculado: 0,
        aliquotaEfetiva: 0,
        patrimonioTeste,
        status: 'ERRO',
        observacoes: [`Erro no cálculo: ${error}`]
      });
    }
  });
  
  // Compilar resumo
  const resumo: ResumoAuditoria = {
    totalEstados: resultados.length,
    estadosOK: resultados.filter(r => r.status === 'OK').length,
    estadosComDiscrepancia: resultados.filter(r => r.status === 'DISCREPANCIA').length,
    estadosComErro: resultados.filter(r => r.status === 'ERRO').length,
    discrepanciasEncontradas: resultados.filter(r => r.status !== 'OK')
  };
  
  return resumo;
};

// Função para gerar relatório detalhado
export const gerarRelatorioAuditoria = (resumo: ResumoAuditoria): string => {
  let relatorio = `RELATÓRIO DE AUDITORIA ITCMD - ${new Date().toLocaleDateString()}\n`;
  relatorio += `${'='.repeat(60)}\n\n`;
  
  relatorio += `RESUMO GERAL:\n`;
  relatorio += `- Total de estados: ${resumo.totalEstados}\n`;
  relatorio += `- Estados OK: ${resumo.estadosOK}\n`;
  relatorio += `- Estados com discrepância: ${resumo.estadosComDiscrepancia}\n`;
  relatorio += `- Estados com erro: ${resumo.estadosComErro}\n\n`;
  
  if (resumo.discrepanciasEncontradas.length > 0) {
    relatorio += `DISCREPÂNCIAS ENCONTRADAS:\n`;
    relatorio += `${'-'.repeat(40)}\n`;
    
    resumo.discrepanciasEncontradas.forEach(resultado => {
      relatorio += `\n${resultado.uf} - ${resultado.nome}:\n`;
      relatorio += `  Status: ${resultado.status}\n`;
      relatorio += `  Tipo: ${resultado.tipo}\n`;
      relatorio += `  Alíquota exibida: ${resultado.aliquotaExibida}\n`;
      relatorio += `  Valor calculado: R$ ${resultado.valorCalculado.toLocaleString()}\n`;
      relatorio += `  Alíquota efetiva: ${resultado.aliquotaEfetiva.toFixed(2)}%\n`;
      relatorio += `  Observações:\n`;
      resultado.observacoes.forEach(obs => {
        relatorio += `    - ${obs}\n`;
      });
    });
  }
  
  return relatorio;
};

// Função específica para testar estados suspeitos
export const testarEstadosSuspeitos = (): { [uf: string]: any } => {
  const estadosSuspeitos = ['RS', 'MT', 'SC', 'SP', 'PE'];
  const resultados: { [uf: string]: any } = {};
  
  estadosSuspeitos.forEach(uf => {
    const estado = ESTADOS_DATA[uf];
    const patrimonio = 5000000;
    
    if (estado.itcmd.tipo === 'progressiva') {
      const faixas = estado.itcmd.faixas!;
      let calculoDetalhado = [];
      let imposto = 0;
      let valorRestante = patrimonio;
      let limiteAnterior = 0;
      
      for (const faixa of faixas) {
        const valorFaixa = Math.min(valorRestante, faixa.limite - limiteAnterior);
        if (valorFaixa > 0) {
          const impostoFaixa = valorFaixa * faixa.aliquota;
          calculoDetalhado.push({
            faixa: `${limiteAnterior.toLocaleString()} - ${faixa.limite === Infinity ? 'Infinito' : faixa.limite.toLocaleString()}`,
            aliquota: `${(faixa.aliquota * 100).toFixed(0)}%`,
            valorIncidencia: valorFaixa,
            impostoFaixa: impostoFaixa
          });
          imposto += impostoFaixa;
          valorRestante -= valorFaixa;
          limiteAnterior = faixa.limite;
        }
        if (valorRestante <= 0) break;
      }
      
      resultados[uf] = {
        nome: estado.nome,
        calculoDetalhado,
        impostoTotal: Math.round(imposto),
        aliquotaEfetiva: ((imposto / patrimonio) * 100).toFixed(2) + '%'
      };
    }
  });
  
  return resultados;
};