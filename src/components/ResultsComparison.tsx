
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
        
        {/* Holding Familiar S/A com destaque especial */}
        {economiaHolding > 50000 && (
          <div className="relative">
            {/* Selo de recomendação */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
              💡 RECOMENDADO
            </div>
            
            <GlassCard className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 shadow-glow">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="text-xl font-bold text-yellow-400 mb-1">
                    Holding Familiar S/A
                  </h4>
                  <p className="text-sm text-glass">
                    Constituição em 30 a 60 dias
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(comparacao.holding.custo)}
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-300 font-semibold">Economia estimada:</span>
                  <span className="text-2xl font-bold text-green-400">
                    {formatCurrency(economiaHolding)}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-glass">
                <p className="mb-2">
                  <strong className="text-white">Benefícios:</strong>
                </p>
                <ul className="space-y-1 text-xs">
                  <li>• Redução significativa dos custos sucessórios</li>
                  <li>• Profissionalização da gestão do patrimônio</li>
                  <li>• Planejamento tributário otimizado</li>
                  <li>• Proteção patrimonial</li>
                </ul>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default ResultsComparison;
