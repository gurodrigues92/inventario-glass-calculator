
import React from 'react';
import GlassCard from './GlassCard';
import ComparisonCard from './ComparisonCard';
import { ComparacaoProcesso } from '../utils/itcmdCalculator';
import { DadosCalculoInventario } from '../utils/itcmdCalculator';
import { formatCurrency } from '../utils/formatters';

interface ResultsComparisonProps {
  comparacao: {
    judicial: ComparacaoProcesso;
    extrajudicial: ComparacaoProcesso;
    holding: ComparacaoProcesso;
  };
  dadosCalculo: DadosCalculoInventario;
  economiaHolding: number;
}

const ResultsComparison = ({ comparacao, dadosCalculo, economiaHolding }: ResultsComparisonProps) => {
  return (
    <GlassCard className="fade-in-up stagger-3">
      <h3 className="heading-md mb-6">Comparação de Processos</h3>
      <div className="space-y-4">
        <ComparisonCard
          tipo="Extrajudicial"
          custo={comparacao.extrajudicial.custo}
          tempo={comparacao.extrajudicial.tempo}
          destaque={dadosCalculo.tipoProcesso === 'extrajudicial'}
          economia={dadosCalculo.tipoProcesso === 'judicial' ? 
            comparacao.judicial.custo - comparacao.extrajudicial.custo : 0}
        />
        
        <ComparisonCard
          tipo="Judicial"
          custo={comparacao.judicial.custo}
          tempo={comparacao.judicial.tempo}
          destaque={dadosCalculo.tipoProcesso === 'judicial'}
        />
        
        {/* Holding Familiar S/A com destaque especial premium */}
        {economiaHolding > 50000 && (
          <div className="relative mt-8">
            {/* Selo de recomendação premium */}
            <div className="absolute -top-3 -right-3 z-20">
              <span className="badge-premium shadow-glow">
                {economiaHolding > 200000 ? '🏆 TOP CHOICE' : '💡 RECOMENDADO'}
              </span>
            </div>
            
            <div className="holding-card luxury-card p-6 shadow-glow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold golden-accent mb-2">
                    🏢 Holding Familiar S/A
                  </h4>
                  <p className="text-sm text-glass mb-1">
                    ⏱️ Constituição em 30 a 60 dias
                  </p>
                  <p className="text-xs text-gold-400">
                    Estrutura empresarial completa para gestão patrimonial
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold golden-accent">
                    {formatCurrency(comparacao.holding.custo)}
                  </div>
                  <p className="text-xs text-glass">Investimento inicial</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-300 font-semibold">💰 Economia estimada no inventário:</span>
                  <span className="text-2xl font-bold golden-accent">
                    {formatCurrency(economiaHolding)}
                  </span>
                </div>
                <p className="text-xs text-green-200">
                  *Economia comparada ao processo tradicional de inventário
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="luxury-card p-4">
                  <h5 className="text-white font-semibold mb-3 text-sm">
                    🎯 Benefícios Imediatos
                  </h5>
                  <ul className="space-y-1 text-xs text-glass">
                    <li>• Redução drástica dos custos sucessórios</li>
                    <li>• Agilidade na transmissão patrimonial</li>
                    <li>• Proteção contra credores pessoais</li>
                    <li>• Gestão profissionalizada</li>
                  </ul>
                </div>
                
                <div className="luxury-card p-4">
                  <h5 className="text-white font-semibold mb-3 text-sm">
                    🚀 Vantagens Estratégicas
                  </h5>
                  <ul className="space-y-1 text-xs text-glass">
                    <li>• Planejamento tributário otimizado</li>
                    <li>• Flexibilidade para reorganizações</li>
                    <li>• Governança familiar estruturada</li>
                    <li>• Perpetuação do patrimônio</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-gold-500/10 border border-gold-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">💡</span>
                  <span className="text-white font-semibold text-sm">Ideal para seu perfil</span>
                </div>
                <p className="text-xs text-glass leading-relaxed">
                  Com um patrimônio de {formatCurrency(dadosCalculo.patrimonio)}, a constituição 
                  de uma Holding Familiar S/A oferece o melhor custo-benefício para otimização 
                  tributária e sucessória, além de profissionalizar a gestão dos bens.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default ResultsComparison;
