
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calcularCustosInventario, DadosCalculoInventario } from '../utils/itcmdCalculator';
import { parseCurrencyValue } from '../utils/formatters';

interface LoadingStep {
  message: string;
  progress: number;
}

const LOADING_STEPS: LoadingStep[] = [
  { message: 'Analisando patrimônio...', progress: 25 },
  { message: 'Calculando ITCMD...', progress: 50 },
  { message: 'Computando honorários advocatícios...', progress: 75 },
  { message: 'Finalizando relatório...', progress: 100 }
];

export const useResultsData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { formData, calculationType } = location.state || {};

  useEffect(() => {
    console.log('Results page data:', { formData, calculationType });
    
    if (!formData || !formData.patrimonio || !formData.estado) {
      console.log('No valid data found, redirecting to home');
      navigate('/', { replace: true });
      return;
    }
    
    setHasValidData(true);
    
    // Simular loading com etapas
    let currentStep = 0;
    const stepDuration = 750; // 750ms por etapa = 3 segundos total
    
    const simulateLoading = () => {
      const interval = setInterval(() => {
        if (currentStep < LOADING_STEPS.length) {
          setLoadingStep(currentStep);
          setLoadingProgress(LOADING_STEPS[currentStep].progress);
          currentStep++;
        } else {
          clearInterval(interval);
          setIsLoading(false);
        }
      }, stepDuration);
      
      return interval;
    };
    
    const loadingInterval = simulateLoading();
    
    return () => clearInterval(loadingInterval);
  }, [formData, navigate]);

  const dadosCalculo: DadosCalculoInventario = formData ? {
    patrimonio: parseCurrencyValue(formData.patrimonio),
    estado: formData.estado,
    tipoProcesso: formData.tipoProcesso,
    numeroHerdeiros: parseInt(formData.herdeiros) || 1,
    temTestamento: formData.temTestamento || false,
    temMenoresIncapazes: formData.temMenoresIncapazes || false,
    temLitigio: formData.temLitigio || false,
    valorImoveis: formData.valorImoveis ? parseCurrencyValue(formData.valorImoveis) : 0,
    valorVeiculos: formData.valorVeiculos ? parseCurrencyValue(formData.valorVeiculos) : 0,
    valorInvestimentos: formData.valorInvestimentos ? parseCurrencyValue(formData.valorInvestimentos) : 0,
    valorOutrosBens: formData.valorOutrosBens ? parseCurrencyValue(formData.valorOutrosBens) : 0,
    dividasEspolio: formData.dividasEspolio ? parseCurrencyValue(formData.dividasEspolio) : 0,
    patrimonioHistoricoIR: formData.patrimonioHistoricoIR ? parseCurrencyValue(formData.patrimonioHistoricoIR) : undefined,
    patrimonioAtualMercado: formData.patrimonioAtualMercado ? parseCurrencyValue(formData.patrimonioAtualMercado) : parseCurrencyValue(formData.patrimonio)
  } : {} as DadosCalculoInventario;

  const resultado = hasValidData && !isLoading ? calcularCustosInventario(dadosCalculo) : null;

  const getCurrentLoadingMessage = () => {
    if (loadingStep < LOADING_STEPS.length) {
      return LOADING_STEPS[loadingStep].message;
    }
    return 'Finalizando...';
  };

  return {
    isLoading,
    hasValidData,
    formData,
    calculationType,
    dadosCalculo,
    resultado,
    loadingProgress,
    loadingMessage: getCurrentLoadingMessage()
  };
};
