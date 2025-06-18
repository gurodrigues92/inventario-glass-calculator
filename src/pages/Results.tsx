
import React, { useState } from 'react';
import ResultsPageLayout from '../components/ResultsPageLayout';
import ResultsPageHeader from '../components/ResultsPageHeader';
import ResultsLoadingState from '../components/ResultsLoadingState';
import ResultsContent from '../components/ResultsContent';
import SalvarCalculoModal from '../components/SalvarCalculoModal';
import ResultsActions from '../components/ResultsActions';
import { useResultsData } from '../hooks/useResultsData';
import { useResultsSave } from '../hooks/useResultsSave';

const Results = () => {
  const [resultadoRefinado, setResultadoRefinado] = useState<any>(null);
  const [showSalvarModal, setShowSalvarModal] = useState(false);
  
  const { isLoading, hasValidData, formData, dadosCalculo, resultado } = useResultsData();
  const { calculoSalvoId, isSaving, handleSalvarCalculo, handleSalvarRefinamento } = useResultsSave(
    resultado, 
    formData, 
    'basica'
  );

  if (isLoading || !hasValidData) {
    return <ResultsLoadingState />;
  }

  const handleRefinar = async (dadosRefinados: any) => {
    const { aplicarRefinamentos } = require('../utils/itcmdCalculator');
    const refinado = aplicarRefinamentos(resultado, dadosRefinados);
    setResultadoRefinado(refinado);
    await handleSalvarRefinamento(refinado);
  };

  return (
    <ResultsPageLayout>
      <ResultsPageHeader
        onSave={() => setShowSalvarModal(true)}
        isSaving={isSaving}
        calculoSalvoId={calculoSalvoId}
      />

      <ResultsContent
        resultado={resultado}
        dadosCalculo={dadosCalculo}
        formData={formData}
        resultadoRefinado={resultadoRefinado}
        onRefinar={handleRefinar}
      />

      <ResultsActions 
        shareData={{
          total: resultado.resumo.custoTotal,
          patrimonio: dadosCalculo.patrimonio,
          estado: formData.estado,
          tipoProcesso: formData.tipoProcesso
        }}
      />

      <SalvarCalculoModal
        isOpen={showSalvarModal}
        onClose={() => setShowSalvarModal(false)}
        onSalvar={handleSalvarCalculo}
        isLoading={isSaving}
      />
    </ResultsPageLayout>
  );
};

export default Results;
