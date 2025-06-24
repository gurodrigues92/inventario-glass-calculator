
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import LuxuryCurrencyInput from '../components/ui/LuxuryCurrencyInput';
import LuxurySelect from '../components/ui/LuxurySelect';
import { ESTADOS_DATA } from '../data/estadosData';
import { parseCurrencyValue, formatCurrency } from '../utils/formatters';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    estado: '',
    valorImoveis: '',
    valorVeiculos: '',
    valorInvestimentos: ''
  });

  const [totalPatrimonio, setTotalPatrimonio] = useState(0);

  // Calcular total automaticamente
  useEffect(() => {
    const imoveis = parseCurrencyValue(formData.valorImoveis) || 0;
    const veiculos = parseCurrencyValue(formData.valorVeiculos) || 0;
    const investimentos = parseCurrencyValue(formData.valorInvestimentos) || 0;
    setTotalPatrimonio(imoveis + veiculos + investimentos);
  }, [formData.valorImoveis, formData.valorVeiculos, formData.valorInvestimentos]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.estado || totalPatrimonio === 0) return;
    
    const dadosParaCalculo = {
      ...formData,
      patrimonio: formatCurrency(totalPatrimonio),
      tipoProcesso: 'extrajudicial',
      herdeiros: '1',
      temTestamento: false,
      temMenoresIncapazes: false,
      temLitigio: false
    };
    
    navigate('/resultados', { state: { formData: dadosParaCalculo, calculationType: 'simplified' } });
  };

  const estadosOptions = Object.values(ESTADOS_DATA).map(estado => ({
    value: estado.uf,
    label: `${estado.nome} - ITCMD ${estado.itcmd.tipo === 'fixa' ? 
      `${(estado.itcmd.aliquota! * 100).toFixed(0)}%` : 
      'Progressivo'}`
  }));

  const isFormValid = formData.estado && totalPatrimonio > 0;

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 fade-in-up">
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
              Calculadora de Inventário
            </h1>
            <p 
              className="text-xl max-w-2xl mx-auto leading-relaxed mb-8"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Descubra os custos do seu inventário com precisão.<br />
              Preencha apenas 4 campos e obtenha uma estimativa completa.
            </p>
          </div>

          {/* Formulário Simplificado */}
          <GlassCard className="fade-in-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <LuxurySelect
                label="Estado de Residência"
                icon="📍"
                value={formData.estado}
                onChange={(value) => handleInputChange('estado', value)}
                options={estadosOptions}
                placeholder="Selecione seu Estado"
                required
                hint="Para calcular o ITCMD correto"
              />

              <LuxuryCurrencyInput
                label="Valor dos Imóveis"
                icon="🏠"
                value={formData.valorImoveis}
                onChange={(value) => handleInputChange('valorImoveis', value)}
                placeholder="R$ 0"
                hint="Casas, apartamentos, terrenos"
              />

              <LuxuryCurrencyInput
                label="Valor dos Veículos"
                icon="🚗"
                value={formData.valorVeiculos}
                onChange={(value) => handleInputChange('valorVeiculos', value)}
                placeholder="R$ 0"
                hint="Carros, motos, embarcações"
              />

              <LuxuryCurrencyInput
                label="Investimentos e Outros Bens"
                icon="💎"
                value={formData.valorInvestimentos}
                onChange={(value) => handleInputChange('valorInvestimentos', value)}
                placeholder="R$ 0"
                hint="Ações, fundos, joias, obras de arte"
              />

              {/* Total do Patrimônio */}
              <div 
                className="total-patrimonio p-6 rounded-xl border"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05))',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  boxShadow: '0 4px 20px rgba(255, 215, 0, 0.1)'
                }}
              >
                <div className="flex justify-between items-center">
                  <span 
                    className="text-lg font-semibold"
                    style={{ color: '#FFD700' }}
                  >
                    Total do Patrimônio:
                  </span>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: '#FFD700' }}
                  >
                    {formatCurrency(totalPatrimonio)}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className="luxury-btn-primary w-full py-4 text-lg font-semibold"
                style={{
                  background: !isFormValid 
                    ? 'rgba(133, 149, 171, 0.3)' 
                    : 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
                  color: !isFormValid ? '#8595ab' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '18px',
                  fontSize: '18px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: !isFormValid ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: !isFormValid 
                    ? 'none' 
                    : '0 6px 20px rgba(255, 215, 0, 0.3)',
                  opacity: !isFormValid ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (isFormValid) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFormValid) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.3)';
                  }
                }}
              >
                Calcular Custos do Inventário
              </button>
            </form>
          </GlassCard>

          {/* Info Section */}
          <div className="mt-16 text-center fade-in-up">
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
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-semibold text-white mb-2">Precisão</h3>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Cálculos baseados nas alíquotas reais de cada estado
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-3">⚡</div>
                  <h3 className="font-semibold text-white mb-2">Rapidez</h3>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Resultado em segundos com apenas 4 campos
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-3">💡</div>
                  <h3 className="font-semibold text-white mb-2">Economia</h3>
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Descubra como economizar até 90% com Holding Familiar
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
