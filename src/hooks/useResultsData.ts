
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { calcularCustosInventario, DadosCalculoInventario } from '../utils/itcmdCalculator';
import { parseCurrencyValue } from '../utils/formatters';

export const useResultsData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidData, setHasValidData] = useState(false);
  
  const { formData, calculationType } = location.state || {};

  useEffect(() => {
    console.log('Results page data:', { formData, calculationType });
    
    if (!formData || !formData.patrimonio || !formData.estado) {
      console.log('No valid data found, redirecting to home');
      navigate('/', { replace: true });
      return;
    }
    
    setHasValidData(true);
    setIsLoading(false);
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
    dividasEspolio: formData.dividasEspolio ? parseCurrencyValue(formData.dividasEspolio) : 0
  } : {} as DadosCalculoInventario;

  const resultado = hasValidData ? calcularCustosInventario(dadosCalculo) : null;

  return {
    isLoading,
    hasValidData,
    formData,
    calculationType,
    dadosCalculo,
    resultado
  };
};
