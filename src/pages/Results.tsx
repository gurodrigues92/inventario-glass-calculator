import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import SalvarCalculoModal from '../components/SalvarCalculoModal';
import { calcularCustosInventario, DadosCalculoInventario } from '../utils/itcmdCalculator';
import { parseCurrencyValue } from '../utils/formatters';
import { useCalculoStorage } from '../hooks/useCalculoStorage';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  const [resultadoRefinado, setResultadoRefinado] = useState<any>(null);
  const [showSalvarModal, setShowSalvarModal] = useState(false);
  const [calculoSalvoId, setCalculoSalvoId] = useState<string | null>(null);
  
  const { formData, calculationType } = location.state || {};
  const { salvarCalculo, salvarRefinamento, isLoading: isSaving } = useCalculoStorage();

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

  const handleSalvarCalculo = async (dadosUsuario: { nome: string; email?: string; telefone?: string }) => {
    try {
      const dadosCalculo = {
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
        dividasEspolio: formData.dividasEspolio ? parseCurrencyValue(formData.dividasEspolio) : 0,
        custoTotal: resultado.resumo.custoTotal,
        custoItcmd: resultado.detalhamento.itcmd.valor,
        custoHonorarios: resultado.detalhamento.honorarios.valor,
        custoCustas: resultado.detalhamento.custas.valor,
        tempoEstimado: resultado.resumo.tempoEstimado,
        percentualSobrePatrimonio: resultado.resumo.percentualSobrePatrimonio,
        insights: resultado.insights,
        alertas: resultado.alertas,
        detalhamento: resultado.detalhamento,
        comparacao: resultado.comparacao
      };

      const calculoId = await salvarCalculo(dadosUsuario, dadosCalculo, calculationType || 'basica');
      setCalculoSalvoId(calculoId);
    } catch (error) {
      console.error('Erro ao salvar cálculo:', error);
    }
  };

  const handleRefinar = async (dadosRefinados: any) => {
    const { aplicarRefinamentos } = require('../utils/itcmdCalculator');
    const refinado = aplicarRefinamentos(resultado, dadosRefinados);
    setResultadoRefinado(refinado);

    // Se o cálculo já foi salvo, salvar também o refinamento
    if (calculoSalvoId) {
      try {
        await salvarRefinamento(calculoSalvoId, {
          totalRefinado: refinado.resumo.custoTotal,
          patrimonioLiquido: refinado.patrimonioLiquido,
          ajustes: refinado.ajustes,
          isencoes: refinado.isencoes,
          comparativo: refinado.comparativo,
          temLitigioRefinado: refinado.temLitigio
        });
      } catch (error) {
        console.error('Erro ao salvar refinamento:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button and Save Button */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-glass hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <Button
              onClick={() => setShowSalvarModal(true)}
              disabled={isSaving}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {calculoSalvoId ? 'Cálculo Salvo' : 'Salvar Cálculo'}
            </Button>
          </div>

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

      <SalvarCalculoModal
        isOpen={showSalvarModal}
        onClose={() => setShowSalvarModal(false)}
        onSalvar={handleSalvarCalculo}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Results;
