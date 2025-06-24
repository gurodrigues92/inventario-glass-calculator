
import React from 'react';

const InfoSection = () => {
  return (
    <div className="mt-8 text-center fade-in-up">
      <div 
        className="glass-card max-w-4xl mx-auto p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(133, 149, 171, 0.05) 0%, rgba(225, 229, 234, 0.03) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.95)'
        }}
      >
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-white mb-2">Precisão</h3>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Cálculos baseados nas alíquotas reais de cada estado
            </p>
          </div>
          <div>
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-white mb-2">Rapidez</h3>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Resultado em segundos com apenas 4 campos
            </p>
          </div>
          <div>
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold text-white mb-2">Economia</h3>
            <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Descubra como economizar até 90% com Holding Familiar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
