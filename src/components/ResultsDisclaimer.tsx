
import React, { useState } from 'react';
import GlassCard from './GlassCard';
import VariableCard from './VariableCard';

const ResultsDisclaimer = () => {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const variaveis = [
    {
      titulo: "Valor Real dos Bens",
      impacto: "Alto" as const,
      descricao: "Diferença entre valor venal, valor de mercado e valor declarado",
      exemplo: "Imóvel com valor venal de R$ 500 mil pode ter valor de mercado de R$ 800 mil"
    },
    {
      titulo: "Custas Judiciais por Comarca",
      impacto: "Médio" as const,
      descricao: "Cada tribunal tem sua tabela de custas específica",
      exemplo: "TJSP: 1% do valor da causa | TJRJ: 2% com mínimo de R$ 500"
    },
    {
      titulo: "Honorários Advocatícios",
      impacto: "Alto" as const,
      descricao: "Variam conforme complexidade e acordos específicos",
      exemplo: "6% a 20% do patrimônio, dependendo se há litígio"
    },
    {
      titulo: "Isenções e Reduções",
      impacto: "Médio" as const,
      descricao: "Benefícios fiscais específicos por estado",
      exemplo: "Imóvel residencial único até R$ 200 mil em alguns estados"
    },
    {
      titulo: "Dívidas do Espólio",
      impacto: "Alto" as const,
      descricao: "Débitos que devem ser quitados antes da partilha",
      exemplo: "IPTU atrasado, financiamentos, dívidas médicas"
    },
    {
      titulo: "Complexidade do Processo",
      impacto: "Médio" as const,
      descricao: "Número de bens, herdeiros e existência de testamento",
      exemplo: "Inventário com 10+ imóveis requer mais diligências"
    }
  ];

  return (
    <GlassCard className="mb-12 fade-in-up stagger-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-2xl">⚠️</span>
          <h3 className="font-semibold text-yellow-400">Sobre a Precisão do Cálculo</h3>
        </div>
        
        <p className="text-sm text-glass mb-4">
          Este cálculo é uma estimativa baseada em valores médios de mercado e legislação vigente de 2025. 
          A precisão pode variar de acordo com fatores específicos do seu caso.
        </p>

        <button 
          onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
          className="glass-button px-6 py-2 text-sm flex items-center space-x-2 mx-auto"
        >
          <span>{mostrarDetalhes ? '➖' : '➕'}</span>
          <span>Ver variáveis que afetam o cálculo</span>
        </button>

        {mostrarDetalhes && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {variaveis.map((variavel, index) => (
              <VariableCard
                key={index}
                titulo={variavel.titulo}
                impacto={variavel.impacto}
                descricao={variavel.descricao}
                exemplo={variavel.exemplo}
              />
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default ResultsDisclaimer;
