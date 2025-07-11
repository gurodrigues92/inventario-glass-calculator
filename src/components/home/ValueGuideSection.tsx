
import React from 'react';
import { Target, Check } from 'lucide-react';
import GlassCard from '../GlassCard';

const ValueGuideSection = () => {
  return (
    <div className="mt-16 fade-in-up">
      <GlassCard>
        <div className="text-center mb-6">
          <h3 
            className="text-xl font-semibold mb-4 flex items-center justify-center gap-2"
            style={{ color: '#0C2C45' }}
          >
            <Target size={24} color="#0C2C45" strokeWidth={1.5} />
            Por que usar Valor de Mercado?
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: '#0C2C45' }}
            >
              <Check size={20} color="#27AE60" strokeWidth={2} />
              Precisão Legal
            </h4>
            <p className="text-sm" style={{ color: '#476D9E' }}>
              A Receita Federal exige a declaração pelo valor real de mercado. 
              Valores subdeclarados podem gerar multas e problemas futuros.
            </p>
          </div>
          
          <div>
            <h4 
              className="font-semibold mb-3 flex items-center gap-2"
              style={{ color: '#0C2C45' }}
            >
              <Check size={20} color="#27AE60" strokeWidth={2} />
              Cálculo Correto
            </h4>
            <p className="text-sm" style={{ color: '#476D9E' }}>
              O ITCMD é calculado sobre o valor real dos bens. 
              Nossa calculadora usa os valores que você informar para dar uma estimativa precisa.
            </p>
          </div>
        </div>
        
        <div 
          className="mt-6 p-4 rounded-lg" 
          style={{ 
            background: 'rgba(209, 191, 163, 0.1)',
            border: '1px solid rgba(209, 191, 163, 0.2)'
          }}
        >
          <p className="text-sm text-center" style={{ color: '#476D9E' }}>
            <strong style={{ color: '#0C2C45' }}>Dica:</strong> Para imóveis, consulte sites especializados ou avaliações recentes. 
            Para veículos, use a tabela FIPE. Para investimentos, considere o valor atual da carteira.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default ValueGuideSection;
