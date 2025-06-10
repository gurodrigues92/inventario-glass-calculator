
import React from 'react';
import GlassCard from './GlassCard';
import { formatCurrency } from '../utils/formatters';

interface ConsultationInsightProps {
  patrimonio: number;
  temLitigio: boolean;
  temMenoresIncapazes: boolean;
  custoTotal: number;
}

const ConsultationInsight = ({ 
  patrimonio, 
  temLitigio, 
  temMenoresIncapazes, 
  custoTotal 
}: ConsultationInsightProps) => {
  
  const getRecommendationMessage = () => {
    const isHighValue = patrimonio > 1000000;
    const isComplex = temLitigio || temMenoresIncapazes;
    
    if (isHighValue && isComplex) {
      return `Com um patrimônio de ${formatCurrency(patrimonio)} e complexidades envolvidas (${temLitigio ? 'litígio' : ''}${temLitigio && temMenoresIncapazes ? ' e ' : ''}${temMenoresIncapazes ? 'menores/incapazes' : ''}), é fundamental contar com orientação especializada para otimizar custos e evitar problemas futuros.`;
    }
    
    if (isHighValue) {
      return `Considerando o valor significativo do patrimônio (${formatCurrency(patrimonio)}), uma consultoria especializada pode identificar oportunidades de economia e estratégias de planejamento sucessório.`;
    }
    
    if (isComplex) {
      return `Devido às complexidades do seu caso (${temLitigio ? 'litígio' : ''}${temLitigio && temMenoresIncapazes ? ' e ' : ''}${temMenoresIncapazes ? 'menores/incapazes' : ''}), recomendamos orientação especializada para garantir que todos os aspectos legais sejam adequadamente tratados.`;
    }
    
    return 'Uma consultoria especializada pode ajudar a validar este cálculo, esclarecer dúvidas específicas do seu caso e garantir que você esteja tomando as melhores decisões para o processo de inventário.';
  };

  return (
    <GlassCard className="mb-12 border-2 border-amber-500/30 bg-amber-500/5">
      <div className="text-center">
        <div className="text-3xl mb-4">🤝</div>
        <h3 className="heading-md mb-4 text-amber-400">Precisa de Orientação Especializada?</h3>
        <p className="text-glass mb-6 leading-relaxed">
          {getRecommendationMessage()}
        </p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-center space-x-2 text-sm text-glass">
            <span>✓</span>
            <span>Análise personalizada do seu caso</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-glass">
            <span>✓</span>
            <span>Estratégias para reduzir custos</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-glass">
            <span>✓</span>
            <span>Planejamento sucessório preventivo</span>
          </div>
        </div>

        <button 
          disabled
          className="glass-button px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Falar com Especialista</span>
        </button>
        
        <p className="text-xs text-glass mt-3">
          Em breve disponibilizaremos este serviço
        </p>
      </div>
    </GlassCard>
  );
};

export default ConsultationInsight;
