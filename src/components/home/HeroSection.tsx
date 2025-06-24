
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
        Calculadora de Inventário
      </h1>
      <p 
        className="text-xl max-w-2xl mx-auto leading-relaxed mb-8"
        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      >
        Descubra os custos do seu inventário com precisão.<br />
        Informe os <strong>valores de mercado</strong> reais dos bens para uma estimativa precisa.
      </p>
      
      {/* Aviso sobre Valor de Mercado */}
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
            <strong>Importante:</strong> Use sempre os <strong>valores de mercado reais</strong> dos bens. 
            Valores incorretos podem gerar problemas com a Receita Federal e custos adicionais.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
