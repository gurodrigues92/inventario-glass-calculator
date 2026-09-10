
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { ResultadoCalculo, ResultadoRefinado } from '../utils/types/calculator';

interface DadosUsuario {
  nome: string;
}

interface DadosCalculo {
  patrimonio: number;
  estado: string;
  tipoProcesso: string;
  numeroHerdeiros: number;
  temTestamento: boolean;
  temMenoresIncapazes: boolean;
  temLitigio: boolean;
  valorImoveis?: number;
  valorVeiculos?: number;
  valorInvestimentos?: number;
  valorOutrosBens?: number;
  dividasEspolio?: number;
  custoTotal: number;
  custoItcmd: number;
  custoHonorarios: number;
  custoCustas: number;
  tempoEstimado?: string;
  percentualSobrePatrimonio?: number;
  insights?: ResultadoCalculo['insights'];
  alertas?: ResultadoCalculo['alertas'];
  detalhamento?: ResultadoCalculo['detalhamento'];
  comparacao?: ResultadoCalculo['comparacao'];
}

export const useCalculoStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const salvarCalculo = async (
    dadosUsuario: DadosUsuario,
    dadosCalculo: DadosCalculo,
    tipoCalculadora: 'basica' | 'avancada' = 'basica'
  ) => {
    setIsLoading(true);
    
    try {
      let profileId: string;

      // Se usuário está logado, buscar ou criar profile vinculado
      if (user?.id) {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('usuario_id', user.id)
          .maybeSingle();

        if (existingProfile) {
          profileId = existingProfile.id;
        } else {
          // Criar novo profile vinculado ao usuário logado
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert({
              nome: dadosUsuario.nome || user.nome,
              email: user.email,
              usuario_id: user.id
            })
            .select('id')
            .single();
          
          if (profileError) throw profileError;
          profileId = newProfile.id;
        }
      } else {
        // Usuário não logado - criar profile anônimo
        const { data: newProfile, error: profileError } = await supabase
          .from('profiles')
          .insert({
            nome: dadosUsuario.nome
          })
          .select('id')
          .single();
        
        if (profileError) throw profileError;
        profileId = newProfile.id;
      }

      // Salvar o cálculo
      const { data: calculo, error: calculoError } = await supabase
        .from('calculos_inventario')
        .insert({
          profile_id: profileId,
          patrimonio: dadosCalculo.patrimonio,
          estado: dadosCalculo.estado,
          tipo_processo: dadosCalculo.tipoProcesso,
          numero_herdeiros: dadosCalculo.numeroHerdeiros,
          tem_testamento: dadosCalculo.temTestamento,
          tem_menores_incapazes: dadosCalculo.temMenoresIncapazes,
          tem_litigio: dadosCalculo.temLitigio,
          valor_imoveis: dadosCalculo.valorImoveis || 0,
          valor_veiculos: dadosCalculo.valorVeiculos || 0,
          valor_investimentos: dadosCalculo.valorInvestimentos || 0,
          valor_outros_bens: dadosCalculo.valorOutrosBens || 0,
          dividas_espolio: dadosCalculo.dividasEspolio || 0,
          custo_total: dadosCalculo.custoTotal,
          custo_itcmd: dadosCalculo.custoItcmd,
          custo_honorarios: dadosCalculo.custoHonorarios,
          custo_custas: dadosCalculo.custoCustas,
          tempo_estimado: dadosCalculo.tempoEstimado,
          percentual_sobre_patrimonio: dadosCalculo.percentualSobrePatrimonio,
          insights: dadosCalculo.insights,
          alertas: dadosCalculo.alertas,
          detalhamento: dadosCalculo.detalhamento,
          comparacao: dadosCalculo.comparacao
        })
        .select('id')
        .single();

      if (calculoError) throw calculoError;

      // Registrar no histórico
      await supabase
        .from('historico_consultas')
        .insert({
          profile_id: profileId,
          tipo_calculadora: tipoCalculadora,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      toast.success('Cálculo salvo com sucesso!');
      return calculo.id;
      
    } catch (error) {
      console.error('Erro ao salvar cálculo:', error);
      toast.error('Erro ao salvar o cálculo. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const salvarRefinamento = async (calculoOriginalId: string, dadosRefinados: ResultadoRefinado) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('calculos_refinados')
        .insert({
          calculo_original_id: calculoOriginalId,
          total_refinado: dadosRefinados.totalRefinado,
          patrimonio_liquido: dadosRefinados.patrimonioLiquido,
          ajustes: dadosRefinados.ajustes,
          isencoes: dadosRefinados.isencoes,
          comparativo: dadosRefinados.comparativo,
          tem_litigio_refinado: dadosRefinados.temLitigio
        })
        .select('id')
        .single();

      if (error) throw error;
      
      toast.success('Refinamento salvo com sucesso!');
      return data.id;
      
    } catch (error) {
      console.error('Erro ao salvar refinamento:', error);
      toast.error('Erro ao salvar o refinamento. Tente novamente.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    salvarCalculo,
    salvarRefinamento,
    isLoading
  };
};
