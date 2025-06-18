
import React from 'react';
import GlassCard from './GlassCard';

const LeiLegitimaCard = () => {
  return (
    <div className="mb-8">
      <GlassCard className="border-2 border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5 luxury-card">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">⚖️</div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 golden-accent">
              📚 O que é a Legítima?
            </h3>
            <p className="text-glass text-sm leading-relaxed mb-4">
              <span className="text-blue-300 font-semibold">50% do patrimônio</span> obrigatoriamente 
              pertence aos herdeiros legais (descendentes, ascendentes ou cônjuge). 
              Os outros <span className="text-blue-300 font-semibold">50% podem ser dispostos livremente</span>, 
              por exemplo, por testamento ou doação.
            </p>
            
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <h4 className="text-blue-300 font-semibold mb-2">💡 Por que isso é importante?</h4>
              <ul className="space-y-1 text-xs text-glass">
                <li>• Garante proteção aos herdeiros necessários</li>
                <li>• Permite planejamento da parte disponível</li>
                <li>• Influencia estratégias de doação em vida</li>
                <li>• Fundamental para estruturação de holdings</li>
              </ul>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-blue-300">
              <span>🎯</span>
              <span>Conhecer a legítima é fundamental para o planejamento sucessório eficiente</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default LeiLegitimaCard;
