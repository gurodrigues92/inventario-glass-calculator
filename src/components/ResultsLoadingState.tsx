
import React from 'react';
import LoadingLayout from './LoadingLayout';
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
    <LoadingLayout>
      <LoadingCalculator progress={progress} message={message} />
    </LoadingLayout>
  );
};

export default ResultsLoadingState;
