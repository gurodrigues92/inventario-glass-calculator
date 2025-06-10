
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import ShareMenu from '../components/ShareMenu';
import BreakdownCard from '../components/BreakdownCard';
import ComparisonCard from '../components/ComparisonCard';
import InsightCard from '../components/InsightCard';
import { calcularCustosInventario, DadosCalculoInventario } from '../utils/itcmdCalculator';
import { parseCurrencyValue, formatCurrency } from '../utils/formatters';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  
  const { formData, calculationType } = location.state || {};

  useEffect(() => {
    console.log('Results page data:', { formData, calculationType });
    
    if (!formData || !formData.patrimonio || !formData.estado) {
      console.log('No valid data found, redirecting to home');
      navigate('/', { replace: true });
      return;
    }
    
    setHasValidData(true);
    setIsLoading(false);
  }, [formData, navigate]);

  if (isLoading || !hasValidData) {
    return (
      <div className="min-h-screen bg-animated">
        <Header />
        <main className="pt-24 pb-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-white">Carregando resultados...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Preparar dados para o cálculo
  const dadosCalculo: DadosCalculoInventario = {
    patrimonio: parseCurrencyValue(formData.patrimonio),
    estado: formData.estado,
    tipoProcesso: formData.tipoProcesso,
    numeroHerdeiros: parseInt(formData.herdeiros) || 1,
    temTestamento: formData.temTestamento || false,
    temMenoresIncapazes: formData.temMenoresIncapazes || false,
    temLitigio: formData.temLitigio || false,
    valorImoveis: formData.valorImoveis ? parseCurrencyValue(formData.valorImoveis) : 0,
    valorVeiculos: formData.valorVeiculos ? parseCurrencyValue(formData.valorVeiculos) : 0,
    valorInvestimentos: formData.valorInvestimentos ? parseCurrencyValue(formData.valorInvestimentos) : 0,
    valorOutrosBens: formData.valorOutrosBens ? parseCurrencyValue(formData.valorOutrosBens) : 0,
    dividasEspolio: formData.dividasEspolio ? parseCurrencyValue(formData.dividasEspolio) : 0
  };

  // Calcular custos usando a nova lógica
  const resultado = calcularCustosInventario(dadosCalculo);

  const breakdownCards = [
    {
      icon: '🏛️',
      label: 'ITCMD a pagar',
      value: formatCurrency(resultado.detalhamento.itcmd.valor),
      subtitle: resultado.detalhamento.itcmd.descricao,
      color: 'purple' as const
    },
    {
      icon: '⚖️',
      label: 'Honorários advocatícios',
      value: formatCurrency(resultado.detalhamento.honorarios.valor),
      subtitle: `${resultado.detalhamento.honorarios.percentual?.toFixed(0)}% do patrimônio`,
      color: 'green' as const
    },
    {
      icon: '📋',
      label: 'Custas do processo',
      value: formatCurrency(resultado.detalhamento.custas.valor),
      subtitle: resultado.detalhamento.custas.descricao,
      color: 'blue' as const
    },
    {
      icon: '🏢',
      label: 'Cartório e Registro',
      value: formatCurrency(resultado.detalhamento.cartorio.valor),
      subtitle: resultado.detalhamento.cartorio.descricao,
      color: 'orange' as const
    }
  ];

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-glass hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <div id="results-content">
            {/* Header */}
            <div className="text-center mb-12 fade-in-up">
              <div className="badge-top inline-block mb-4">Resultado do Cálculo</div>
              <h1 className="heading-lg mb-4">Análise Completa dos Custos</h1>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {resultado.resumo.custoTotalFormatado}
                </div>
                <p className="text-glass mt-2">
                  Custo total estimado ({resultado.resumo.percentualSobrePatrimonio}% do patrimônio)
                </p>
                <p className="text-sm text-glass mt-1">
                  ⏱️ Tempo estimado: {resultado.resumo.tempoEstimado}
                </p>
              </div>
            </div>

            {/* Alertas e Validações */}
            {resultado.alertas.length > 0 && (
              <div className="mb-8">
                {resultado.alertas.map((alerta, index) => (
                  <div key={index} className={`p-4 rounded-lg mb-4 ${
                    alerta.tipo === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                    alerta.tipo === 'success' ? 'bg-green-500/10 border border-green-500/30' :
                    'bg-blue-500/10 border border-blue-500/30'
                  }`}>
                    <p className="text-white text-sm">{alerta.mensagem}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {breakdownCards.map((card, index) => (
                <BreakdownCard
                  key={index}
                  icon={card.icon}
                  label={card.label}
                  value={card.value}
                  subtitle={card.subtitle}
                  color={card.color}
                />
              ))}
            </div>

            {/* ITBI Card se houver imóveis */}
            {resultado.detalhamento.itbi.valor > 0 && (
              <div className="mb-8">
                <GlassCard>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {formatCurrency(resultado.detalhamento.itbi.valor)}
                    </div>
                    <h3 className="font-semibold text-white mb-1">ITBI sobre Imóveis</h3>
                    <p className="text-xs text-glass">{resultado.detalhamento.itbi.descricao}</p>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Breakdown Chart */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <GlassCard className="fade-in-up stagger-2">
                <h3 className="heading-md mb-6">Composição dos Custos</h3>
                <div className="space-y-4">
                  {[
                    { label: 'ITCMD', valor: resultado.detalhamento.itcmd.valor, color: 'purple-500' },
                    { label: 'Honorários', valor: resultado.detalhamento.honorarios.valor, color: 'green-500' },
                    { label: 'Custas', valor: resultado.detalhamento.custas.valor, color: 'blue-500' },
                    { label: 'Cartório', valor: resultado.detalhamento.cartorio.valor, color: 'orange-500' }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center">
                        <span className="text-glass">{item.label}</span>
                        <span className="text-white font-semibold">
                          {((item.valor / resultado.resumo.custoTotal) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`bg-${item.color} h-2 rounded-full`} 
                          style={{ width: `${(item.valor / resultado.resumo.custoTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Comparação de Processos */}
              <GlassCard className="fade-in-up stagger-3">
                <h3 className="heading-md mb-6">Comparação de Processos</h3>
                <div className="space-y-4">
                  <ComparisonCard
                    tipo="Extrajudicial"
                    custo={resultado.comparacao.extrajudicial.custo}
                    tempo={resultado.comparacao.extrajudicial.tempo}
                    destaque={dadosCalculo.tipoProcesso === 'extrajudicial'}
                    economia={dadosCalculo.tipoProcesso === 'judicial' ? 
                      resultado.comparacao.judicial.custo - resultado.comparacao.extrajudicial.custo : 0}
                  />
                  
                  <ComparisonCard
                    tipo="Judicial"
                    custo={resultado.comparacao.judicial.custo}
                    tempo={resultado.comparacao.judicial.tempo}
                    destaque={dadosCalculo.tipoProcesso === 'judicial'}
                  />
                  
                  {resultado.resumo.economiaHolding > 50000 && (
                    <ComparisonCard
                      tipo="Holding Familiar"
                      custo={resultado.comparacao.holding.custo}
                      tempo={resultado.comparacao.holding.tempo}
                      economia={resultado.resumo.economiaHolding}
                      especial={true}
                    />
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Insights Personalizados */}
            {resultado.insights.length > 0 && (
              <div className="mb-12">
                <h3 className="heading-md mb-6 text-center">💡 Insights e Recomendações</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {resultado.insights.map((insight, index) => (
                    <InsightCard
                      key={index}
                      tipo={insight.tipo}
                      titulo={insight.titulo}
                      descricao={insight.descricao}
                      valor={insight.valor}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <GlassCard className="mb-12 fade-in-up stagger-4">
              <div className="text-center">
                <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Importante</h3>
                <p className="text-sm text-glass">
                  Este cálculo é uma estimativa baseada em valores médios e legislação atual de 2025. 
                  Os valores reais podem variar conforme particularidades do caso. 
                  Recomendamos consultar um advogado especialista para orientação personalizada.
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ShareMenu 
              data={{
                total: resultado.resumo.custoTotal,
                patrimonio: dadosCalculo.patrimonio,
                estado: formData.estado,
                tipoProcesso: formData.tipoProcesso
              }}
            />
            
            <button 
              onClick={() => navigate('/')}
              className="border border-glass-border text-white px-8 py-3 rounded-lg hover:bg-glass-white transition-all"
            >
              Nova Consulta
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
