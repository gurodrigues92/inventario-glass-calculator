import React from 'react';
import { formatCurrencyWithDecimals, numeroParaExtenso } from '../../utils/formatters';
import GlassCard from '../GlassCard';
import { DadosCalculoInventario, ResultadoCalculo } from '../../utils/itcmdCalculator';
import { useIsMobile } from '../../hooks/use-mobile';

interface CostSummaryCardProps {
  resultado: ResultadoCalculo;
  dadosCalculo: DadosCalculoInventario;
}

const CostSummaryCard = ({ resultado, dadosCalculo }: CostSummaryCardProps) => {
  const isMobile = useIsMobile();

  return (
    <GlassCard className={`text-center ${isMobile ? 'p-4' : 'p-6'}`}>
      <div className={`mb-6 ${isMobile ? 'space-y-4' : 'space-y-3'}`}>
        <h2 className={`${isMobile ? 'title-mobile-sm' : 'text-2xl'} font-semibold mb-2`}
            style={{ color: '#0C2C45' }}>
          Custos Estimados do Inventário
        </h2>
        <div className={`${isMobile ? 'value-responsive' : 'text-5xl'} font-bold mb-2 px-2`}
             style={{ 
               color: '#D1BFA3',
               wordBreak: 'break-word',
               lineHeight: isMobile ? '1.2' : '1.1'
             }}>
          {formatCurrencyWithDecimals(resultado.resumo.custoTotal)}
        </div>
        <div 
          className={`${isMobile ? 'text-xs' : 'text-lg'} italic mb-4 px-2`}
          style={{ 
            color: '#476D9E',
            lineHeight: '1.3'
          }}
        >
          "{numeroParaExtenso(resultado.resumo.custoTotal)}"
        </div>
        <span 
          className={`${isMobile ? 'text-base' : 'text-xl'} font-medium`}
          style={{ color: '#476D9E' }}
        >
          {resultado.resumo.percentualSobrePatrimonio}% do patrimônio
        </span>
      </div>

      <div 
        className={`${isMobile ? 'w-full p-3' : 'inline-block px-4 py-2'} rounded-full ${isMobile ? 'text-sm' : 'text-sm'} font-semibold`}
        style={{
          background: 'rgba(209, 191, 163, 0.1)',
          border: '1px solid rgba(209, 191, 163, 0.3)',
          color: '#0C2C45',
          wordBreak: 'break-word'
        }}
      >
        <div className={`${isMobile ? 'text-center' : ''}`}>
          💰 Patrimônio: {formatCurrencyWithDecimals(dadosCalculo.patrimonio)}
        </div>
        <div 
          className={`${isMobile ? 'text-xs' : 'text-xs'} italic mt-1 ${isMobile ? 'text-center' : ''}`}
          style={{ 
            color: '#476D9E'
          }}
        >
          "{numeroParaExtenso(dadosCalculo.patrimonio)}"
        </div>
      </div>
    </GlassCard>
  );
};

export default CostSummaryCard;