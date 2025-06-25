
import React from 'react';

interface EmptyStateProps {
  hasCalculos: boolean;
  hasSearchTerm: boolean;
}

const EmptyState = ({ hasCalculos, hasSearchTerm }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-[#476D9E] text-lg">
        {!hasCalculos 
          ? 'Nenhum cálculo salvo encontrado.'
          : hasSearchTerm 
            ? 'Nenhum resultado encontrado para sua busca.'
            : 'Nenhum cálculo encontrado.'
        }
      </p>
    </div>
  );
};

export default EmptyState;
