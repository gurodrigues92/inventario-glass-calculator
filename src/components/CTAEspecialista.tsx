
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
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 text-sm">
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
          <h2 className="text-4xl font-bold mb-3" style={{ 
            background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ISENTE O PROCESSO DE INVENTÁRIO
          </h2>
          <p className="text-2xl font-semibold mb-2" style={{ color: '#0C2C45' }}>
            FALE COM UM ESPECIALISTA
          </p>
          <p className="text-lg" style={{ color: '#476D9E' }}>
            Transforme custos em economia com estratégias personalizadas
          </p>
        </div>

        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <p className="mb-2 text-lg font-semibold" style={{ color: '#059669' }}>💰 Economia potencial estimada:</p>
          <div className="text-4xl font-bold mb-3" style={{ 
            background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {formatCurrency(economiaEstimada)}
          </div>
          <p className="text-sm" style={{ color: '#065f46' }}>
            *Baseado em casos similares com estratégias de planejamento sucessório
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="luxury-card p-6">
            <h4 className="font-semibold mb-3 flex items-center" style={{ color: '#0C2C45' }}>
              <span className="text-2xl mr-2">🎯</span>
              Estratégias Personalizadas
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: '#476D9E' }}>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Análise detalhada do seu patrimônio</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Instrumento jurídico personalizado</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Doações estratégicas em vida</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Testamento otimizado</span>
              </li>
            </ul>
          </div>

          <div className="luxury-card p-6">
            <h4 className="font-semibold mb-3 flex items-center" style={{ color: '#0C2C45' }}>
              <span className="text-2xl mr-2">🛡️</span>
              Proteção Patrimonial
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: '#476D9E' }}>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Blindagem contra credores</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Otimização tributária contínua</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
                <span>Governança familiar</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-600">✓</span>
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
          
          <p className="text-xs" style={{ color: '#476D9E' }}>
            🚀 Em breve disponibilizaremos este serviço personalizado premium
          </p>
          
          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-sm text-center" style={{ color: '#7c3aed' }}>
              <strong>Atendimento VIP:</strong> Consultorias personalizadas para patrimônios acima de R$ 2 milhões
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAEspecialista;
