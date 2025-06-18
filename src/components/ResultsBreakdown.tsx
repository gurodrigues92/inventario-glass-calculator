
import React from 'react';
import BreakdownCard from './BreakdownCard';
import GlassCard from './GlassCard';
import { formatCurrency } from '../utils/formatters';
import { DetalhamentoCusto } from '../utils/itcmdCalculator';

interface ResultsBreakdownProps {
  detalhamento: {
    itcmd: DetalhamentoCusto;
    honorarios: DetalhamentoCusto;
    custas: DetalhamentoCusto;
    cartorio: DetalhamentoCusto;
    itbi: DetalhamentoCusto;
  };
}

const ResultsBreakdown = ({ detalhamento }: ResultsBreakdownProps) => {
  const breakdownCards = [
    {
      icon: '🏛️',
      label: 'ITCMD a pagar',
      value: formatCurrency(detalhamento.itcmd.valor),
      subtitle: detalhamento.itcmd.descricao,
      percentage: `${detalhamento.itcmd.percentual?.toFixed(1)}% do patrimônio`,
      color: 'from-purple-400 to-purple-600' as const,
      bgColor: 'bg-gradient-to-r from-purple-500/10 to-purple-600/10'
    },
    {
      icon: '⚖️',
      label: 'Honorários advocatícios',
      value: detalhamento.honorarios.isRange 
        ? `${formatCurrency(detalhamento.honorarios.valorMinimo!)} - ${formatCurrency(detalhamento.honorarios.valorMaximo!)}`
        : formatCurrency(detalhamento.honorarios.valor),
      subtitle: detalhamento.honorarios.descricao,
      percentage: detalhamento.honorarios.isRange 
        ? '1,5% a 1,7% do patrimônio'
        : `${detalhamento.honorarios.percentual?.toFixed(1)}% do patrimônio`,
      color: 'from-green-400 to-green-600' as const,
      bgColor: 'bg-gradient-to-r from-green-500/10 to-green-600/10',
      tooltip: detalhamento.honorarios.tooltip
    },
    {
      icon: '📋',
      label: 'Custas do processo',
      value: formatCurrency(detalhamento.custas.valor),
      subtitle: detalhamento.custas.descricao,
      percentage: '',
      color: 'from-blue-400 to-blue-600' as const,
      bgColor: 'bg-gradient-to-r from-blue-500/10 to-blue-600/10'
    },
    {
      icon: '🏢',
      label: 'Cartório e Registro',
      value: formatCurrency(detalhamento.cartorio.valor),
      subtitle: detalhamento.cartorio.descricao,
      percentage: `${detalhamento.cartorio.percentual}% do patrimônio`,
      color: 'from-orange-400 to-orange-600' as const,
      bgColor: 'bg-gradient-to-r from-orange-500/10 to-orange-600/10'
    }
  ];

  return (
    <>
      {/* Metrics Grid Premium */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {breakdownCards.map((card, index) => (
          <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={`luxury-card text-center h-full p-6 ${card.bgColor} border-2 border-white/10`}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <div className="mb-4">
                <div className={`text-2xl font-bold mb-2 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.value}
                </div>
                {card.percentage && (
                  <div className="text-sm text-glass mb-2 font-medium">
                    {card.percentage}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{card.label}</h3>
              <p className="text-xs text-glass leading-relaxed">{card.subtitle}</p>
              {card.tooltip && (
                <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-left">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-400 text-sm">💡</span>
                    <p className="text-blue-300 text-xs leading-relaxed">{card.tooltip}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ITBI Card Premium se houver imóveis */}
      {detalhamento.itbi.valor > 0 && (
        <div className="mb-8">
          <div className="luxury-card p-6 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-2 border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🏠</span>
                <div>
                  <h3 className="font-semibold text-white text-lg">{detalhamento.itbi.descricao}</h3>
                  <p className="text-sm text-glass">
                    {detalhamento.itbi.percentual?.toFixed(1)}% do valor dos imóveis
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                  {formatCurrency(detalhamento.itbi.valor)}
                </div>
              </div>
            </div>
            
            {detalhamento.itbi.informativo && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 text-lg">✅</span>
                  <p className="text-green-300 text-sm font-medium">{detalhamento.itbi.informativo}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ResultsBreakdown;
