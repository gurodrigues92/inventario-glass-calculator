import React from 'react';
import { formatCurrencyWithDecimals, numeroParaExtenso } from '../../utils/formatters';
import GlassCard from '../GlassCard';
import { useIsMobile } from '../../hooks/use-mobile';

interface CostBreakdownCardProps {
  resultado: any;
  formData: any;
}

const CostBreakdownCard = ({ resultado, formData }: CostBreakdownCardProps) => {
  const isMobile = useIsMobile();

  const CostItem = ({ 
    title, 
    description, 
    value, 
    percentage 
  }: { 
    title: string; 
    description: string; 
    value: number; 
    percentage: number; 
  }) => (
    <div 
      className={`${isMobile ? 'flex flex-col space-y-3 p-4' : 'flex justify-between items-center p-4'} rounded-lg`} 
      style={{ background: 'rgba(209, 191, 163, 0.05)' }}
    >
      <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
        <span 
          className={`${isMobile ? 'text-base' : 'text-base'} font-medium block`}
          style={{ color: '#0C2C45' }}
        >
          {title}
        </span>
        <div 
          className={`${isMobile ? 'text-sm' : 'text-sm'} mt-1`}
          style={{ color: '#476D9E' }}
        >
          {description}
        </div>
      </div>
      <div className={`${isMobile ? 'w-full' : 'text-right'} ${isMobile ? 'border-t border-gray-200 pt-3' : ''}`}>
        <div 
          className={`${isMobile ? 'text-lg text-center' : 'text-base'} font-semibold`}
          style={{ color: '#0C2C45' }}
        >
          {formatCurrencyWithDecimals(value)}
        </div>
        <div 
          className={`text-xs italic mt-1 ${isMobile ? 'text-center' : ''}`}
          style={{ 
            color: '#476D9E'
          }}
        >
          "{numeroParaExtenso(value)}"
        </div>
        <div 
          className={`${isMobile ? 'text-sm text-center' : 'text-sm'} mt-1 font-medium`} 
          style={{ color: '#D1BFA3' }}
        >
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );

  return (
    <GlassCard className={`${isMobile ? 'p-4' : 'p-6'}`}>
      <h3 
        className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-6 text-center`}
        style={{ color: '#0C2C45' }}
      >
        Detalhamento dos Custos
      </h3>
      
      <div className={`${isMobile ? 'space-y-6' : 'space-y-4'}`}>
        <CostItem
          title={`ITCMD (${formData.estado})`}
          description="Imposto estadual sobre herança"
          value={resultado.detalhamento.itcmd.valor}
          percentage={resultado.detalhamento.itcmd.percentual}
        />

        <CostItem
          title="Honorários Advocatícios"
          description="10% do patrimônio"
          value={resultado.detalhamento.honorarios.valor}
          percentage={10}
        />

        {resultado.detalhamento.ganhoCapital.valor > 0 && (
          <CostItem
            title="Ganho de Capital"
            description="15% sobre valorização"
            value={resultado.detalhamento.ganhoCapital.valor}
            percentage={15}
          />
        )}
      </div>
    </GlassCard>
  );
};

export default CostBreakdownCard;