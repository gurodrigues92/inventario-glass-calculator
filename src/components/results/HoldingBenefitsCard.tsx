import React from 'react';
import { formatCurrencyWithDecimals, numeroParaExtenso } from '../../utils/formatters';
import GlassCard from '../GlassCard';
import { DadosCalculoInventario } from '../../utils/itcmdCalculator';
import { useIsMobile } from '../../hooks/use-mobile';

interface HoldingBenefitsCardProps {
  resultado: any;
  dadosCalculo: DadosCalculoInventario;
  economiaPercentual: string;
}

const HoldingBenefitsCard = ({ resultado, dadosCalculo, economiaPercentual }: HoldingBenefitsCardProps) => {
  const isMobile = useIsMobile();

  const honorariosConstituicaoHolding = dadosCalculo.patrimonio * 0.015;
  const custosCartorioHolding = dadosCalculo.patrimonio * 0.02;
  const totalHolding = honorariosConstituicaoHolding + custosCartorioHolding;

  return (
    <GlassCard premium={true}>
      <div className="text-center mb-6">
        <div 
          className={`inline-block ${isMobile ? 'px-4 py-1' : 'px-6 py-2'} rounded-full mb-4`}
          style={{
            background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
            color: 'white',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '700'
          }}
        >
          💡 Economia de até {economiaPercentual}%
        </div>
        
        <h3 
          className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4`}
          style={{ color: '#D1BFA3' }}
        >
          Com Holding Familiar S/A
        </h3>
        
        <p 
          className={`${isMobile ? 'text-sm' : ''} mb-6 leading-relaxed ${isMobile ? 'px-2' : ''}`}
          style={{ color: '#0C2C45' }}
        >
          Com a constituição de uma Holding Familiar S/A, você pode reduzir 
          significativamente o custo sucessório — e ainda profissionalizar 
          a gestão do patrimônio.
        </p>
        
        <div 
          className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2`}
          style={{ 
            color: '#27AE60',
            wordBreak: 'break-word'
          }}
        >
          Economia estimada: {formatCurrencyWithDecimals(resultado.resumo.economiaHolding)}
        </div>
        <div 
          className={`${isMobile ? 'text-sm' : 'text-lg'} italic mb-6`}
          style={{ 
            color: '#476D9E',
            fontSize: isMobile ? '12px' : undefined
          }}
        >
          "{numeroParaExtenso(resultado.resumo.economiaHolding)}"
        </div>
      </div>

      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2 gap-6'}`}>
        <div>
          <h4 
            className={`${isMobile ? 'text-sm' : ''} font-semibold mb-3`}
            style={{ color: '#0C2C45' }}
          >
            ✅ Benefícios da Holding S/A
          </h4>
          <ul className="space-y-2">
            <li 
              className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60' }}>✓</span>
              ITCMD: 0% sobre a diferença
            </li>
            <li 
              className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60' }}>✓</span>
              Ganho de Capital: 0%
            </li>
            <li 
              className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60' }}>✓</span>
              Constituição em 30 a 60 dias
            </li>
            <li 
              className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60' }}>✓</span>
              Gestão profissional do patrimônio
            </li>
          </ul>
        </div>
        
        <div>
          <h4 
            className={`${isMobile ? 'text-sm' : ''} font-semibold mb-3`}
            style={{ color: '#0C2C45' }}
          >
            💰 Custos da Holding S/A
          </h4>
          <div className="space-y-2">
            <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <span style={{ color: '#476D9E' }}>Honorários Constituição (1,5%):</span>
              <div className="text-right">
                <span 
                  className="font-medium"
                  style={{ color: '#0C2C45' }}
                >
                  {formatCurrencyWithDecimals(honorariosConstituicaoHolding)}
                </span>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-xs'} italic`}
                  style={{ 
                    color: '#476D9E',
                    fontSize: isMobile ? '10px' : undefined
                  }}
                >
                  "{numeroParaExtenso(honorariosConstituicaoHolding)}"
                </div>
              </div>
            </div>
            <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <span style={{ color: '#476D9E' }}>Custos Cartório (2%):</span>
              <div className="text-right">
                <span 
                  className="font-medium"
                  style={{ color: '#0C2C45' }}
                >
                  {formatCurrencyWithDecimals(custosCartorioHolding)}
                </span>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-xs'} italic`}
                  style={{ 
                    color: '#476D9E',
                    fontSize: isMobile ? '10px' : undefined
                  }}
                >
                  "{numeroParaExtenso(custosCartorioHolding)}"
                </div>
              </div>
            </div>
            <div 
              className="border-t pt-2 mt-2"
              style={{ borderColor: '#E8E2DD' }}
            >
              <div className={`flex justify-between font-semibold ${isMobile ? 'text-xs' : ''}`}>
                <span style={{ color: '#0C2C45' }}>Total:</span>
                <div className="text-right">
                  <span style={{ color: '#27AE60' }}>{formatCurrencyWithDecimals(totalHolding)}</span>
                  <div 
                    className={`${isMobile ? 'text-xs' : 'text-xs'} italic font-normal`}
                    style={{ 
                      color: '#476D9E',
                      fontSize: isMobile ? '10px' : undefined
                    }}
                  >
                    "{numeroParaExtenso(totalHolding)}"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default HoldingBenefitsCard;