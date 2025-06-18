
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
      <div 
        className="badge-premium inline-block mb-6"
        style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          color: '#1a1a1a',
          padding: '8px 20px',
          borderRadius: '30px',
          fontSize: '12px',
          fontWeight: '800',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
          animation: 'pulse-gold 2s infinite'
        }}
      >
        🎯 Resultado Premium
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white leading-tight">
        Análise Completa dos{' '}
        <span 
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient-shift 3s ease infinite'
          }}
        >
          Custos de Inventário
        </span>
      </h1>
      
      <div 
        className="result-hero relative overflow-hidden mb-8"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(26, 26, 26, 0.98) 100%)',
          border: '2px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '24px',
          padding: '60px 40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="text-center relative z-10">
          <div 
            className="result-value mb-4"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradient-shift 3s ease infinite'
            }}
          >
            {custoTotalFormatado}
          </div>
          <p className="text-xl md:text-2xl text-white mb-3 font-semibold">
            Custo total estimado
          </p>
          <p className="text-lg text-purple-300">
            {percentualSobrePatrimonio}% do patrimônio total
          </p>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-center space-x-3 text-lg">
            <span className="text-3xl">⏱️</span>
            <span className="text-purple-300">Tempo estimado:</span>
            <span className="text-white font-bold">{tempoEstimado}</span>
          </div>
        </div>

        {/* Animated background effect */}
        <div 
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
            zIndex: 1
          }}
        />
      </div>
      
      <div className="text-sm text-purple-300 max-w-2xl mx-auto leading-relaxed">
        <p>
          💡 Este cálculo considera as alíquotas vigentes em 2025 e valores médios de mercado. 
          Para maior precisão, recomendamos análise personalizada com nossos especialistas.
        </p>
      </div>
    </div>
  );
};

export default ResultsHeader;
