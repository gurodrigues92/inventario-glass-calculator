
import React from 'react';
import GlassCard from './GlassCard';
import { formatCurrency } from '../utils/formatters';

interface CTAEspecialistaProps {
  patrimonio: number;
  custoTotal: number;
  temComplexidade: boolean;
}

const CTAEspecialista = ({ patrimonio, custoTotal, temComplexidade }: CTAEspecialistaProps) => {
  const economiaEstimada = custoTotal * 0.4; // 40% de economia potencial com planejamento

  return (
    <div className="mb-8">
      <div className="cta-section">
        {temComplexidade && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              ⚠️ <strong>Caso Complexo Identificado:</strong> Com um patrimônio de {formatCurrency(patrimonio)} e complexidades envolvidas, 
              é essencial consultar um especialista em planejamento sucessório para reduzir 
              riscos e economizar centenas de milhares de reais.
            </p>
          </div>
        )}
        
        <div className="mb-8">
          <span className="badge-premium mb-4 inline-block">
            🏆 PLANEJAMENTO SUCESSÓRIO PREMIUM
          </span>
          <h2 className="text-4xl font-bold golden-accent mb-3">
            ISENTE O PROCESSO DE INVENTÁRIO
          </h2>
          <p className="text-2xl text-white font-semibold mb-2">
            FALE COM UM ESPECIALISTA
          </p>
          <p className="text-glass text-lg">
            Transforme custos em economia com estratégias personalizadas
          </p>
        </div>

        <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
          <p className="text-green-300 mb-2 text-lg font-semibold">💰 Economia potencial estimada:</p>
          <div className="text-4xl font-bold golden-accent mb-3">
            {formatCurrency(economiaEstimada)}
          </div>
          <p className="text-sm text-green-200">
            *Baseado em casos similares com estratégias de planejamento sucessório
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="luxury-card p-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Estratégias Personalizadas
            </h4>
            <ul className="space-y-2 text-sm text-glass">
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Análise detalhada do seu patrimônio</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Holding familiar estruturada</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Doações estratégicas em vida</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Testamento otimizado</span>
              </li>
            </ul>
          </div>

          <div className="luxury-card p-6">
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <span className="text-2xl mr-2">🛡️</span>
              Proteção Patrimonial
            </h4>
            <ul className="space-y-2 text-sm text-glass">
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Blindagem contra credores</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Otimização tributária contínua</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Governança familiar</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Sucessão profissionalizada</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            className="btn-cta-premium w-full flex items-center justify-center space-x-3"
            disabled
          >
            <span className="text-2xl">📅</span>
            <span>AGENDAR CONSULTORIA ESTRATÉGICA</span>
          </button>
          
          <p className="text-xs text-glass">
            🚀 Em breve disponibilizaremos este serviço personalizado premium
          </p>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg">
            <p className="text-purple-300 text-sm text-center">
              <strong>Atendimento VIP:</strong> Consultorias personalizadas para patrimônios acima de R$ 2 milhões
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAEspecialista;
