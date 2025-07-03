import React from 'react';
import { formatCurrencyWithDecimals, numeroParaExtenso } from '../../utils/formatters';
import GlassCard from '../GlassCard';
import { DadosCalculoInventario } from '../../utils/itcmdCalculator';
import { useIsMobile } from '../../hooks/use-mobile';

interface CostSummaryCardProps {
  resultado: any;
  dadosCalculo: DadosCalculoInventario;
}

const CostSummaryCard = ({ resultado, dadosCalculo }: CostSummaryCardProps) => {
  const isMobile = useIsMobile();

  return (
    <GlassCard className="text-center">
      <div className="mb-6">
        <h2 
          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold mb-2`}
          style={{ color: '#0C2C45' }}
        >
          Custos Estimados do Inventário
        </h2>
        <div 
          className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-2`}
          style={{ 
            color: '#D1BFA3',
            wordBreak: 'break-word',
            lineHeight: '1.1'
          }}
        >
          {formatCurrencyWithDecimals(resultado.resumo.custoTotal)}
        </div>
        <div 
          className={`${isMobile ? 'text-sm' : 'text-lg'} italic mb-4`}
          style={{ 
            color: '#476D9E',
            fontSize: isMobile ? '12px' : undefined,
            lineHeight: '1.3'
          }}
        >
          "{numeroParaExtenso(resultado.resumo.custoTotal)}"
        </div>
        <span 
          className={`${isMobile ? 'text-lg' : 'text-xl'}`}
          style={{ color: '#476D9E' }}
        >
          {resultado.resumo.percentualSobrePatrimonio}% do patrimônio
        </span>
      </div>

      <div 
        className={`inline-block px-4 py-2 rounded-full ${isMobile ? 'text-xs' : 'text-sm'} font-semibold`}
        style={{
          background: 'rgba(209, 191, 163, 0.1)',
          border: '1px solid rgba(209, 191, 163, 0.3)',
          color: '#0C2C45',
          maxWidth: '100%',
          wordBreak: 'break-word'
        }}
      >
        <div>💰 Patrimônio: {formatCurrencyWithDecimals(dadosCalculo.patrimonio)}</div>
        <div 
          className={`${isMobile ? 'text-xs' : 'text-xs'} italic mt-1`}
          style={{ 
            color: '#476D9E',
            fontSize: isMobile ? '10px' : undefined
          }}
        >
          "{numeroParaExtenso(dadosCalculo.patrimonio)}"
        </div>
      </div>
    </GlassCard>
  );
};

export default CostSummaryCard;