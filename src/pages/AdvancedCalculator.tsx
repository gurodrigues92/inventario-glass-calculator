
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { ESTADOS_DATA, getAliquotaDisplay } from '../data/estadosData';
import { formatCurrencyInput } from '../utils/formatters';

const AdvancedCalculator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    nomeCompleto: '',
    estadoCivil: '',
    
    // Patrimônio
    patrimonio: '',
    valorImoveis: '',
    valorVeiculos: '',
    valorInvestimentos: '',
    valorOutrosBens: '',
    
    // Processo
    estado: 'SP',
    tipoProcesso: 'extrajudicial',
    herdeiros: '1',
    
    // Informações Adicionais
    temTestamento: false,
    temMenoresIncapazes: false,
    temLitigio: false,
    dividasEspolio: '',
    
    // Dados de Contato
    email: '',
    telefone: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (field: string, value: string) => {
    const formatted = formatCurrencyInput(value);
    handleInputChange(field, formatted);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/resultados', { state: { formData, calculationType: 'advanced' } });
  };

  const estadosOptions = Object.values(ESTADOS_DATA).map(estado => ({
    value: estado.uf,
    label: `${estado.nome} - ${getAliquotaDisplay(estado.uf)}`
  }));

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.nomeCompleto && !!formData.estadoCivil;
      case 2:
        return !!formData.patrimonio;
      case 3:
        return !!formData.estado && !!formData.tipoProcesso;
      case 4:
        return true; // Step 4 é opcional
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="heading-md mb-2">Dados Pessoais</h2>
              <p className="text-glass">Vamos começar com algumas informações básicas</p>
            </div>

            <div>
              <label className="luxury-label">
                Nome Completo *
              </label>
              <input
                type="text"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                placeholder="Seu nome completo"
                className="luxury-input w-full"
                required
              />
            </div>

            <div>
              <label className="luxury-label">
                Estado Civil *
              </label>
              <select
                value={formData.estadoCivil}
                onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                className="luxury-select w-full"
                required
              >
                <option value="">Selecione...</option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="heading-md mb-2">Detalhamento do Patrimônio</h2>
              <p className="text-glass">Informe o valor detalhado dos bens</p>
            </div>

            <div>
              <label className="luxury-label">
                Valor Total do Patrimônio *
              </label>
              <input
                type="text"
                value={formData.patrimonio}
                onChange={(e) => handleCurrencyChange('patrimonio', e.target.value)}
                placeholder="R$ 0,00"
                className="luxury-input w-full text-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="luxury-label">
                  Imóveis
                </label>
                <input
                  type="text"
                  value={formData.valorImoveis}
                  onChange={(e) => handleCurrencyChange('valorImoveis', e.target.value)}
                  placeholder="R$ 0,00"
                  className="luxury-input w-full"
                />
                <p className="text-xs text-glass mt-1">Casas, apartamentos, terrenos</p>
              </div>

              <div>
                <label className="luxury-label">
                  Veículos
                </label>
                <input
                  type="text"
                  value={formData.valorVeiculos}
                  onChange={(e) => handleCurrencyChange('valorVeiculos', e.target.value)}
                  placeholder="R$ 0,00"
                  className="luxury-input w-full"
                />
                <p className="text-xs text-glass mt-1">Carros, motos, embarcações</p>
              </div>

              <div>
                <label className="luxury-label">
                  Investimentos
                </label>
                <input
                  type="text"
                  value={formData.valorInvestimentos}
                  onChange={(e) => handleCurrencyChange('valorInvestimentos', e.target.value)}
                  placeholder="R$ 0,00"
                  className="luxury-input w-full"
                />
                <p className="text-xs text-glass mt-1">Ações, fundos, renda fixa</p>
              </div>

              <div>
                <label className="luxury-label">
                  Outros Bens
                </label>
                <input
                  type="text"
                  value={formData.valorOutrosBens}
                  onChange={(e) => handleCurrencyChange('valorOutrosBens', e.target.value)}
                  placeholder="R$ 0,00"
                  className="luxury-input w-full"
                />
                <p className="text-xs text-glass mt-1">Joias, obras de arte, etc.</p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="heading-md mb-2">Configuração do Processo</h2>
              <p className="text-glass">Defina como será conduzido o inventário</p>
            </div>

            <div>
              <label className="luxury-label">
                Estado onde será feito o inventário *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="luxury-select w-full"
                required
              >
                {estadosOptions.map(estado => (
                  <option key={estado.value} value={estado.value}>
                    {estado.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="luxury-label">
                Tipo de processo *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('tipoProcesso', 'extrajudicial')}
                  className={`luxury-option-card ${
                    formData.tipoProcesso === 'extrajudicial' ? 'active' : ''
                  }`}
                >
                  <div className="font-medium text-white">Extrajudicial</div>
                  <div className="text-sm text-glass">60-120 dias</div>
                  <div className="text-xs text-green-400">Mais econômico</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('tipoProcesso', 'judicial')}
                  className={`luxury-option-card ${
                    formData.tipoProcesso === 'judicial' ? 'active' : ''
                  }`}
                >
                  <div className="font-medium text-white">Judicial</div>
                  <div className="text-sm text-glass">3-8 anos</div>
                  <div className="text-xs text-orange-400">Tradicional</div>
                </button>
              </div>
            </div>

            <div>
              <label className="luxury-label">
                Número de herdeiros
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.herdeiros}
                onChange={(e) => handleInputChange('herdeiros', e.target.value)}
                className="luxury-input w-full"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="heading-md mb-2">Informações Complementares</h2>
              <p className="text-glass">Dados que podem afetar o processo e os custos</p>
            </div>

            <div className="space-y-4">
              <label className="luxury-checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.temTestamento}
                  onChange={(e) => handleInputChange('temTestamento', e.target.checked)}
                  className="luxury-checkbox"
                />
                <div>
                  <div className="text-white font-medium">Existe testamento válido</div>
                  <div className="text-xs text-glass">Acelera o processo extrajudicial</div>
                </div>
              </label>

              <label className="luxury-checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.temMenoresIncapazes}
                  onChange={(e) => handleInputChange('temMenoresIncapazes', e.target.checked)}
                  className="luxury-checkbox"
                />
                <div>
                  <div className="text-white font-medium">Há herdeiros menores ou incapazes</div>
                  <div className="text-xs text-glass">Impede o inventário extrajudicial</div>
                </div>
              </label>

              <label className="luxury-checkbox-card">
                <input
                  type="checkbox"
                  checked={formData.temLitigio}
                  onChange={(e) => handleInputChange('temLitigio', e.target.checked)}
                  className="luxury-checkbox"
                />
                <div>
                  <div className="text-white font-medium">Possibilidade de litígio</div>
                  <div className="text-xs text-glass">Aumenta custos e tempo do processo</div>
                </div>
              </label>
            </div>

            <div>
              <label className="luxury-label">
                Dívidas do espólio
              </label>
              <input
                type="text"
                value={formData.dividasEspolio}
                onChange={(e) => handleCurrencyChange('dividasEspolio', e.target.value)}
                placeholder="R$ 0,00"
                className="luxury-input w-full"
              />
              <p className="text-xs text-glass mt-1">Dívidas deixadas pelo falecido</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
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
            <div 
              className="badge-top inline-block mb-4"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                color: '#1a1a1a',
                padding: '8px 20px',
                borderRadius: '25px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.5)',
                animation: 'pulse-gold 2s infinite'
              }}
            >
              Análise Completa
            </div>
            <h1 className="heading-lg mb-4">Calculadora Avançada</h1>
            <p className="text-glass">
              Análise detalhada com formulário completo em 4 etapas
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    step < currentStep 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : step === currentStep
                      ? 'border-gold bg-gold text-dark'
                      : 'border-glass-border text-glass'
                  }`}
                  style={{
                    borderColor: step < currentStep ? '#10B981' : step === currentStep ? '#FFD700' : 'rgba(133, 149, 171, 0.3)',
                    backgroundColor: step < currentStep ? '#10B981' : step === currentStep ? '#FFD700' : 'transparent',
                    color: step < currentStep || step === currentStep ? '#1a1a1a' : '#8595ab'
                  }}
                  >
                    {step < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-0.5`}
                    style={{
                      backgroundColor: step < currentStep ? '#10B981' : 'rgba(133, 149, 171, 0.3)'
                    }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form */}
          <GlassCard className="fade-in-up">
            <form onSubmit={handleSubmit}>
              {renderStep()}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-glass-border">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="luxury-btn-secondary px-6 py-2"
                  >
                    Anterior
                  </button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!isStepValid(currentStep)}
                      className="luxury-btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próximo
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="luxury-btn-primary px-8 py-3 text-lg font-semibold"
                    >
                      Calcular ITCMD Completo
                    </button>
                  )}
                </div>
              </div>
            </form>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default AdvancedCalculator;
