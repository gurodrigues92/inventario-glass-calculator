
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
      color: 'purple' as const
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
      color: 'green' as const,
      tooltip: 'Baseado na média do mercado, os honorários costumam variar entre 1,5% e 1,7% do patrimônio. Para patrimônios litigiosos, esse valor pode ser maior.'
    },
    {
      icon: '📋',
      label: 'Custas do processo',
      value: formatCurrency(detalhamento.custas.valor),
      subtitle: detalhamento.custas.descricao,
      percentage: '',
      color: 'blue' as const
    },
    {
      icon: '🏢',
      label: 'Cartório e Registro',
      value: formatCurrency(detalhamento.cartorio.valor),
      subtitle: detalhamento.cartorio.descricao,
      percentage: `${detalhamento.cartorio.percentual}% do patrimônio`,
      color: 'orange' as const
    }
  ];

  return (
    <>
      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {breakdownCards.map((card, index) => (
          <div key={index} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <GlassCard className="text-center h-full">
              <div className="text-3xl mb-3">{card.icon}</div>
              <div className="mb-3">
                <div className={`text-2xl font-bold mb-1 ${
                  card.color === 'purple' ? 'text-purple-400' :
                  card.color === 'green' ? 'text-green-400' :
                  card.color === 'blue' ? 'text-blue-400' :
                  'text-orange-400'
                }`}>
                  {card.value}
                </div>
                {card.percentage && (
                  <div className="text-sm text-glass mb-2">
                    {card.percentage}
                  </div>
                )}
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{card.label}</h3>
              <p className="text-xs text-glass">{card.subtitle}</p>
              {card.tooltip && (
                <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300">
                  💡 {card.tooltip}
                </div>
              )}
            </GlassCard>
          </div>
        ))}
      </div>

      {/* ITBI Card se houver imóveis */}
      {detalhamento.itbi.valor > 0 && (
        <div className="mb-8">
          <GlassCard>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-2">
                {formatCurrency(detalhamento.itbi.valor)}
              </div>
              <div className="text-sm text-glass mb-2">
                {detalhamento.itbi.percentual?.toFixed(1)}% do valor dos imóveis
              </div>
              <h3 className="font-semibold text-white mb-1">{detalhamento.itbi.descricao}</h3>
              {detalhamento.itbi.informativo && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-sm">✅ {detalhamento.itbi.informativo}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default ResultsBreakdown;
