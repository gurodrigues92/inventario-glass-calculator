
import React from 'react';
import GlassCard from './GlassCard';
import { formatCurrency } from '../utils/formatters';

interface CTAEspecialistaProps {
  patrimonio: number;
  custoTotal: number;
  temComplexidade: boolean;
}

const CTAEspecialista = ({ patrimonio, custoTotal, temComplexidade }: CTAEspecialistaProps) => {
  const economiaEstimada = custoTotal * 0.3; // 30% de economia potencial

  return (
    <div className="mb-8">
      <GlassCard className="border-2 border-gradient-to-r from-purple-500/50 to-green-500/50 bg-gradient-to-br from-purple-500/10 to-green-500/10 text-center">
        {temComplexidade && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              ⚠️ Com um patrimônio de {formatCurrency(patrimonio)} e complexidades envolvidas, 
              é essencial consultar um especialista em planejamento sucessório para reduzir 
              riscos e economizar centenas de milhares de reais.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            ISENTE O PROCESSO DE INVENTÁRIO
          </h2>
          <p className="text-xl text-green-400 font-semibold">
            FALE COM UM ESPECIALISTA
          </p>
        </div>

        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-300 mb-2">Economia potencial estimada:</p>
          <div className="text-3xl font-bold text-green-400">
            {formatCurrency(economiaEstimada)}
          </div>
        </div>

        <div className="space-y-3">
          <button 
            className="w-full bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            disabled
          >
            📅 Agendar Sessão com Especialista
          </button>
          
          <p className="text-xs text-glass">
            Em breve disponibilizaremos este serviço personalizado
          </p>
        </div>

        <div className="mt-6 text-left">
          <h4 className="text-white font-semibold mb-3">O que você receberá:</h4>
          <ul className="space-y-2 text-sm text-glass">
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Análise detalhada do seu patrimônio</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Estratégias personalizadas de economia</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Plano de ação para implementação</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Suporte jurídico especializado</span>
            </li>
          </ul>
        </div>
      </GlassCard>
    </div>
  );
};

export default CTAEspecialista;
