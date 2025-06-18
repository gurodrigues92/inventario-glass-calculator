
import React from 'react';
import GlassCard from './GlassCard';

const LeiLegitimaCard = () => {
  return (
    <div className="mb-8">
      <GlassCard className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">⚖️</div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              O que é a Legítima?
            </h3>
            <p className="text-glass text-sm leading-relaxed">
              <span className="text-blue-300 font-semibold">50% do patrimônio</span> obrigatoriamente 
              pertence aos herdeiros legais (descendentes, ascendentes ou cônjuge). 
              Os outros <span className="text-blue-300 font-semibold">50% podem ser dispostos livremente</span>, 
              por exemplo, por testamento.
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs text-blue-300">
              <span>💡</span>
              <span>Conhecer a legítima é fundamental para o planejamento sucessório</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default LeiLegitimaCard;
