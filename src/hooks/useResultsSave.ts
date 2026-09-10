import { useState, useEffect, useRef } from 'react';
import { invocarEdge } from '@/lib/edge';
import { useAuth } from '@/contexts/AuthContext';
import { useDiagnostico } from '@/contexts/DiagnosticoContext';
import { parseCurrencyValue } from '../utils/formatters';
import type { ResultadoCalculo } from '../utils/itcmdCalculator';
import type { ResultsFormData } from './useResultsData';
import type { DadosDiagnostico } from '@/contexts/DiagnosticoContext';

export const useResultsSave = (resultado: ResultadoCalculo | null, formData: ResultsFormData | null, calculationType: string) => {
  const { user } = useAuth();
  const { dados: dadosDiagnostico } = useDiagnostico();
  const diagnostico = dadosDiagnostico as DadosDiagnostico;
  const [calculoSalvoId, setCalculoSalvoId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveAttempted = useRef(false);

  // Auto-save quando resultado estiver disponível
  useEffect(() => {
    const autoSaveCalculo = async () => {
      // Evitar múltiplas tentativas de save
      if (!resultado || !formData || calculoSalvoId || isSaving || saveAttempted.current) {
        return;
      }

      saveAttempted.current = true;
      setIsSaving(true);

      try {
        const percentualNumerico = typeof resultado.resumo.percentualSobrePatrimonio === 'string' 
          ? parseFloat(resultado.resumo.percentualSobrePatrimonio.replace('%', ''))
          : resultado.resumo.percentualSobrePatrimonio;

        const dadosCalculo = {
          patrimonio: parseCurrencyValue(formData.patrimonio),
          estado: formData.estado,
          tipo_processo: formData.tipoProcesso,
          numero_herdeiros: parseInt(formData.herdeiros) || 1,
          tem_testamento: formData.temTestamento || false,
          tem_menores_incapazes: formData.temMenoresIncapazes || false,
          tem_litigio: formData.temLitigio || false,
          valor_imoveis: formData.valorImoveis ? parseCurrencyValue(formData.valorImoveis) : 0,
          valor_veiculos: formData.valorVeiculos ? parseCurrencyValue(formData.valorVeiculos) : 0,
          valor_investimentos: formData.valorInvestimentos ? parseCurrencyValue(formData.valorInvestimentos) : 0,
          valor_outros_bens: formData.valorOutrosBens ? parseCurrencyValue(formData.valorOutrosBens) : 0,
          dividas_espolio: formData.dividasEspolio ? parseCurrencyValue(formData.dividasEspolio) : 0,
          custo_total: resultado.resumo.custoTotal,
          custo_itcmd: resultado.detalhamento.itcmd.valor,
          custo_honorarios: resultado.detalhamento.honorarios.valor,
          custo_custas: resultado.detalhamento.custas?.valor || 0,
          tempo_estimado: resultado.resumo.tempoEstimado,
          percentual_sobre_patrimonio: percentualNumerico,
          insights: resultado.insights,
          alertas: resultado.alertas,
          detalhamento: resultado.detalhamento,
          comparacao: resultado.comparacao
        };

        const tipoCalculadora = calculationType === 'advanced' ? 'avancada' : 'basica';

        console.log('Auto-salvando calculo...', { usuarioId: user?.id, tipoCalculadora });

        const { data } = await invocarEdge<{ success?: boolean; calculoId?: string; error?: string }>('salvar-calculo', {
          nome: user?.nome,
          email: user?.email,
          dadosCalculo,
          tipoCalculadora,
          dadosDiagnostico: diagnostico
        });

        if (data?.success) {
          console.log('Calculo auto-salvo com sucesso:', data.calculoId);
          setCalculoSalvoId(data.calculoId);
        } else {
          console.error('Falha ao salvar:', data?.error);
        }
      } catch (error) {
        console.error('Erro ao auto-salvar calculo:', error);
      } finally {
        setIsSaving(false);
      }
    };

    autoSaveCalculo();
  }, [resultado, formData, calculationType, user, calculoSalvoId, isSaving, diagnostico]);

  return {
    calculoSalvoId,
    isSaving
  };
};
