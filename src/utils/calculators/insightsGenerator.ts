
import { DadosCalculoInventario, InsightPersonalizado } from '../types/calculator';
import { formatCurrency } from '../formatters';

// Insights personalizados aprimorados
export const gerarInsights = (dados: DadosCalculoInventario, custoTotal: number, economiaHolding: number): InsightPersonalizado[] => {
  const insights: InsightPersonalizado[] = [];
  
  // Insight sobre economia com extrajudicial
  if (dados.tipoProcesso === 'judicial' && !dados.temMenoresIncapazes && !dados.temLitigio) {
    const economiaExtrajudicial = (dados.patrimonio * 0.04) + 2000;
    insights.push({
      tipo: 'economia',
      titulo: '💰 Economia com Inventário Extrajudicial',
      descricao: `Você poderia economizar aproximadamente ${formatCurrency(economiaExtrajudicial)} optando pelo inventário extrajudicial, além de reduzir significativamente o tempo de processo.`,
      valor: economiaExtrajudicial
    });
  }
  
  // Insight sobre holding - com destaque especial para grandes patrimônios
  if (economiaHolding > 50000) {
    const emoji = economiaHolding > 200000 ? '🏆' : '💡';
    const intensidade = economiaHolding > 200000 ? 'ALTAMENTE RECOMENDADO' : 'Recomendado';
    
    insights.push({
      tipo: 'estrategia',
      titulo: `${emoji} Holding Familiar S/A - ${intensidade}`,
      descricao: `Uma Holding Familiar S/A poderia gerar economia de ${formatCurrency(economiaHolding)} nos custos sucessórios, além de profissionalizar a gestão do patrimônio, otimizar aspectos tributários e facilitar futuras transmissões.`,
      valor: economiaHolding
    });
  }
  
  // Insight sobre testamento
  if (!dados.temTestamento && dados.tipoProcesso === 'extrajudicial') {
    insights.push({
      tipo: 'informacao',
      titulo: '📝 Testamento Acelera o Processo',
      descricao: 'Com um testamento válido, o inventário extrajudicial pode ser concluído em até 60 dias, reduzindo custos e agilizando a transmissão do patrimônio.'
    });
  }

  // Insight sobre planejamento sucessório para grandes patrimônios
  if (dados.patrimonio > 3000000) {
    insights.push({
      tipo: 'estrategia',
      titulo: '🎯 Planejamento Sucessório Estratégico',
      descricao: `Para patrimônios elevados como o seu (${formatCurrency(dados.patrimonio)}), um planejamento sucessório bem estruturado pode gerar economias significativas e proteger o patrimônio familiar por gerações.`
    });
  }

  // Insight sobre Lei da Legítima
  insights.push({
    tipo: 'informacao',
    titulo: '⚖️ Lei da Legítima',
    descricao: '50% do patrimônio obrigatoriamente pertence aos herdeiros legais (descendentes, ascendentes ou cônjuge). Os outros 50% podem ser dispostos livremente através de testamento ou doação.'
  });
  
  return insights;
};

// Função para detectar complexidade do caso
export const detectarComplexidade = (dados: DadosCalculoInventario): { nivel: 'baixo' | 'medio' | 'alto', fatores: string[], mostrarCTA: boolean } => {
  const fatores = [];
  
  if (dados.temMenoresIncapazes) {
    fatores.push('Menores ou incapazes entre herdeiros');
  }
  
  if (dados.temLitigio) {
    fatores.push('Possível conflito entre herdeiros');
  }
  
  if (dados.patrimonio > 5000000) {
    fatores.push('Patrimônio elevado');
  }
  
  if (dados.valorImoveis && dados.valorImoveis > dados.patrimonio * 0.8) {
    fatores.push('Patrimônio predominantemente imobiliário');
  }
  
  if (fatores.length >= 2) {
    return { nivel: 'alto', fatores, mostrarCTA: true };
  } else if (fatores.length === 1) {
    return { nivel: 'medio', fatores, mostrarCTA: dados.patrimonio > 2000000 };
  }
  
  return { nivel: 'baixo', fatores: [], mostrarCTA: false };
};
