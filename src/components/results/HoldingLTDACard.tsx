
import React from 'react';
import { formatCurrencyWithDecimals, numeroParaExtenso } from '../../utils/formatters';
import GlassCard from '../GlassCard';
import { useIsMobile } from '../../hooks/use-mobile';
import { TrendingDown, Building2 } from 'lucide-react';

interface HoldingLTDACardProps {
  resultadoLTDA: {
    ganhoCapital: number;
    itcmdDoacao: number;
    honorariosAdvogado: number;
    cartorio: number;
    itbi: number;
    total: number;
  };
  custoTotalPF: number;
  patrimonio: number;
}

const HoldingLTDACard = ({ resultadoLTDA, custoTotalPF, patrimonio }: HoldingLTDACardProps) => {
  const isMobile = useIsMobile();
  
  const economia = custoTotalPF - resultadoLTDA.total;
  const economiaPercentual = custoTotalPF > 0 ? ((economia / custoTotalPF) * 100).toFixed(0) : '0';
  const percentualPatrimonio = patrimonio > 0 ? ((resultadoLTDA.total / patrimonio) * 100).toFixed(1) : '0';

  const custos = [
    { label: 'Ganho de Capital (15%)', valor: resultadoLTDA.ganhoCapital },
    { label: 'ITCMD Doação', valor: resultadoLTDA.itcmdDoacao },
    { label: 'Honorários Advocatícios', valor: resultadoLTDA.honorariosAdvogado, fixo: true },
    { label: 'Custas de Cartório (0,5%)', valor: resultadoLTDA.cartorio },
    { label: 'ITBI (3% sobre diferença)', valor: resultadoLTDA.itbi },
  ];

  return (
    <div className="animate-fade-in">
      <GlassCard>
        <div className="text-center mb-6">
          <div 
            className={`inline-flex items-center gap-2 ${isMobile ? 'px-4 py-1' : 'px-6 py-2'} rounded-full mb-4`}
            style={{
              background: 'linear-gradient(135deg, #F39C12, #F1C40F)',
              color: 'white',
              fontSize: isMobile ? '12px' : '14px',
              fontWeight: '700'
            }}
          >
            <Building2 className="w-4 h-4" />
            Holding LTDA
          </div>
          
          <h3 
            className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4`}
            style={{ color: '#0C2C45' }}
          >
            Opção Intermediária de Economia
          </h3>
          
          <p 
            className={`${isMobile ? 'text-sm' : ''} mb-6 leading-relaxed ${isMobile ? 'px-2' : ''}`}
            style={{ color: '#476D9E' }}
          >
            A Holding LTDA oferece economia significativa em relação ao inventário tradicional, 
            mas ainda incide alguns tributos sobre a transferência de patrimônio.
          </p>

          {/* Custo Total */}
          <div 
            className={`${isMobile ? 'p-4' : 'p-6'} rounded-xl mb-4`}
            style={{ 
              background: 'rgba(243, 156, 18, 0.1)',
              border: '1px solid rgba(243, 156, 18, 0.3)'
            }}
          >
            <div 
              className={`${isMobile ? 'text-sm' : 'text-base'} mb-2`}
              style={{ color: '#476D9E' }}
            >
              Custo Total com Holding LTDA
            </div>
            <div 
              className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}
              style={{ color: '#F39C12' }}
            >
              {formatCurrencyWithDecimals(resultadoLTDA.total)}
            </div>
            <div 
              className={`${isMobile ? 'text-xs' : 'text-sm'} italic mt-1`}
              style={{ color: '#476D9E' }}
            >
              ({percentualPatrimonio}% do patrimônio)
            </div>
          </div>

          {/* Economia em relação a PF */}
          <div 
            className={`inline-flex items-center gap-2 ${isMobile ? 'px-4 py-2' : 'px-6 py-3'} rounded-full`}
            style={{
              background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
              color: 'white'
            }}
          >
            <TrendingDown className="w-4 h-4" />
            <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold`}>
              Economia de {formatCurrencyWithDecimals(economia)} ({economiaPercentual}%)
            </span>
          </div>
        </div>

        {/* Detalhamento dos Custos */}
        <div className="mt-6">
          <h4 
            className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-4`}
            style={{ color: '#0C2C45' }}
          >
            📋 Detalhamento dos Custos
          </h4>
          
          <div className={`${isMobile ? 'space-y-3' : 'space-y-2'}`}>
            {custos.map((custo, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center ${isMobile ? 'p-3 bg-amber-50 rounded-lg' : 'py-2 border-b border-gray-100'}`}
              >
                <span 
                  className={`${isMobile ? 'text-sm' : 'text-sm'}`}
                  style={{ color: '#476D9E' }}
                >
                  {custo.label}
                  {custo.fixo && (
                    <span 
                      className="ml-2 px-2 py-0.5 rounded text-xs"
                      style={{ background: 'rgba(71, 109, 158, 0.1)', color: '#476D9E' }}
                    >
                      Valor fixo
                    </span>
                  )}
                </span>
                <span 
                  className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}
                  style={{ color: '#0C2C45' }}
                >
                  {formatCurrencyWithDecimals(custo.valor)}
                </span>
              </div>
            ))}
            
            {/* Total */}
            <div 
              className={`flex justify-between items-center ${isMobile ? 'p-3 rounded-lg' : 'pt-3 mt-2'}`}
              style={{ 
                background: isMobile ? 'rgba(243, 156, 18, 0.1)' : 'transparent',
                borderTop: isMobile ? 'none' : '2px solid #F39C12'
              }}
            >
              <span 
                className={`${isMobile ? 'text-base' : 'text-base'} font-bold`}
                style={{ color: '#0C2C45' }}
              >
                TOTAL
              </span>
              <span 
                className={`${isMobile ? 'text-lg' : 'text-lg'} font-bold`}
                style={{ color: '#F39C12' }}
              >
                {formatCurrencyWithDecimals(resultadoLTDA.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Comparativo rápido */}
        <div 
          className={`mt-6 ${isMobile ? 'p-4' : 'p-4'} rounded-xl`}
          style={{ 
            background: 'rgba(39, 174, 96, 0.05)',
            border: '1px solid rgba(39, 174, 96, 0.2)'
          }}
        >
          <div className={`flex justify-between items-center ${isMobile ? 'text-sm' : ''}`}>
            <span style={{ color: '#476D9E' }}>Pessoa Física:</span>
            <span style={{ color: '#E74C3C', textDecoration: 'line-through' }}>
              {formatCurrencyWithDecimals(custoTotalPF)}
            </span>
          </div>
          <div className={`flex justify-between items-center mt-2 ${isMobile ? 'text-sm' : ''}`}>
            <span style={{ color: '#476D9E' }}>Holding LTDA:</span>
            <span style={{ color: '#F39C12', fontWeight: '600' }}>
              {formatCurrencyWithDecimals(resultadoLTDA.total)}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default HoldingLTDACard;
