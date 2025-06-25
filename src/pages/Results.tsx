
import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ResultsSimplified from '../components/ResultsSimplified';
import ResultsActions from '../components/ResultsActions';
import SalvarCalculoModal from '../components/SalvarCalculoModal';
import ResultsLoadingState from '../components/ResultsLoadingState';
import { Button } from '@/components/ui/button';
import { useResultsData } from '../hooks/useResultsData';
import { useResultsSave } from '../hooks/useResultsSave';
import { useIsMobile } from '../hooks/use-mobile';

const Results = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showSalvarModal, setShowSalvarModal] = useState(false);
  
  const { 
    isLoading, 
    hasValidData, 
    formData, 
    dadosCalculo, 
    resultado,
    loadingProgress,
    loadingMessage
  } = useResultsData();
  
  const { calculoSalvoId, isSaving, handleSalvarCalculo } = useResultsSave(
    resultado, 
    formData, 
    'simplificada'
  );

  if (isLoading || !hasValidData) {
    return (
      <ResultsLoadingState 
        progress={loadingProgress} 
        message={loadingMessage} 
      />
    );
  }

  // Preparar dados para o componente ResultsActions
  const shareData = {
    total: resultado.resumo.custoTotal,
    patrimonio: dadosCalculo.patrimonio,
    estado: formData.estado,
    tipoProcesso: formData.tipoProcesso
  };

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className={`pb-12 ${isMobile ? 'pt-20 px-4' : 'pt-24 px-6'}`}>
        <div className={`mx-auto ${isMobile ? 'max-w-sm' : 'max-w-4xl'}`}>
          {/* Back Button and Save Button - Responsivo */}
          <div className={`results-header mb-6 md:mb-8 ${isMobile ? 'flex-col space-y-4' : 'flex justify-between items-center'}`}>
            <button 
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 text-glass hover:text-white transition-colors ${isMobile ? 'self-start' : ''}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <Button
              onClick={() => setShowSalvarModal(true)}
              disabled={isSaving}
              className={`bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white ${isMobile ? 'w-full py-3' : 'px-6 py-2'}`}
            >
              <Save className="w-4 h-4 mr-2" />
              {calculoSalvoId ? 'Cálculo Salvo' : 'Salvar Cálculo'}
            </Button>
          </div>

          {/* Header - Responsivo */}
          <div className={`text-center fade-in-up ${isMobile ? 'mb-8' : 'mb-12'}`}>
            <h1 className={`font-bold mb-4 ${isMobile ? 'text-2xl' : 'text-4xl'}`} style={{ color: '#0C2C45' }}>
              Resultados do Cálculo
            </h1>
            <p className={`text-glass ${isMobile ? 'text-sm px-4' : 'text-base'}`}>
              Análise completa dos custos do seu inventário
            </p>
          </div>

          {/* Results Content */}
          <div className="fade-in-up">
            <ResultsSimplified
              resultado={resultado}
              dadosCalculo={dadosCalculo}
              formData={formData}
            />
          </div>

          {/* Actions Section - Download PDF and New Consultation */}
          <div className={`fade-in-up ${isMobile ? 'mt-8' : 'mt-12'}`}>
            <ResultsActions shareData={shareData} />
          </div>
        </div>
      </main>

      <SalvarCalculoModal
        isOpen={showSalvarModal}
        onClose={() => setShowSalvarModal(false)}
        onSalvar={handleSalvarCalculo}
        isLoading={isSaving}
      />
    </div>
  );
};

export default Results;
