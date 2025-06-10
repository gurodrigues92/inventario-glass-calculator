
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';

const AdvancedCalculator = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-glass hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12 fade-in-up">
            <div className="badge-top inline-block mb-4">Análise Completa</div>
            <h1 className="heading-lg mb-4">Calculadora Avançada</h1>
            <p className="text-glass">
              Formulário completo com análise detalhada em breve
            </p>
          </div>

          <GlassCard className="text-center fade-in-up">
            <div className="py-12">
              <div className="text-6xl mb-6">🚧</div>
              <h2 className="heading-md mb-4">Em Desenvolvimento</h2>
              <p className="text-glass mb-8">
                A calculadora avançada está sendo desenvolvida com formulário multi-step,
                análise por estado e relatório PDF completo.
              </p>
              <button 
                onClick={() => navigate('/calculadora-basica')}
                className="glass-button px-8 py-3"
              >
                Usar Calculadora Básica
              </button>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default AdvancedCalculator;
