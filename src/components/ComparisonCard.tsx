
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
        ? 'border-purple-500 bg-purple-500/10' 
        : especial
        ? 'border-green-500 bg-green-500/10'
        : 'border-glass-border bg-glass-white'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`font-semibold ${
          destaque ? 'text-purple-400' : especial ? 'text-green-400' : 'text-white'
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
      
      <div className="text-2xl font-bold text-white mb-2">
        {formatCurrency(custo)}
      </div>
      
      <div className="text-sm text-glass mb-3">
        ⏱️ {tempo}
      </div>
      
      {economia && economia > 0 && (
        <div className="text-sm text-green-400">
          💰 Economia: {formatCurrency(economia)}
        </div>
      )}
    </div>
  );
};

export default ComparisonCard;
