
import React from 'react';
import ResultsHeader from './ResultsHeader';
import ResultsBreakdown from './ResultsBreakdown';
import ResultsCharts from './ResultsCharts';
import ResultsComparison from './ResultsComparison';
import ResultsInsights from './ResultsInsights';
import ConsultationInsight from './ConsultationInsight';
import ResultsDisclaimer from './ResultsDisclaimer';
import ResultsActions from './ResultsActions';
import RefinamentoCalculo from './RefinamentoCalculo';
import ResultadoRefinado from './ResultadoRefinado';
import { DadosCalculoInventario } from '../utils/itcmdCalculator';

interface ResultsContentProps {
  resultado: any;
  dadosCalculo: DadosCalculoInventario;
  formData: any;
  resultadoRefinado: any;
  onRefinar: (dadosRefinados: any) => void;
}

const ResultsContent = ({ 
  resultado, 
  dadosCalculo, 
  formData, 
  resultadoRefinado, 
  onRefinar 
}: ResultsContentProps) => {
  return (
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
        onRefinar={onRefinar}
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

      <ResultsActions 
        shareData={{
          total: resultado.resumo.custoTotal,
          patrimonio: dadosCalculo.patrimonio,
          estado: formData.estado,
          tipoProcesso: formData.tipoProcesso
        }}
      />
    </div>
  );
};

export default ResultsContent;
