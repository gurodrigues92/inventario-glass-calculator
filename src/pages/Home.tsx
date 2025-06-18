
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
    <div 
      className="min-h-screen bg-animated"
      style={{ 
        backgroundColor: '#1a1a1a',
        color: 'rgba(255, 255, 255, 0.95)',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(133, 149, 171, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(164, 176, 192, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(194, 202, 213, 0.06) 0%, transparent 50%)
        `,
        minHeight: '100vh'
      }}
    >
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 fade-in-up">
            <h1 
              className="heading-xl mb-6"
              style={{
                fontSize: '3.5rem',
                fontWeight: '800',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff, #8595ab)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Economize no Imposto de Herança
            </h1>
            <p 
              className="text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Calcule os custos e descubra como pagar menos.
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
            <div 
              className="glass-card max-w-4xl mx-auto p-8"
              style={{
                background: 'linear-gradient(135deg, rgba(133, 149, 171, 0.05) 0%, rgba(225, 229, 234, 0.03) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <h2 
                className="text-3xl font-semibold mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              >
                Por que usar nossa calculadora?
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-2xl mb-3">⚡</div>
                  <h3 className="font-semibold text-white mb-2">Rapidez</h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Resultados instantâneos com base nas alíquotas atualizadas de cada estado
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-3">🎯</div>
                  <h3 className="font-semibold text-white mb-2">Precisão</h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    Cálculos baseados na legislação vigente com dados sempre atualizados
                  </p>
                </div>
                <div>
                  <div className="text-2xl mb-3">📊</div>
                  <h3 className="font-semibold text-white mb-2">Clareza</h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
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
