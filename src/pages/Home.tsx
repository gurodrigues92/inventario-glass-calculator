
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SelectionCard from '../components/SelectionCard';

const Home = () => {
  const navigate = useNavigate();

  const basicFeatures = [
    'Apenas 4 campos obrigatórios',
    'Resultado em 30 segundos',
    'Cálculo automático do ITCMD',
    'Comparação judicial vs extrajudicial'
  ];

  const advancedFeatures = [
    'Análise completa por estado',
    'Cálculo detalhado de custos',
    'Estimativa de honorários',
    'Relatório PDF profissional',
    'Sugestões de economia',
    'Cronograma do processo'
  ];

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 fade-in-up">
            <h1 className="heading-xl mb-6">
              Calcule seu ITCMD
              <br />
              de forma inteligente
            </h1>
            <p className="text-xl text-glass max-w-2xl mx-auto leading-relaxed">
              Estime todos os custos do seu inventário com precisão.
              Escolha entre cálculo rápido ou análise completa.
            </p>
          </div>

          {/* Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <SelectionCard
              title="Cálculo Básico"
              subtitle="Perfeito para uma estimativa rápida dos custos principais"
              badgeText="Rápido"
              badgeType="fast"
              features={basicFeatures}
              buttonText="Calcular Agora"
              onClick={() => navigate('/calculadora-basica')}
              className="fade-in-up stagger-1"
            />
            
            <SelectionCard
              title="Cálculo Avançado"
              subtitle="Análise completa com relatório detalhado e orientações"
              badgeText="Completo"
              badgeType="top"
              features={advancedFeatures}
              buttonText="Análise Completa"
              onClick={() => navigate('/calculadora-avancada')}
              className="fade-in-up stagger-2"
            />
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center fade-in-up stagger-3">
            <div className="glass-card max-w-4xl mx-auto p-8">
              <h2 className="heading-md mb-4">Por que usar nossa calculadora?</h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-2xl mb-3">⚡</div>
                  <h3 className="font-semibold text-white mb-2">Rapidez</h3>
                  <p className="text-glass text-sm">
                    Resultados instantâneos com base nas alíquotas atualizadas de cada estado
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-3">🎯</div>
                  <h3 className="font-semibold text-white mb-2">Precisão</h3>
                  <p className="text-glass text-sm">
                    Cálculos baseados na legislação vigente com dados sempre atualizados
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-3">📊</div>
                  <h3 className="font-semibold text-white mb-2">Clareza</h3>
                  <p className="text-glass text-sm">
                    Breakdown completo de todos os custos e orientações práticas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
