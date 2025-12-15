import React, { useState, useRef, useEffect } from 'react';
import { DadosCalculoInventario } from '../utils/itcmdCalculator';
import { useIsMobile } from '../hooks/use-mobile';
import { calcularHoldingLTDA } from '../utils/calculators/holdingLTDACalculator';
import CostSummaryCard from './results/CostSummaryCard';
import CostBreakdownCard from './results/CostBreakdownCard';
import ProcessSummaryCard from './results/ProcessSummaryCard';
import HoldingLTDACard from './results/HoldingLTDACard';
import HoldingBenefitsCard from './results/HoldingBenefitsCard';
import TaxReformWarningCard from './results/TaxReformWarningCard';
import CTACard from './results/CTACard';
import RevealButton from './results/RevealButton';
import ComparisonSection from './results/ComparisonSection';
import { Lightbulb, Sparkles, BarChart3 } from 'lucide-react';

interface ResultsSimplifiedProps {
  resultado: any;
  dadosCalculo: DadosCalculoInventario;
  formData: any;
}

const ResultsSimplified = ({ resultado, dadosCalculo, formData }: ResultsSimplifiedProps) => {
  const isMobile = useIsMobile();
  const [etapaVisivel, setEtapaVisivel] = useState(1);
  
  // Refs para scroll
  const etapa2Ref = useRef<HTMLDivElement>(null);
  const etapa3Ref = useRef<HTMLDivElement>(null);
  const etapa4Ref = useRef<HTMLDivElement>(null);

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

  // Scroll suave para a próxima etapa
  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRevealEtapa2 = () => {
    setEtapaVisivel(2);
    scrollToRef(etapa2Ref);
  };

  const handleRevealEtapa3 = () => {
    setEtapaVisivel(3);
    scrollToRef(etapa3Ref);
  };

  const handleRevealEtapa4 = () => {
    setEtapaVisivel(4);
    scrollToRef(etapa4Ref);
  };

  return (
    <div className={`space-y-8 ${isMobile ? 'mobile-results-content' : ''}`} id="results-content">
      {/* ETAPA 1 - PESSOA FÍSICA (sempre visível) */}
      <div id="results-etapa-1" className="space-y-8">
        <CostSummaryCard resultado={resultado} dadosCalculo={dadosCalculo} />
        <CostBreakdownCard resultado={resultado} formData={formData} />
        <ProcessSummaryCard formData={formData} />
        
        {/* Botão 1: Descobrir como economizar */}
        {etapaVisivel === 1 && (
          <RevealButton
            title="Possibilidade de redução de custo"
            subtitle="Conheça uma estratégia que pode reduzir significativamente os custos do inventário"
            onClick={handleRevealEtapa2}
            variant="primary"
            icon={<Lightbulb className="w-6 h-6" style={{ color: '#D1BFA3' }} />}
          />
        )}
      </div>

      {/* ETAPA 2 - HOLDING LTDA */}
      {etapaVisivel >= 2 && (
        <div ref={etapa2Ref} id="results-etapa-2" className="space-y-8 pt-4">
          <HoldingLTDACard 
            resultadoLTDA={resultadoLTDA}
            custoTotalPF={custoTotalPF}
            patrimonio={dadosCalculo.patrimonio}
          />
          
          {/* Botão 2: Ver opção mais eficiente */}
          {etapaVisivel === 2 && (
            <RevealButton
              title="Ver opção mais eficiente e econômica"
              subtitle="Existe uma estrutura que pode eliminar completamente alguns tributos"
              highlight="ZERA o ITCMD completamente"
              onClick={handleRevealEtapa3}
              variant="success"
              icon={<Sparkles className="w-6 h-6" style={{ color: '#27AE60' }} />}
            />
          )}
        </div>
      )}

      {/* ETAPA 3 - HOLDING S/A */}
      {etapaVisivel >= 3 && (
        <div ref={etapa3Ref} id="results-etapa-3" className="space-y-8 pt-4">
          <HoldingBenefitsCard 
            resultado={resultado} 
            dadosCalculo={dadosCalculo} 
            economiaPercentual={economiaPercentual} 
          />
          <TaxReformWarningCard />
          
          {/* Botão 3: Ver comparativo */}
          {etapaVisivel === 3 && (
            <RevealButton
              title="Ver o comparativo"
              subtitle="Compare as 3 opções lado a lado com gráfico visual"
              onClick={handleRevealEtapa4}
              variant="premium"
              icon={<BarChart3 className="w-6 h-6" style={{ color: '#D1BFA3' }} />}
            />
          )}
        </div>
      )}

      {/* ETAPA 4 - COMPARATIVO */}
      {etapaVisivel >= 4 && (
        <div ref={etapa4Ref} id="results-etapa-4" className="space-y-8 pt-4">
          <ComparisonSection
            custoTotalPF={custoTotalPF}
            custoTotalLTDA={resultadoLTDA.total}
            custoTotalSA={custoTotalSA}
            patrimonio={dadosCalculo.patrimonio}
          />
          <CTACard />
        </div>
      )}
    </div>
  );
};

export default ResultsSimplified;
