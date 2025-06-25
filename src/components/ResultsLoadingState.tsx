
import React from 'react';
import ResultsPageLayout from './ResultsPageLayout';
import LoadingCalculator from './LoadingCalculator';

interface ResultsLoadingStateProps {
  progress?: number;
  message?: string;
}

const ResultsLoadingState = ({ 
  progress = 0, 
  message = 'Carregando resultados...' 
}: ResultsLoadingStateProps) => {
  return (
    <ResultsPageLayout>
      <LoadingCalculator progress={progress} message={message} />
    </ResultsPageLayout>
  );
};

export default ResultsLoadingState;
