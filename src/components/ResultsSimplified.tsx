import React from 'react';
import { formatCurrencyWithDecimals, numeroParaExtenso } from '../utils/formatters';
import GlassCard from './GlassCard';
import { DadosCalculoInventario } from '../utils/itcmdCalculator';
import { useIsMobile } from '../hooks/use-mobile';

interface ResultsSimplifiedProps {
  resultado: any;
  dadosCalculo: DadosCalculoInventario;
  formData: any;
}

const ResultsSimplified = ({ resultado, dadosCalculo, formData }: ResultsSimplifiedProps) => {
  const isMobile = useIsMobile();
  
  const economiaPercentual = resultado.resumo.economiaHolding && resultado.resumo.custoTotal > 0 
    ? ((resultado.resumo.economiaHolding / resultado.resumo.custoTotal) * 100).toFixed(0)
    : '0';

  // Calcular honorários da holding dinamicamente
  const honorariosConstituicaoHolding = dadosCalculo.patrimonio * 0.015;
  const custosCartorioHolding = 16000;
  const totalHolding = honorariosConstituicaoHolding + custosCartorioHolding;

  return (
    <div className={`space-y-8 ${isMobile ? 'mobile-results-content' : ''}`} id="results-content">
      {/* PÁGINA 1 - CUSTOS E DETALHAMENTO */}
      <div id="results-page-1" className="space-y-8" style={{ pageBreakAfter: 'always', minHeight: '100vh' }}>
        {/* Card Principal - Custo Total */}
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

        {/* Detalhamento dos Custos */}
        <GlassCard>
          <h3 
            className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold mb-6 text-center`}
            style={{ color: '#0C2C45' }}
          >
            Detalhamento dos Custos
          </h3>
          
          <div className="space-y-4">
            <div 
              className={`flex justify-between items-center ${isMobile ? 'p-3' : 'p-4'} rounded-lg`} 
              style={{ background: 'rgba(209, 191, 163, 0.05)' }}
            >
              <div className="flex-1">
                <span 
                  className={`${isMobile ? 'text-sm' : ''} font-medium`}
                  style={{ color: '#0C2C45' }}
                >
                  ITCMD ({formData.estado})
                </span>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ color: '#476D9E' }}
                >
                  Imposto estadual sobre herança
                </div>
              </div>
              <div className="text-right">
                <div 
                  className={`${isMobile ? 'text-sm' : ''} font-semibold`}
                  style={{ color: '#0C2C45' }}
                >
                  {formatCurrencyWithDecimals(resultado.detalhamento.itcmd.valor)}
                </div>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-xs'} italic`}
                  style={{ 
                    color: '#476D9E',
                    fontSize: isMobile ? '10px' : undefined
                  }}
                >
                  "{numeroParaExtenso(resultado.detalhamento.itcmd.valor)}"
                </div>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-sm'}`} 
                  style={{ color: '#D1BFA3' }}
                >
                  {resultado.detalhamento.itcmd.percentual.toFixed(1)}%
                </div>
              </div>
            </div>

            <div 
              className={`flex justify-between items-center ${isMobile ? 'p-3' : 'p-4'} rounded-lg`} 
              style={{ background: 'rgba(209, 191, 163, 0.05)' }}
            >
              <div className="flex-1">
                 <span 
                  className={`${isMobile ? 'text-sm' : ''} font-medium`}
                  style={{ color: '#0C2C45' }}
                >
                  Honorários Advocatícios
                </span>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ color: '#476D9E' }}
                >
                  10% do patrimônio
                </div>
              </div>
              <div className="text-right">
                <div 
                  className={`${isMobile ? 'text-sm' : ''} font-semibold`}
                  style={{ color: '#0C2C45' }}
                >
                  {formatCurrencyWithDecimals(resultado.detalhamento.honorarios.valor)}
                </div>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-xs'} italic`}
                  style={{ 
                    color: '#476D9E',
                    fontSize: isMobile ? '10px' : undefined
                  }}
                >
                  "{numeroParaExtenso(resultado.detalhamento.honorarios.valor)}"
                </div>
                 <div 
                  className={`${isMobile ? 'text-xs' : 'text-sm'}`} 
                  style={{ color: '#D1BFA3' }}
                >
                  10%
                </div>
              </div>
            </div>

            <div 
              className={`flex justify-between items-center ${isMobile ? 'p-3' : 'p-4'} rounded-lg`} 
              style={{ background: 'rgba(209, 191, 163, 0.05)' }}
            >
              <div className="flex-1">
                <span 
                  className={`${isMobile ? 'text-sm' : ''} font-medium`}
                  style={{ color: '#0C2C45' }}
                >
                  Custas de Cartório
                </span>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-sm'}`}
                  style={{ color: '#476D9E' }}
                >
                  Registro e documentação
                </div>
              </div>
              <div className="text-right">
                <div 
                  className={`${isMobile ? 'text-sm' : ''} font-semibold`}
                  style={{ color: '#0C2C45' }}
                >
                  {formatCurrencyWithDecimals(resultado.detalhamento.custas.valor)}
                </div>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-xs'} italic`}
                  style={{ 
                    color: '#476D9E',
                    fontSize: isMobile ? '10px' : undefined
                  }}
                >
                  "{numeroParaExtenso(resultado.detalhamento.custas.valor)}"
                </div>
                <div 
                  className={`${isMobile ? 'text-xs' : 'text-sm'}`} 
                  style={{ color: '#D1BFA3' }}
                >
                  2%
                </div>
              </div>
            </div>

            {/* Ganho de Capital */}
            {resultado.detalhamento.ganhoCapital.valor > 0 && (
              <div 
                className={`flex justify-between items-center ${isMobile ? 'p-3' : 'p-4'} rounded-lg`} 
                style={{ background: 'rgba(209, 191, 163, 0.05)' }}
              >
                <div className="flex-1">
                  <span 
                    className={`${isMobile ? 'text-sm' : ''} font-medium`}
                    style={{ color: '#0C2C45' }}
                  >
                    Ganho de Capital
                  </span>
                  <div 
                    className={`${isMobile ? 'text-xs' : 'text-sm'}`}
                    style={{ color: '#476D9E' }}
                  >
                    15% sobre valorização
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className={`${isMobile ? 'text-sm' : ''} font-semibold`}
                    style={{ color: '#0C2C45' }}
                  >
                    {formatCurrencyWithDecimals(resultado.detalhamento.ganhoCapital.valor)}
                  </div>
                  <div 
                    className={`${isMobile ? 'text-xs' : 'text-xs'} italic`}
                    style={{ 
                      color: '#476D9E',
                      fontSize: isMobile ? '10px' : undefined
                    }}
                  >
                    "{numeroParaExtenso(resultado.detalhamento.ganhoCapital.valor)}"
                  </div>
                  <div 
                    className={`${isMobile ? 'text-xs' : 'text-sm'}`} 
                    style={{ color: '#D1BFA3' }}
                  >
                    15%
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Informações adicionais na página 1 */}
        <GlassCard>
          <h4 
            className={`${isMobile ? 'text-sm' : ''} font-semibold mb-3 text-center`}
            style={{ color: '#0C2C45' }}
          >
            📋 Resumo do Processo
          </h4>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'md:grid-cols-2 gap-4'} ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <div>
              <span style={{ color: '#476D9E' }}>Estado:</span>
              <span className="ml-2 font-medium" style={{ color: '#0C2C45' }}>{formData.estado}</span>
            </div>
            <div>
              <span style={{ color: '#476D9E' }}>Tipo de Processo:</span>
              <span className="ml-2 font-medium" style={{ color: '#0C2C45' }}>{formData.tipoProcesso}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* PÁGINA 2 - ECONOMIA HOLDING S/A E CTA */}
      <div id="results-page-2" className="space-y-8" style={{ pageBreakBefore: 'always', minHeight: '100vh' }}>
        {/* Destaque Holding S/A */}
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
                  <span style={{ color: '#476D9E' }}>Custos Cartório:</span>
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

        {/* Aviso Reforma Tributária */}
        <GlassCard className="border" style={{ borderColor: 'rgba(243, 156, 18, 0.3)' }}>
          <div className={`flex items-start gap-4 ${isMobile ? 'text-sm' : ''}`}>
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'}`}>⚠️</span>
            <div>
              <h4 
                className={`${isMobile ? 'text-sm' : ''} font-semibold mb-2`}
                style={{ color: '#0C2C45' }}
              >
                Importante: Reforma Tributária 2025
              </h4>
              <p 
                className={isMobile ? 'text-xs' : ''}
                style={{ color: '#476D9E' }}
              >
                A partir de 2025, com a reforma tributária, estes custos podem 
                chegar até o dobro do valor, a depender de cada estado. 
                <strong style={{ color: '#0C2C45' }}> Planeje-se agora!</strong>
              </p>
            </div>
          </div>
        </GlassCard>

        {/* CTA Final */}
        <GlassCard premium={true} className="text-center">
          <div className="mb-6">
            <h3 
              className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold mb-2`}
              style={{ color: '#D1BFA3' }}
            >
              ISENTE O PROCESSO DE INVENTÁRIO
            </h3>
            <p 
              className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}
              style={{ color: '#0C2C45' }}
            >
              FALE COM UM ESPECIALISTA
            </p>
          </div>
          
          <button
            className={`luxury-btn-primary ${isMobile ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'} font-semibold touchable`}
            style={{
              background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1, #D1BFA3)',
              color: '#0C2C45',
              border: 'none',
              borderRadius: '12px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(209, 191, 163, 0.4)',
              minHeight: isMobile ? '48px' : 'auto',
              width: isMobile ? '100%' : 'auto',
              maxWidth: isMobile ? '100%' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(209, 191, 163, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(209, 191, 163, 0.4)';
            }}
          >
            📞 Agendar Consulta Gratuita
          </button>
          
          <p 
            className={`${isMobile ? 'text-xs' : 'text-sm'} mt-4`}
            style={{ color: '#476D9E' }}
          >
            Consultoria especializada em planejamento sucessório e holding familiar
          </p>
        </GlassCard>
      </div>
    </div>
  );
};

export default ResultsSimplified;
