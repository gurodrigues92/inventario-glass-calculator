
import React from 'react';
import { Target, Zap, Lightbulb } from 'lucide-react';

const InfoSection = () => {
  return (
    <div className="mt-8 text-center fade-in-up">
      <div 
        className="glass-card max-w-4xl mx-auto p-8"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2DD',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(12, 44, 69, 0.08)',
          color: '#2C2C2C'
        }}
      >
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="flex justify-center mb-3">
              <Target size={32} color="#0C2C45" strokeWidth={1.5} />
            </div>
            <h3 
              className="font-semibold mb-2"
              style={{ color: '#0C2C45' }}
            >
              Precisão
            </h3>
            <p className="text-sm" style={{ color: '#476D9E' }}>
              Cálculos baseados nas alíquotas reais de cada estado
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-3">
              <Zap size={32} color="#0C2C45" strokeWidth={1.5} />
            </div>
            <h3 
              className="font-semibold mb-2"
              style={{ color: '#0C2C45' }}
            >
              Rapidez
            </h3>
            <p className="text-sm" style={{ color: '#476D9E' }}>
              Resultado em segundos com apenas 4 campos
            </p>
          </div>
          <div>
            <div className="flex justify-center mb-3">
              <Lightbulb size={32} color="#0C2C45" strokeWidth={1.5} />
            </div>
            <h3 
              className="font-semibold mb-2"
              style={{ color: '#0C2C45' }}
            >
              Economia
            </h3>
            <p className="text-sm" style={{ color: '#476D9E' }}>
              Descubra como economizar até 90% com Holding Familiar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
