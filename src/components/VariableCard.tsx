
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
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Médio':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Baixo':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white border border-[#E8E2DD] rounded-lg p-4 hover:bg-[#F5EFEB] transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-sm" style={{ color: '#0C2C45' }}>{titulo}</h4>
        <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor()}`}>
          {impacto}
        </span>
      </div>
      
      <p className="text-xs mb-2" style={{ color: '#476D9E' }}>{descricao}</p>
      
      <div className="text-xs bg-[#F5EFEB] rounded-md p-2">
        <span className="text-amber-600">Exemplo:</span> <span style={{ color: '#2C2C2C' }}>{exemplo}</span>
      </div>
    </div>
  );
};

export default VariableCard;
