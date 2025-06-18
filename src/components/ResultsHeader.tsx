
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface ResultsHeaderProps {
  custoTotal: number;
  custoTotalFormatado: string;
  percentualSobrePatrimonio: string;
  tempoEstimado: string;
}

const ResultsHeader = ({ 
  custoTotal, 
  custoTotalFormatado, 
  percentualSobrePatrimonio, 
  tempoEstimado 
}: ResultsHeaderProps) => {
  return (
    <div className="text-center mb-12 fade-in-up">
      <div className="badge-top inline-block mb-6">
        🎯 Resultado Premium
      </div>
      <h1 className="heading-lg mb-6 golden-accent">
        Análise Completa dos Custos de Inventário
      </h1>
      
      <div className="luxury-card p-8 mb-6 bg-gradient-to-br from-purple-500/10 to-gold-500/10 border-2 border-gold-500/30">
        <div className="text-center">
          <div className="text-5xl font-bold golden-accent mb-3">
            {custoTotalFormatado}
          </div>
          <p className="text-xl text-white mb-2 font-semibold">
            Custo total estimado
          </p>
          <p className="text-glass text-lg">
            {percentualSobrePatrimonio}% do patrimônio total
          </p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center space-x-2 text-lg">
            <span className="text-2xl">⏱️</span>
            <span className="text-glass">Tempo estimado:</span>
            <span className="text-white font-semibold">{tempoEstimado}</span>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-glass max-w-2xl mx-auto leading-relaxed">
        <p>
          💡 Este cálculo considera as alíquotas vigentes em 2025 e valores médios de mercado. 
          Para maior precisão, recomendamos análise personalizada com nossos especialistas.
        </p>
      </div>
    </div>
  );
};

export default ResultsHeader;
