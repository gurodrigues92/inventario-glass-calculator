
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
      color: 'purple' as const
    },
    {
      icon: '⚖️',
      label: 'Honorários advocatícios',
      value: formatCurrency(detalhamento.honorarios.valor),
      subtitle: `${detalhamento.honorarios.percentual?.toFixed(0)}% do patrimônio`,
      color: 'green' as const
    },
    {
      icon: '📋',
      label: 'Custas do processo',
      value: formatCurrency(detalhamento.custas.valor),
      subtitle: detalhamento.custas.descricao,
      color: 'blue' as const
    },
    {
      icon: '🏢',
      label: 'Cartório e Registro',
      value: formatCurrency(detalhamento.cartorio.valor),
      subtitle: detalhamento.cartorio.descricao,
      color: 'orange' as const
    }
  ];

  return (
    <>
      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {breakdownCards.map((card, index) => (
          <BreakdownCard
            key={index}
            icon={card.icon}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            color={card.color}
          />
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
              <h3 className="font-semibold text-white mb-1">ITBI sobre Imóveis</h3>
              <p className="text-xs text-glass">{detalhamento.itbi.descricao}</p>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};

export default ResultsBreakdown;
