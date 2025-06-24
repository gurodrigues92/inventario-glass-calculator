
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import GlassCard from './GlassCard';
import { DadosCalculoInventario } from '../utils/itcmdCalculator';

interface ResultsSimplifiedProps {
  resultado: any;
  dadosCalculo: DadosCalculoInventario;
  formData: any;
}

const ResultsSimplified = ({ resultado, dadosCalculo, formData }: ResultsSimplifiedProps) => {
  const economiaPercentual = resultado.resumo.economiaHolding && resultado.resumo.custoTotal > 0 
    ? ((resultado.resumo.economiaHolding / resultado.resumo.custoTotal) * 100).toFixed(0)
    : '0';

  return (
    <div className="space-y-8">
      {/* Card Principal - Custo Total */}
      <GlassCard className="text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Custos Estimados do Inventário
          </h2>
          <div 
            className="text-5xl font-bold mb-2"
            style={{ color: '#FFD700' }}
          >
            {resultado.resumo.custoTotalFormatado}
          </div>
          <span 
            className="text-xl"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            {resultado.resumo.percentualSobrePatrimonio}% do patrimônio
          </span>
        </div>

        <div 
          className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            color: '#FFD700'
          }}
        >
          💰 Patrimônio: {formatCurrency(dadosCalculo.patrimonio)}
        </div>
      </GlassCard>

      {/* Detalhamento dos Custos */}
      <GlassCard>
        <h3 className="text-xl font-semibold text-white mb-6 text-center">
          Detalhamento dos Custos
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div>
              <span className="font-medium text-white">ITCMD ({formData.estado})</span>
              <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Imposto estadual sobre herança
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">
                {formatCurrency(resultado.detalhamento.itcmd.valor)}
              </div>
              <div className="text-sm" style={{ color: '#FFD700' }}>
                {resultado.detalhamento.itcmd.percentual.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div>
              <span className="font-medium text-white">Honorários Advocatícios</span>
              <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {resultado.detalhamento.honorarios.percentual}% do patrimônio
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">
                {formatCurrency(resultado.detalhamento.honorarios.valor)}
              </div>
              <div className="text-sm" style={{ color: '#FFD700' }}>
                {resultado.detalhamento.honorarios.percentual}%
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 rounded-lg" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <div>
              <span className="font-medium text-white">Custas de Cartório</span>
              <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Registro e documentação
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-white">
                {formatCurrency(resultado.detalhamento.custas.valor)}
              </div>
              <div className="text-sm" style={{ color: '#FFD700' }}>
                2%
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Destaque Holding S/A */}
      <GlassCard style={{ border: '2px solid rgba(255, 215, 0, 0.3)' }}>
        <div className="text-center mb-6">
          <div 
            className="inline-block px-6 py-2 rounded-full mb-4"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700'
            }}
          >
            💡 Economia de até {economiaPercentual}%
          </div>
          
          <h3 
            className="text-2xl font-bold mb-4"
            style={{ color: '#FFD700' }}
          >
            Com Holding Familiar S/A
          </h3>
          
          <p className="text-white mb-6 leading-relaxed">
            Com a constituição de uma Holding Familiar S/A, você pode reduzir 
            significativamente o custo sucessório — e ainda profissionalizar 
            a gestão do patrimônio.
          </p>
          
          <div 
            className="text-3xl font-bold mb-6"
            style={{ color: '#10B981' }}
          >
            Economia estimada: {formatCurrency(resultado.resumo.economiaHolding)}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">✅ Benefícios da Holding S/A</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                ITCMD: 0% sobre a diferença
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                Ganho de Capital: 0%
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                Constituição em 30 a 60 dias
              </li>
              <li className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <span style={{ color: '#10B981' }}>✓</span>
                Gestão profissional do patrimônio
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-3">💰 Custos da Holding S/A</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Honorários Constituição:</span>
                <span className="text-white font-medium">R$ 150.000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Custos Cartório:</span>
                <span className="text-white font-medium">R$ 16.000</span>
              </div>
              <div className="border-t border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-white">Total:</span>
                  <span style={{ color: '#10B981' }}>R$ 166.000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Aviso Reforma Tributária */}
      <GlassCard style={{ border: '1px solid rgba(255, 165, 0, 0.3)' }}>
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <h4 className="font-semibold text-white mb-2">
              Importante: Reforma Tributária 2025
            </h4>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              A partir de 2025, com a reforma tributária, estes custos podem 
              chegar até o dobro do valor, a depender de cada estado. 
              <strong className="text-white"> Planeje-se agora!</strong>
            </p>
          </div>
        </div>
      </GlassCard>

      {/* CTA Final */}
      <GlassCard className="text-center" style={{ border: '2px solid rgba(255, 215, 0, 0.5)' }}>
        <div className="mb-6">
          <h3 
            className="text-3xl font-bold mb-2"
            style={{ color: '#FFD700' }}
          >
            ISENTE O PROCESSO DE INVENTÁRIO
          </h3>
          <p 
            className="text-xl font-semibold"
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
            FALE COM UM ESPECIALISTA
          </p>
        </div>
        
        <button
          className="luxury-btn-primary px-8 py-4 text-lg font-semibold"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
          }}
        >
          📞 Agendar Consulta Gratuita
        </button>
        
        <p 
          className="text-sm mt-4"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          Consultoria especializada em planejamento sucessório e holding familiar
        </p>
      </GlassCard>
    </div>
  );
};

export default ResultsSimplified;
