
import React from 'react';
import ResultsPageLayout from './ResultsPageLayout';

const ResultsLoadingState = () => {
  return (
    <ResultsPageLayout>
      <div className="text-center">
        <div className="text-white">Carregando resultados...</div>
      </div>
    </ResultsPageLayout>
  );
};

export default ResultsLoadingState;
