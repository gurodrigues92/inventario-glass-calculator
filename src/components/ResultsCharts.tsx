
import React from 'react';
import GlassCard from './GlassCard';
import { DetalhamentoCusto } from '../utils/itcmdCalculator';

interface ResultsChartsProps {
  detalhamento: {
    itcmd: DetalhamentoCusto;
    honorarios: DetalhamentoCusto;
    custas: DetalhamentoCusto;
    cartorio: DetalhamentoCusto;
  };
  custoTotal: number;
}

const ResultsCharts = ({ detalhamento, custoTotal }: ResultsChartsProps) => {
  const chartItems = [
    { label: 'ITCMD', valor: detalhamento.itcmd.valor, color: 'purple-500' },
    { label: 'Honorários', valor: detalhamento.honorarios.valor, color: 'green-500' },
    { label: 'Custas', valor: detalhamento.custas.valor, color: 'blue-500' },
    { label: 'Cartório', valor: detalhamento.cartorio.valor, color: 'orange-500' }
  ];

  return (
    <GlassCard className="fade-in-up stagger-2">
      <h3 className="heading-md mb-6">Composição dos Custos</h3>
      <div className="space-y-4">
        {chartItems.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center">
              <span className="text-glass">{item.label}</span>
              <span className="text-white font-semibold">
                {((item.valor / custoTotal) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`bg-${item.color} h-2 rounded-full`} 
                style={{ width: `${(item.valor / custoTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default ResultsCharts;
