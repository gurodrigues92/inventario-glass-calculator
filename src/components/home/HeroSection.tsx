
import React from 'react';

const HeroSection = () => {
  return (
    <div className="text-center mb-12 fade-in-up">
      <h1 
        className="heading-xl mb-6"
        style={{
          fontSize: '3.5rem',
          fontWeight: '800',
          lineHeight: '1.1',
          background: 'linear-gradient(135deg, #ffffff, #8595ab)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Reduza Legalmente o Imposto de Herança e Proteja seu Patrimônio
      </h1>
      <p 
        className="text-xl max-w-2xl mx-auto leading-relaxed mb-8"
        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        Descubra agora quanto você pode economizar com nosso cálculo inteligente – 
        <strong> rápido e preciso!</strong>
      </p>
      
      {/* Elementos de Confiança */}
      <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
        <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          <span className="text-green-400">✓</span>
          <span>100% Legal</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          <span className="text-green-400">✓</span>
          <span>Resultado em Segundos</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          <span className="text-green-400">✓</span>
          <span>Economia até 90%</span>
        </div>
      </div>
      
      {/* Aviso sobre Valor de Mercado - Reposicionado e Simplificado */}
      <div 
        className="max-w-2xl mx-auto p-4 rounded-lg mb-8"
        style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}
      >
        <div className="flex items-center gap-3 text-sm" style={{ color: '#FFD700' }}>
          <span className="text-lg">💡</span>
          <div className="text-left">
            <strong>Importante:</strong> Para cálculos precisos, informe os <strong>valores reais de mercado</strong> dos bens. 
            Isso garante conformidade legal e evita problemas futuros.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
