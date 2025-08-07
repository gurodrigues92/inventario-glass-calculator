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
  
  // Verificar se base de cálculo é diferente do patrimônio total
  const mostraBaseCalculo = resultado.baseCalculo && resultado.baseCalculo !== resultado.patrimonio;

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
          className={`text-xs italic mt-1 ${isMobile ? 'text-center' : ''} leading-tight break-words max-w-full`}
          style={{ 
            color: '#476D9E',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto'
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
      
      {/* Base de Cálculo - mostrar quando diferente do patrimônio total */}
      {mostraBaseCalculo && (
        <div 
          className="mb-6 p-4 rounded-lg border-l-4"
          style={{ 
            background: 'rgba(255, 215, 0, 0.1)',
            borderLeftColor: '#FFD700'
          }}
        >
          <div className="text-sm font-medium" style={{ color: '#0C2C45' }}>
            Base de Cálculo ITCMD
          </div>
          <div className="text-xs mt-1" style={{ color: '#476D9E' }}>
            Valor Atual - Valor Histórico IR: {formatCurrencyWithDecimals(resultado.baseCalculo)}
          </div>
          <div className="text-xs italic mt-1" style={{ color: '#D1BFA3' }}>
            ⚠️ ITCMD calculado sobre ganho de capital, não sobre valor total
          </div>
        </div>
      )}

      <div className={`${isMobile ? 'space-y-6' : 'space-y-4'}`}>
        <CostItem
          title={`ITCMD (${formData.estado})`}
          description={resultado.detalhamento.itcmd.descricao}
          value={resultado.detalhamento.itcmd.valor}
          percentage={resultado.detalhamento.itcmd.percentual}
        />

        <CostItem
          title="Honorários Advocatícios"
          description={resultado.detalhamento.honorarios.descricao}
          value={resultado.detalhamento.honorarios.valor}
          percentage={resultado.detalhamento.honorarios.percentual}
        />

        <CostItem
          title="Custas e Cartório"
          description={resultado.detalhamento.custas.descricao}
          value={resultado.detalhamento.custas.valor}
          percentage={resultado.detalhamento.custas.percentual}
        />

        {resultado.detalhamento.ganhoCapital.valor > 0 && (
          <div 
            className="p-4 rounded-lg border-l-4"
            style={{ 
              background: 'rgba(255, 99, 71, 0.1)',
              borderLeftColor: '#FF6347'
            }}
          >
            <CostItem
              title="Imposto de Renda - Ganho de Capital"
              description="15% sobre valorização (vigência 2025+)"
              value={resultado.detalhamento.ganhoCapital.valor}
              percentage={15}
            />
            <div className="text-xs italic mt-2" style={{ color: '#FF6347' }}>
              ⚠️ Custo adicional com a reforma tributária a partir de 2025
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default CostBreakdownCard;