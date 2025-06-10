
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import ResultsHeader from '../components/ResultsHeader';
import ResultsBreakdown from '../components/ResultsBreakdown';
import ResultsCharts from '../components/ResultsCharts';
import ResultsComparison from '../components/ResultsComparison';
import ResultsInsights from '../components/ResultsInsights';
import ConsultationInsight from '../components/ConsultationInsight';
import ResultsDisclaimer from '../components/ResultsDisclaimer';
import ResultsActions from '../components/ResultsActions';
import RefinamentoCalculo from '../components/RefinamentoCalculo';
import ResultadoRefinado from '../components/ResultadoRefinado';
import { calcularCustosInventario, DadosCalculoInventario } from '../utils/itcmdCalculator';
import { parseCurrencyValue } from '../utils/formatters';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  const [resultadoRefinado, setResultadoRefinado] = useState<any>(null);
  
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

  const handleRefinar = (dadosRefinados: any) => {
    const { aplicarRefinamentos } = require('../utils/itcmdCalculator');
    const refinado = aplicarRefinamentos(resultado, dadosRefinados);
    setResultadoRefinado(refinado);
  };

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
            <ResultsHeader
              custoTotal={resultado.resumo.custoTotal}
              custoTotalFormatado={resultado.resumo.custoTotalFormatado}
              percentualSobrePatrimonio={resultado.resumo.percentualSobrePatrimonio}
              tempoEstimado={resultado.resumo.tempoEstimado}
            />

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

            <ResultsBreakdown detalhamento={resultado.detalhamento} />

            {/* Breakdown Chart */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <ResultsCharts 
                detalhamento={resultado.detalhamento}
                custoTotal={resultado.resumo.custoTotal}
              />

              <ResultsComparison
                comparacao={resultado.comparacao}
                dadosCalculo={dadosCalculo}
                economiaHolding={resultado.resumo.economiaHolding}
              />
            </div>

            <ResultsInsights insights={resultado.insights} />

            <ResultsDisclaimer />

            {/* Componente de Refinamento */}
            <RefinamentoCalculo
              resultadoInicial={{
                custoTotal: resultado.resumo.custoTotal,
                patrimonio: dadosCalculo.patrimonio,
                estado: formData.estado
              }}
              onRefinar={handleRefinar}
            />

            {/* Mostrar Resultado Refinado se existir */}
            {resultadoRefinado && (
              <ResultadoRefinado
                calculoOriginal={{
                  total: resultado.resumo.custoTotal,
                  patrimonio: dadosCalculo.patrimonio
                }}
                calculoRefinado={resultadoRefinado}
              />
            )}

            <ConsultationInsight
              patrimonio={dadosCalculo.patrimonio}
              temLitigio={dadosCalculo.temLitigio}
              temMenoresIncapazes={dadosCalculo.temMenoresIncapazes}
              custoTotal={resultado.resumo.custoTotal}
            />
          </div>

          <ResultsActions 
            shareData={{
              total: resultado.resumo.custoTotal,
              patrimonio: dadosCalculo.patrimonio,
              estado: formData.estado,
              tipoProcesso: formData.tipoProcesso
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Results;
