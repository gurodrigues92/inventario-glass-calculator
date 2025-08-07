import React from 'react';
import { Target, Check } from 'lucide-react';
const ValueGuideSection = () => {
  return <div className="mt-8 text-center fade-in-up">
      <div className="glass-card max-w-4xl mx-auto p-8" style={{
      background: '#FFFFFF',
      border: '1px solid #E8E2DD',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(12, 44, 69, 0.08)',
      color: '#2C2C2C'
    }}>
        <div className="text-center mb-8">
          <h3 className="flex items-center justify-center gap-3 text-xl font-semibold mb-0" style={{
          color: '#0C2C45'
        }}>
            
            Por que usar Valor de Mercado?
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="flex items-center gap-3 font-semibold mb-4" style={{
            color: '#0C2C45'
          }}>
              <Check size={20} color="#FFD700" strokeWidth={2} />
              Precisão Legal
            </h4>
            <p className="text-sm" style={{
            color: '#476D9E'
          }}>
              A Receita Federal exige a declaração pelo valor real de mercado. 
              Valores subdeclarados podem gerar multas e problemas futuros.
            </p>
          </div>
          
          <div>
            <h4 className="flex items-center gap-3 font-semibold mb-4" style={{
            color: '#0C2C45'
          }}>
              <Check size={20} color="#FFD700" strokeWidth={2} />
              Cálculo Correto
            </h4>
            <p className="text-sm" style={{
            color: '#476D9E'
          }}>
              O ITCMD é calculado sobre o valor real dos bens. 
              Nossa calculadora usa os valores que você informar para dar uma estimativa precisa.
            </p>
          </div>
        </div>
        
        <div className="p-6 rounded-lg border text-center" style={{
        background: 'rgba(255, 215, 0, 0.1)',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
          <p className="text-sm" style={{
          color: '#476D9E'
        }}>
            <span className="font-semibold" style={{
            color: '#0C2C45'
          }}>Dica:</span> Para imóveis, consulte sites especializados ou avaliações recentes. 
            Para veículos, use a tabela FIPE. Para investimentos, considere o valor atual da carteira.
          </p>
        </div>
      </div>
    </div>;
};
export default ValueGuideSection;