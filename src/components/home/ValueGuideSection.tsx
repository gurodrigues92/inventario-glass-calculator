
import React from 'react';
import { Target, Check } from 'lucide-react';
import GlassCard from '../GlassCard';

const ValueGuideSection = () => {
  return (
    <div className="mt-16 fade-in-up">
      <div 
        className="bg-white/80 backdrop-blur-sm border border-purple-200/30 rounded-xl shadow-lg"
        style={{
          padding: '2.5rem',
          margin: '0'
        }}
      >
        <div 
          className="text-center"
          style={{ marginBottom: '6rem !important' }}
        >
          <h3 
            className="text-xl font-semibold flex items-center justify-center gap-4"
            style={{ 
              color: '#0C2C45',
              marginBottom: '0 !important',
              lineHeight: '1.4'
            }}
          >
            <Target size={24} color="#0C2C45" strokeWidth={1.5} />
            Por que usar Valor de Mercado?
          </h3>
        </div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ 
            gap: '5rem !important',
            marginBottom: '5.5rem !important' 
          }}
        >
          <div>
            <h4 
              className="font-semibold flex items-center gap-3"
              style={{ 
                color: '#0C2C45',
                marginBottom: '1.5rem !important',
                lineHeight: '1.3'
              }}
            >
              <Check size={20} color="#27AE60" strokeWidth={2} />
              Precisão Legal
            </h4>
            <p className="text-sm leading-relaxed" style={{ 
              color: '#476D9E',
              lineHeight: '1.8',
              marginBottom: '0'
            }}>
              A Receita Federal exige a declaração pelo valor real de mercado. 
              Valores subdeclarados podem gerar multas e problemas futuros.
            </p>
          </div>
          
          <div>
            <h4 
              className="font-semibold flex items-center gap-3"
              style={{ 
                color: '#0C2C45',
                marginBottom: '1.5rem !important',
                lineHeight: '1.3'
              }}
            >
              <Check size={20} color="#27AE60" strokeWidth={2} />
              Cálculo Correto
            </h4>
            <p className="text-sm leading-relaxed" style={{ 
              color: '#476D9E',
              lineHeight: '1.8',
              marginBottom: '0'
            }}>
              O ITCMD é calculado sobre o valor real dos bens. 
              Nossa calculadora usa os valores que você informar para dar uma estimativa precisa.
            </p>
          </div>
        </div>
        
        <div 
          className="rounded-lg"
          style={{ 
            background: 'rgba(209, 191, 163, 0.1)',
            border: '1px solid rgba(209, 191, 163, 0.2)',
            padding: '2.5rem !important',
            marginTop: '2rem !important'
          }}
        >
          <p className="text-sm text-center leading-relaxed" style={{ 
            color: '#476D9E',
            lineHeight: '1.7'
          }}>
            <strong style={{ color: '#0C2C45' }}>Dica:</strong> Para imóveis, consulte sites especializados ou avaliações recentes. 
            Para veículos, use a tabela FIPE. Para investimentos, considere o valor atual da carteira.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ValueGuideSection;
