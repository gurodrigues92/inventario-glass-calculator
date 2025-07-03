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
      className={`flex justify-between items-center ${isMobile ? 'p-3' : 'p-4'} rounded-lg`} 
      style={{ background: 'rgba(209, 191, 163, 0.05)' }}
    >
      <div className="flex-1">
        <span 
          className={`${isMobile ? 'text-sm' : ''} font-medium`}
          style={{ color: '#0C2C45' }}
        >
          {title}
        </span>
        <div 
          className={`${isMobile ? 'text-xs' : 'text-sm'}`}
          style={{ color: '#476D9E' }}
        >
          {description}
        </div>
      </div>
      <div className="text-right">
        <div 
          className={`${isMobile ? 'text-sm' : ''} font-semibold`}
          style={{ color: '#0C2C45' }}
        >
          {formatCurrencyWithDecimals(value)}
        </div>
        <div 
          className={`${isMobile ? 'text-xs' : 'text-xs'} italic`}
          style={{ 
            color: '#476D9E',
            fontSize: isMobile ? '10px' : undefined
          }}
        >
          "{numeroParaExtenso(value)}"
        </div>
        <div 
          className={`${isMobile ? 'text-xs' : 'text-sm'}`} 
          style={{ color: '#D1BFA3' }}
        >
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );

  return (
    <GlassCard>
      <h3 
        className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-6 text-center`}
        style={{ color: '#0C2C45' }}
      >
        Detalhamento dos Custos
      </h3>
      
      <div className="space-y-4">
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

        <CostItem
          title="Custas de Cartório"
          description="Registro e documentação"
          value={resultado.detalhamento.custas.valor}
          percentage={2}
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