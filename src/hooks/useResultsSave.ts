
import { useState } from 'react';
import { useCalculoStorage } from './useCalculoStorage';
import { parseCurrencyValue } from '../utils/formatters';

export const useResultsSave = (resultado: any, formData: any, calculationType: string) => {
  const [calculoSalvoId, setCalculoSalvoId] = useState<string | null>(null);
  const { salvarCalculo, salvarRefinamento, isLoading: isSaving } = useCalculoStorage();

  const handleSalvarCalculo = async (dadosUsuario: { nome: string; email?: string; telefone?: string }) => {
    if (!resultado || !formData) return;

    try {
      const percentualNumerico = typeof resultado.resumo.percentualSobrePatrimonio === 'string' 
        ? parseFloat(resultado.resumo.percentualSobrePatrimonio.replace('%', ''))
        : resultado.resumo.percentualSobrePatrimonio;

      const dadosCalculo = {
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

      const calculoId = await salvarCalculo(dadosUsuario, dadosCalculo, calculationType || 'basica');
      setCalculoSalvoId(calculoId);
    } catch (error) {
      console.error('Erro ao salvar cálculo:', error);
    }
  };

  const handleSalvarRefinamento = async (dadosRefinamento: any) => {
    if (!calculoSalvoId) return;

    try {
      await salvarRefinamento(calculoSalvoId, {
        totalRefinado: dadosRefinamento.resumo.custoTotal,
        patrimonioLiquido: dadosRefinamento.patrimonioLiquido,
        ajustes: dadosRefinamento.ajustes,
        isencoes: dadosRefinamento.isencoes,
        comparativo: dadosRefinamento.comparativo,
        temLitigioRefinado: dadosRefinamento.temLitigio
      });
    } catch (error) {
      console.error('Erro ao salvar refinamento:', error);
    }
  };

  return {
    calculoSalvoId,
    isSaving,
    handleSalvarCalculo,
    handleSalvarRefinamento
  };
};
