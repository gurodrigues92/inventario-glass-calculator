
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface InsightCardProps {
  tipo: 'economia' | 'estrategia' | 'informacao';
  titulo: string;
  descricao: string;
  valor?: number;
}

const InsightCard = ({ tipo, titulo, descricao, valor }: InsightCardProps) => {
  const getIcon = () => {
    switch (tipo) {
      case 'economia':
        return '💰';
      case 'estrategia':
        return '🎯';
      case 'informacao':
        return 'ℹ️';
      default:
        return '💡';
    }
  };

  const getColorClass = () => {
    switch (tipo) {
      case 'economia':
        return 'border-green-500/30 bg-green-500/10';
      case 'estrategia':
        return 'border-purple-500/30 bg-purple-500/10';
      case 'informacao':
        return 'border-blue-500/30 bg-blue-500/10';
      default:
        return 'border-glass-border bg-glass-white';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClass()}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{titulo}</h4>
          <p className="text-sm text-glass">{descricao}</p>
          {valor && (
            <div className="text-lg font-bold text-green-400 mt-2">
              {formatCurrency(valor)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
