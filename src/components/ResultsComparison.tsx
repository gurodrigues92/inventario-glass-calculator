
import React from 'react';
import GlassCard from './GlassCard';
import ComparisonCard from './ComparisonCard';
import { ComparacaoProcesso } from '../utils/itcmdCalculator';
import { DadosCalculoInventario } from '../utils/itcmdCalculator';

interface ResultsComparisonProps {
  comparacao: {
    judicial: ComparacaoProcesso;
    extrajudicial: ComparacaoProcesso;
    holding: ComparacaoProcesso;
  };
  dadosCalculo: DadosCalculoInventario;
  economiaHolding: number;
}

const ResultsComparison = ({ comparacao, dadosCalculo, economiaHolding }: ResultsComparisonProps) => {
  return (
    <GlassCard className="fade-in-up stagger-3">
      <h3 className="heading-md mb-6">Comparação de Processos</h3>
      <div className="space-y-4">
        <ComparisonCard
          tipo="Extrajudicial"
          custo={comparacao.extrajudicial.custo}
          tempo={comparacao.extrajudicial.tempo}
          destaque={dadosCalculo.tipoProcesso === 'extrajudicial'}
          economia={dadosCalculo.tipoProcesso === 'judicial' ? 
            comparacao.judicial.custo - comparacao.extrajudicial.custo : 0}
        />
        
        <ComparisonCard
          tipo="Judicial"
          custo={comparacao.judicial.custo}
          tempo={comparacao.judicial.tempo}
          destaque={dadosCalculo.tipoProcesso === 'judicial'}
        />
        
        {economiaHolding > 50000 && (
          <ComparisonCard
            tipo="Holding Familiar"
            custo={comparacao.holding.custo}
            tempo={comparacao.holding.tempo}
            economia={economiaHolding}
            especial={true}
          />
        )}
      </div>
    </GlassCard>
  );
};

export default ResultsComparison;
