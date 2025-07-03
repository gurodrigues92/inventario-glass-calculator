import React from 'react';
import { DadosCalculoInventario } from '../utils/itcmdCalculator';
import { useIsMobile } from '../hooks/use-mobile';
import CostSummaryCard from './results/CostSummaryCard';
import CostBreakdownCard from './results/CostBreakdownCard';
import ProcessSummaryCard from './results/ProcessSummaryCard';
import HoldingBenefitsCard from './results/HoldingBenefitsCard';
import TaxReformWarningCard from './results/TaxReformWarningCard';
import CTACard from './results/CTACard';

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

  return (
    <div className={`space-y-8 ${isMobile ? 'mobile-results-content' : ''}`} id="results-content">
      {/* PÁGINA 1 - CUSTOS E DETALHAMENTO */}
      <div id="results-page-1" className="space-y-8" style={{ pageBreakAfter: 'always', minHeight: '100vh' }}>
        <CostSummaryCard resultado={resultado} dadosCalculo={dadosCalculo} />
        <CostBreakdownCard resultado={resultado} formData={formData} />
        <ProcessSummaryCard formData={formData} />
      </div>

      {/* PÁGINA 2 - ECONOMIA HOLDING S/A E CTA */}
      <div id="results-page-2" className="space-y-8" style={{ pageBreakBefore: 'always', minHeight: '100vh' }}>
        <HoldingBenefitsCard 
          resultado={resultado} 
          dadosCalculo={dadosCalculo} 
          economiaPercentual={economiaPercentual} 
        />
        <TaxReformWarningCard />
        <CTACard />
      </div>
    </div>
  );
};

export default ResultsSimplified;
