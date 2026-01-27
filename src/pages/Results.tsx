import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ResultsSimplified from '../components/ResultsSimplified';
import ResultsActions from '../components/ResultsActions';
import ResultsLoadingState from '../components/ResultsLoadingState';
import { useResultsData } from '../hooks/useResultsData';
import { useResultsSave } from '../hooks/useResultsSave';
import { useIsMobile } from '../hooks/use-mobile';

const Results = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const { 
    isLoading, 
    hasValidData, 
    formData, 
    dadosCalculo, 
    resultado,
    loadingProgress,
    loadingMessage
  } = useResultsData();
  
  // Auto-save acontece automaticamente dentro do hook
  const { calculoSalvoId, isSaving } = useResultsSave(
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
      
      <main className={`pb-12 ${isMobile ? 'pt-28 px-4' : 'pt-36 px-6'}`}>
        <div className={`mx-auto ${isMobile ? 'max-w-sm' : 'max-w-4xl'}`}>
          {/* Back Button - Só botão voltar agora */}
          <div className={`results-header mb-6 md:mb-8 ${isMobile ? 'flex-col space-y-4' : 'flex justify-start items-center'}`}>
            <button 
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 text-glass hover:text-white transition-colors ${isMobile ? 'self-start' : ''}`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
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

          {/* Actions Section - Agora só com PDF e Nova Consulta */}
          <div className={`fade-in-up ${isMobile ? 'mt-8' : 'mt-12'}`}>
            <ResultsActions 
              shareData={shareData}
              isSaving={isSaving}
              calculoSalvoId={calculoSalvoId}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
