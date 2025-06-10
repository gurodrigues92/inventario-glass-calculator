
import React from 'react';

interface VariableCardProps {
  titulo: string;
  impacto: 'Alto' | 'Médio' | 'Baixo';
  descricao: string;
  exemplo: string;
}

const VariableCard = ({ titulo, impacto, descricao, exemplo }: VariableCardProps) => {
  const getImpactColor = () => {
    switch (impacto) {
      case 'Alto':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Médio':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Baixo':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-glass-white border border-glass-border rounded-lg p-4 hover:bg-glass-light transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">{titulo}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor()}`}>
          {impacto}
        </span>
      </div>
      
      <p className="text-xs text-glass mb-2">{descricao}</p>
      
      <div className="text-xs text-glass-light bg-glass-dark rounded-md p-2">
        <span className="text-amber-400">Exemplo:</span> {exemplo}
      </div>
    </div>
  );
};

export default VariableCard;
