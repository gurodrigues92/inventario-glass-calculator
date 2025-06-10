
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface ResultsHeaderProps {
  custoTotal: number;
  custoTotalFormatado: string;
  percentualSobrePatrimonio: string;
  tempoEstimado: string;
}

const ResultsHeader = ({ 
  custoTotal, 
  custoTotalFormatado, 
  percentualSobrePatrimonio, 
  tempoEstimado 
}: ResultsHeaderProps) => {
  return (
    <div className="text-center mb-12 fade-in-up">
      <div className="badge-top inline-block mb-4">Resultado do Cálculo</div>
      <h1 className="heading-lg mb-4">Análise Completa dos Custos</h1>
      <div className="text-center">
        <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {custoTotalFormatado}
        </div>
        <p className="text-glass mt-2">
          Custo total estimado ({percentualSobrePatrimonio}% do patrimônio)
        </p>
        <p className="text-sm text-glass mt-1">
          ⏱️ Tempo estimado: {tempoEstimado}
        </p>
      </div>
    </div>
  );
};

export default ResultsHeader;
