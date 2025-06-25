
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface ComparisonCardProps {
  tipo: string;
  custo: number;
  tempo: string;
  destaque?: boolean;
  economia?: number;
  especial?: boolean;
}

const ComparisonCard = ({ tipo, custo, tempo, destaque, economia, especial }: ComparisonCardProps) => {
  return (
    <div className={`p-6 rounded-lg border transition-all ${
      destaque 
        ? 'border-purple-400 bg-purple-50' 
        : especial
        ? 'border-green-400 bg-green-50'
        : 'border-[#E8E2DD] bg-white'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-semibold ${
          destaque ? 'text-purple-700' : especial ? 'text-green-700' : 'text-[#0C2C45]'
        }`}>
          {tipo}
        </h4>
        {destaque && (
          <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">
            Selecionado
          </span>
        )}
        {especial && (
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
            Recomendado
          </span>
        )}
      </div>
      
      <div className="text-2xl font-bold mb-2" style={{ color: '#0C2C45' }}>
        {formatCurrency(custo)}
      </div>
      
      <div className="text-sm mb-3" style={{ color: '#476D9E' }}>
        ⏱️ {tempo}
      </div>
      
      {economia && economia > 0 && (
        <div className="text-sm text-green-600">
          💰 Economia: {formatCurrency(economia)}
        </div>
      )}
    </div>
  );
};

export default ComparisonCard;
