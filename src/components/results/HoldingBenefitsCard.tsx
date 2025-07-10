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
  const totalHolding = honorariosConstituicaoHolding;

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

      <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid md:grid-cols-2 gap-6'}`}>
        <div className={`${isMobile ? 'order-1' : ''}`}>
          <h4 
            className={`${isMobile ? 'text-base' : 'text-base'} font-semibold mb-4`}
            style={{ color: '#0C2C45' }}
          >
            ✅ Benefícios da Holding S/A
          </h4>
          <ul className={`${isMobile ? 'space-y-3' : 'space-y-2'}`}>
            <li 
              className={`flex items-center gap-3 ${isMobile ? 'text-sm' : 'text-sm'} ${isMobile ? 'p-2 bg-green-50 rounded-lg' : ''}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60', fontSize: isMobile ? '16px' : '14px' }}>✓</span>
              <span>ITCMD: 0% sobre a diferença</span>
            </li>
            <li 
              className={`flex items-center gap-3 ${isMobile ? 'text-sm' : 'text-sm'} ${isMobile ? 'p-2 bg-green-50 rounded-lg' : ''}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60', fontSize: isMobile ? '16px' : '14px' }}>✓</span>
              <span>Ganho de Capital: 0%</span>
            </li>
            <li 
              className={`flex items-center gap-3 ${isMobile ? 'text-sm' : 'text-sm'} ${isMobile ? 'p-2 bg-green-50 rounded-lg' : ''}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60', fontSize: isMobile ? '16px' : '14px' }}>✓</span>
              <span>Constituição em 30 a 60 dias</span>
            </li>
            <li 
              className={`flex items-center gap-3 ${isMobile ? 'text-sm' : 'text-sm'} ${isMobile ? 'p-2 bg-green-50 rounded-lg' : ''}`}
              style={{ color: '#476D9E' }}
            >
              <span style={{ color: '#27AE60', fontSize: isMobile ? '16px' : '14px' }}>✓</span>
              <span>Gestão profissional do patrimônio</span>
            </li>
          </ul>
        </div>
        
        <div className={`${isMobile ? 'order-2' : ''}`}>
          <h4 
            className={`${isMobile ? 'text-base' : 'text-base'} font-semibold mb-4`}
            style={{ color: '#0C2C45' }}
          >
            💰 Custos da Holding S/A
          </h4>
          <div className={`${isMobile ? 'space-y-4' : 'space-y-2'}`}>
            <div className={`${isMobile ? 'flex flex-col space-y-2 p-3 bg-blue-50 rounded-lg' : 'flex justify-between text-sm'}`}>
              <span className={`${isMobile ? 'text-sm font-medium' : ''}`} style={{ color: '#476D9E' }}>
                Honorários Constituição (1,5%):
              </span>
              <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
                <span 
                  className={`font-medium ${isMobile ? 'text-lg' : ''}`}
                  style={{ color: '#0C2C45' }}
                >
                  {formatCurrencyWithDecimals(honorariosConstituicaoHolding)}
                </span>
                <div 
                  className={`text-xs italic mt-1 ${isMobile ? 'text-center' : ''}`}
                  style={{ 
                    color: '#476D9E'
                  }}
                >
                  "{numeroParaExtenso(honorariosConstituicaoHolding)}"
                </div>
              </div>
            </div>
            <div 
              className={`border-t pt-3 mt-3 ${isMobile ? 'border-gray-200' : ''}`}
              style={{ borderColor: isMobile ? undefined : '#E8E2DD' }}
            >
              <div className={`${isMobile ? 'flex flex-col space-y-2 p-3 bg-green-50 rounded-lg' : 'flex justify-between font-semibold'}`}>
                <span className={`${isMobile ? 'text-sm font-medium text-center' : ''}`} style={{ color: '#0C2C45' }}>
                  Total:
                </span>
                <div className={`${isMobile ? 'text-center' : 'text-right'}`}>
                  <span className={`${isMobile ? 'text-xl font-bold' : ''}`} style={{ color: '#27AE60' }}>
                    {formatCurrencyWithDecimals(totalHolding)}
                  </span>
                  <div 
                    className={`text-xs italic font-normal mt-1 ${isMobile ? 'text-center' : ''}`}
                    style={{ 
                      color: '#476D9E'
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