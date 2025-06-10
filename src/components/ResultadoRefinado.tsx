
import React from 'react';
import GlassCard from './GlassCard';
import InsightCard from './InsightCard';
import { formatCurrency } from '../utils/formatters';

interface ResultadoRefinado {
  totalRefinado: number;
  patrimonioLiquido: number;
  ajustes: Array<{
    nome: string;
    impacto: string;
    descricao: string;
  }>;
  isencoes: Array<{
    tipo: string;
    valor: number;
  }>;
  comparativo: {
    calculoOriginal: number;
    calculoRefinado: number;
    diferenca: number;
    percentualDiferenca: string;
  };
  temLitigio?: boolean;
}

interface ResultadoRefinadoProps {
  calculoOriginal: {
    total: number;
    patrimonio: number;
  };
  calculoRefinado: ResultadoRefinado;
}

const ResultadoRefinado = ({ calculoOriginal, calculoRefinado }: ResultadoRefinadoProps) => {
  const { comparativo, ajustes, isencoes, temLitigio } = calculoRefinado;
  const diferenca = comparativo.diferenca;
  const isDiferencaPositiva = diferenca > 0;

  return (
    <div className="mb-12">
      <GlassCard className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-blue-500/5">
        <h3 className="heading-md mb-6 text-center">📊 Cálculo Refinado com Seus Dados</h3>
        
        {/* Comparativo Visual */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
          <div className="bg-glass-white border border-glass-border rounded-lg p-6 text-center flex-1 max-w-sm">
            <h4 className="text-white font-semibold mb-2">Estimativa Original</h4>
            <div className="text-2xl font-bold text-purple-400 mb-2">
              {formatCurrency(calculoOriginal.total)}
            </div>
            <span className="text-xs text-glass">Baseada em médias</span>
          </div>
          
          <div className="text-3xl text-purple-400 hidden lg:block">→</div>
          <div className="text-3xl text-purple-400 lg:hidden rotate-90">→</div>
          
          <div className="bg-glass-white border-2 border-green-500/50 rounded-lg p-6 text-center flex-1 max-w-sm shadow-glow">
            <h4 className="text-white font-semibold mb-2">Cálculo Refinado</h4>
            <div className="text-2xl font-bold text-green-400 mb-2">
              {formatCurrency(calculoRefinado.totalRefinado)}
            </div>
            <span className="text-xs text-glass mb-3 block">Com seus dados específicos</span>
            <div className={`text-lg font-semibold ${isDiferencaPositiva ? 'text-red-400' : 'text-green-400'}`}>
              {isDiferencaPositiva ? '↑' : '↓'} {Math.abs(parseFloat(comparativo.percentualDiferenca))}%
            </div>
          </div>
        </div>

        {/* Detalhamento das Mudanças */}
        {ajustes.length > 0 && (
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-4">O que mudou:</h4>
            <div className="space-y-3">
              {ajustes.map((ajuste, index) => (
                <div key={index} className="bg-glass-white rounded-lg p-4 border border-glass-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-white">{ajuste.nome}</span>
                      <p className="text-sm text-glass mt-1">{ajuste.descricao}</p>
                    </div>
                    <span className="text-sm font-semibold text-purple-400">{ajuste.impacto}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Novos Insights */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-4">💡 Insights Personalizados</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {temLitigio && (
              <InsightCard
                tipo="estrategia"
                titulo="Considere Mediação"
                descricao="Com possibilidade de litígio, o processo pode se estender por anos. A mediação pode economizar tempo e custos."
              />
            )}
            
            {isencoes.length > 0 && (
              <InsightCard
                tipo="economia"
                titulo="Benefícios Identificados"
                descricao={`Você pode ter direito a ${formatCurrency(isencoes.reduce((s, i) => s + i.valor, 0))} em isenções.`}
                valor={isencoes.reduce((s, i) => s + i.valor, 0)}
              />
            )}

            {!isDiferencaPositiva && (
              <InsightCard
                tipo="economia"
                titulo="Economia Identificada"
                descricao={`O refinamento mostrou uma possível economia de ${formatCurrency(Math.abs(diferenca))}.`}
                valor={Math.abs(diferenca)}
              />
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-500/10 to-green-500/10 rounded-lg p-6 border border-purple-500/30">
          <h4 className="text-lg font-semibold text-white mb-3">Próximos Passos</h4>
          <p className="text-glass mb-4">Com base no cálculo refinado, recomendamos uma consulta especializada para:</p>
          <ul className="text-sm text-glass space-y-2 mb-6">
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Validar os valores e benefícios identificados</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Elaborar estratégia personalizada de economia</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Iniciar o processo com segurança jurídica</span>
            </li>
          </ul>
          
          <div className="text-center">
            <button 
              disabled
              className="glass-button px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💬 Agendar Consulta com Especialista
            </button>
            <p className="text-xs text-glass mt-2">Em breve disponibilizaremos este serviço</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ResultadoRefinado;
