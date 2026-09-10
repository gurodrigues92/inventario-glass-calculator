import React from 'react';
import { DadosCalculoInventario, ResultadoCalculo } from '../utils/itcmdCalculator';
import { useIsMobile } from '../hooks/use-mobile';
import type { ResultsFormData } from '../hooks/useResultsData';
import { calcularHoldingLTDA } from '../utils/calculators/holdingLTDACalculator';
import CostSummaryCard from './results/CostSummaryCard';
import CostBreakdownCard from './results/CostBreakdownCard';
import ProcessSummaryCard from './results/ProcessSummaryCard';
import HoldingLTDACard from './results/HoldingLTDACard';
import HoldingBenefitsCard from './results/HoldingBenefitsCard';
import TaxReformWarningCard from './results/TaxReformWarningCard';
import CTACard from './results/CTACard';
import ComparisonSection from './results/ComparisonSection';

interface ResultsSimplifiedProps {
  resultado: ResultadoCalculo;
  dadosCalculo: DadosCalculoInventario;
  formData: ResultsFormData;
}

const ResultsSimplified = ({ resultado, dadosCalculo, formData }: ResultsSimplifiedProps) => {
  const isMobile = useIsMobile();

  // Calcular custos de cada cenário
  const custoTotalPF = resultado.resumo.custoTotal;
  
  // Calcular Holding LTDA
  const resultadoLTDA = calcularHoldingLTDA(
    dadosCalculo.patrimonio,
    dadosCalculo.estado,
    dadosCalculo.patrimonioHistoricoIR,
    dadosCalculo.patrimonioAtualMercado
  );
  
  // Holding S/A
  const custoTotalSA = dadosCalculo.patrimonio * 0.015; // 1,5% honorários
  
  const economiaPercentual = resultado.resumo.economiaHolding && resultado.resumo.custoTotal > 0 
    ? ((resultado.resumo.economiaHolding / resultado.resumo.custoTotal) * 100).toFixed(0)
    : '0';

  return (
    <div className={`space-y-8 ${isMobile ? 'mobile-results-content' : ''}`} id="results-content">
      {/* Pessoa Física */}
      <CostSummaryCard resultado={resultado} dadosCalculo={dadosCalculo} />
      <CostBreakdownCard resultado={resultado} formData={formData} />
      <ProcessSummaryCard formData={formData} />

      {/* Holding LTDA */}
      <HoldingLTDACard 
        resultadoLTDA={resultadoLTDA}
        custoTotalPF={custoTotalPF}
        patrimonio={dadosCalculo.patrimonio}
      />

      {/* Holding S/A */}
      <HoldingBenefitsCard 
        resultado={resultado} 
        dadosCalculo={dadosCalculo} 
        economiaPercentual={economiaPercentual} 
      />
      <TaxReformWarningCard />

      {/* Gráfico Comparativo */}
      <ComparisonSection
        custoTotalPF={custoTotalPF}
        custoTotalLTDA={resultadoLTDA.total}
        custoTotalSA={custoTotalSA}
        patrimonio={dadosCalculo.patrimonio}
      />

      {/* CTA */}
      <CTACard />
    </div>
  );
};

export default ResultsSimplified;
