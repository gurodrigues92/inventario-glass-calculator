import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from './Header';
import ResultsContent from './ResultsContent';
import SalvarCalculoModal from './SalvarCalculoModal';
import { calcularCustosInventario, DadosCalculoInventario } from '../utils/itcmdCalculator';
import { parseCurrencyValue } from '../utils/formatters';
import { useCalculoStorage } from '../hooks/useCalculoStorage';

const ResultsContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultadoRefinado, setResultadoRefinado] = useState<any>(null);
  const [showSalvarModal, setShowSalvarModal] = useState(false);
  const [calculoSalvoId, setCalculoSalvoId] = useState<string | null>(null);
  
  const { formData, calculationType } = location.state || {};
  const { salvarCalculo, salvarRefinamento, isLoading: isSaving } = useCalculoStorage();

  // Preparar dados para o cálculo
  const dadosCalculo: DadosCalculoInventario = {
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
  };

  // Calcular custos usando a nova lógica
  const resultado = calcularCustosInventario(dadosCalculo);

  const handleSalvarCalculo = async (dadosUsuario: { nome: string; email?: string; telefone?: string }) => {
    try {
      // Converter percentual de string para number
      const percentualNumerico = typeof resultado.resumo.percentualSobrePatrimonio === 'string' 
        ? parseFloat(resultado.resumo.percentualSobrePatrimonio.replace('%', ''))
        : resultado.resumo.percentualSobrePatrimonio;

      const dadosParaSalvar = {
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
        custoTotal: resultado.resumo.custoTotal,
        custoItcmd: resultado.detalhamento.itcmd.valor,
        custoHonorarios: resultado.detalhamento.honorarios.valor,
        custoCustas: resultado.detalhamento.custas.valor,
        tempoEstimado: resultado.resumo.tempoEstimado,
        percentualSobrePatrimonio: percentualNumerico,
        insights: resultado.insights,
        alertas: resultado.alertas,
        detalhamento: resultado.detalhamento,
        comparacao: resultado.comparacao
      };

      const calculoId = await salvarCalculo(dadosUsuario, dadosParaSalvar, calculationType || 'basica');
      setCalculoSalvoId(calculoId);
    } catch (error) {
      console.error('Erro ao salvar cálculo:', error);
    }
  };

  const handleRefinar = async (dadosRefinados: any) => {
    const { aplicarRefinamentos } = require('../utils/itcmdCalculator');
    const refinado = aplicarRefinamentos(resultado, dadosRefinados);
    setResultadoRefinado(refinado);

    // Se o cálculo já foi salvo, salvar também o refinamento
    if (calculoSalvoId) {
      try {
        await salvarRefinamento(calculoSalvoId, {
          totalRefinado: refinado.resumo.custoTotal,
          patrimonioLiquido: refinado.patrimonioLiquido,
          ajustes: refinado.ajustes,
          isencoes: refinado.isencoes,
          comparativo: refinado.comparativo,
          temLitigioRefinado: refinado.temLitigio
        });
      } catch (error) {
        console.error('Erro ao salvar refinamento:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button and Save Button */}
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => navigate(-1)}
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

          <ResultsContent
            resultado={resultado}
            dadosCalculo={dadosCalculo}
            formData={formData}
            resultadoRefinado={resultadoRefinado}
            onRefinar={handleRefinar}
          />
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

export default ResultsContainer;
