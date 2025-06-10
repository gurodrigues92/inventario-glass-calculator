
import React from 'react';
import InsightCard from './InsightCard';
import { InsightPersonalizado } from '../utils/itcmdCalculator';

interface ResultsInsightsProps {
  insights: InsightPersonalizado[];
}

const ResultsInsights = ({ insights }: ResultsInsightsProps) => {
  if (insights.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="heading-md mb-6 text-center">💡 Insights e Recomendações</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
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
  );
};

export default ResultsInsights;
