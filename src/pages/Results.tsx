
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

const Results = () => {
  const navigate = useNavigate();
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
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button and Save Button */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-glass hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>

            <Button
              onClick={() => setShowSalvarModal(true)}
              disabled={isSaving}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-2"
            >
              <Save className="w-4 h-4 mr-2" />
              {calculoSalvoId ? 'Cálculo Salvo' : 'Salvar Cálculo'}
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12 fade-in-up">
            <h1 className="heading-lg mb-4">Resultados do Cálculo</h1>
            <p className="text-glass">
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
          <div className="mt-12 fade-in-up">
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
