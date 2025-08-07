import React from 'react';
import { Check, Lightbulb } from 'lucide-react';
const HeroSection = () => {
  return <div className="text-center mb-12 fade-in-up">
      <h1 className="title-responsive heading-responsive mb-8 sm:mb-6 max-w-4xl mx-auto text-center">
        Reduza Legalmente o Imposto de Herança e Proteja seu Patrimônio
      </h1>
      <p className="subtitle-responsive max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-6 text-center" style={{
      color: '#476D9E'
    }}>Descubra agora quanto você pode economizar com nosso cálculo inteligente</p>
      <p className="text-xl sm:text-2xl font-bold mb-10 sm:mb-8 text-center" style={{
      color: '#0C2C45',
      textShadow: '0 2px 4px rgba(12, 44, 69, 0.2)'
    }}>
        rápido e preciso!
      </p>
      
      {/* Elementos de Confiança */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 mb-12 sm:mb-8 flex-wrap">
        <div className="flex items-center gap-2 text-sm" style={{
        color: '#476D9E'
      }}>
          <Check size={16} color="#27AE60" strokeWidth={2} />
          <span>100% Legal</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{
        color: '#476D9E'
      }}>
          <Check size={16} color="#27AE60" strokeWidth={2} />
          <span>Resultado em Segundos</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{
        color: '#476D9E'
      }}>
          <Check size={16} color="#27AE60" strokeWidth={2} />
          <span>Economia até 90%</span>
        </div>
      </div>
      
      {/* Aviso sobre Valor de Mercado */}
      <div className="max-w-2xl mx-auto p-5 sm:p-4 rounded-lg mb-8" style={{
      background: 'rgba(209, 191, 163, 0.1)',
      border: '1px solid rgba(209, 191, 163, 0.3)',
      boxShadow: '0 2px 8px rgba(209, 191, 163, 0.1)'
    }}>
        <div className="flex items-center gap-4 sm:gap-3 text-sm" style={{
        color: '#0C2C45'
      }}>
          <Lightbulb size={20} color="#0C2C45" strokeWidth={1.5} />
          <div className="text-left">
            <strong>Importante:</strong> Para cálculos precisos, informe os <strong>valores reais de mercado</strong> dos bens. 
            Isso garante conformidade legal e evita problemas futuros.
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;