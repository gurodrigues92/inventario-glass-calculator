
import React from 'react';
import { Target, Check } from 'lucide-react';
import GlassCard from '../GlassCard';

const ValueGuideSection = () => {
  return (
    <div className="value-guide-section fade-in-up">
      <div className="value-guide-container">
        <div className="title-section">
          <h3 className="title-text">
            <Target size={24} color="#e1e5ea" strokeWidth={1.5} />
            Por que usar Valor de Mercado?
          </h3>
        </div>
        
        <div className="benefits-grid">
          <div className="benefit-item">
            <h4 className="benefit-title">
              <Check size={20} color="#FFD700" strokeWidth={2} />
              Precisão Legal
            </h4>
            <p className="benefit-description">
              A Receita Federal exige a declaração pelo valor real de mercado. 
              Valores subdeclarados podem gerar multas e problemas futuros.
            </p>
          </div>
          
          <div className="benefit-item">
            <h4 className="benefit-title">
              <Check size={20} color="#FFD700" strokeWidth={2} />
              Cálculo Correto
            </h4>
            <p className="benefit-description">
              O ITCMD é calculado sobre o valor real dos bens. 
              Nossa calculadora usa os valores que você informar para dar uma estimativa precisa.
            </p>
          </div>
        </div>
        
        <div className="tip-box">
          <p className="tip-text">
            <span className="tip-highlight">Dica:</span> Para imóveis, consulte sites especializados ou avaliações recentes. 
            Para veículos, use a tabela FIPE. Para investimentos, considere o valor atual da carteira.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValueGuideSection;
