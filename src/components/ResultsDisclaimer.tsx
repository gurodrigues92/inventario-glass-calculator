
import React from 'react';
import GlassCard from './GlassCard';

const ResultsDisclaimer = () => {
  return (
    <GlassCard className="mb-12 fade-in-up stagger-4">
      <div className="text-center">
        <h3 className="font-semibold text-yellow-400 mb-2">⚠️ Importante</h3>
        <p className="text-sm text-glass">
          Este cálculo é uma estimativa baseada em valores médios e legislação atual de 2025. 
          Os valores reais podem variar conforme particularidades do caso. 
          Recomendamos consultar um advogado especialista para orientação personalizada.
        </p>
      </div>
    </GlassCard>
  );
};

export default ResultsDisclaimer;
