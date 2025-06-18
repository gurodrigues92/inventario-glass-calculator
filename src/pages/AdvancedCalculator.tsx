
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import LuxuryInput from '../components/ui/LuxuryInput';
import LuxuryCurrencyInput from '../components/ui/LuxuryCurrencyInput';
import LuxurySelect from '../components/ui/LuxurySelect';
import LuxuryCheckbox from '../components/ui/LuxuryCheckbox';
import { ESTADOS_DATA, getAliquotaDisplay } from '../data/estadosData';

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

  const estadoCivilOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'solteiro', label: 'Solteiro(a)' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'divorciado', label: 'Divorciado(a)' },
    { value: 'viuvo', label: 'Viúvo(a)' }
  ];

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

            <LuxuryInput
              label="Nome Completo"
              icon="👤"
              value={formData.nomeCompleto}
              onChange={(value) => handleInputChange('nomeCompleto', value)}
              placeholder="Seu nome completo"
              required
            />

            <LuxurySelect
              label="Estado Civil"
              icon="💑"
              value={formData.estadoCivil}
              onChange={(value) => handleInputChange('estadoCivil', value)}
              options={estadoCivilOptions}
              required
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="heading-md mb-2">Detalhamento do Patrimônio</h2>
              <p className="text-glass">Informe o valor detalhado dos bens</p>
            </div>

            <LuxuryCurrencyInput
              label="Valor Total do Patrimônio"
              icon="💰"
              value={formData.patrimonio}
              onChange={(value) => handleInputChange('patrimonio', value)}
              required
              hint="Soma de todos os bens do falecido"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LuxuryCurrencyInput
                label="Imóveis"
                icon="🏠"
                value={formData.valorImoveis}
                onChange={(value) => handleInputChange('valorImoveis', value)}
                hint="Casas, apartamentos, terrenos"
              />

              <LuxuryCurrencyInput
                label="Veículos"
                icon="🚗"
                value={formData.valorVeiculos}
                onChange={(value) => handleInputChange('valorVeiculos', value)}
                hint="Carros, motos, embarcações"
              />

              <LuxuryCurrencyInput
                label="Investimentos"
                icon="📈"
                value={formData.valorInvestimentos}
                onChange={(value) => handleInputChange('valorInvestimentos', value)}
                hint="Ações, fundos, renda fixa"
              />

              <LuxuryCurrencyInput
                label="Outros Bens"
                icon="💎"
                value={formData.valorOutrosBens}
                onChange={(value) => handleInputChange('valorOutrosBens', value)}
                hint="Joias, obras de arte, etc."
              />
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

            <LuxurySelect
              label="Estado onde será feito o inventário"
              icon="📍"
              value={formData.estado}
              onChange={(value) => handleInputChange('estado', value)}
              options={estadosOptions}
              required
              hint="Alíquotas atualizadas para 2025"
            />

            <div className="space-y-4">
              <div 
                className="label-luxury"
                style={{
                  color: '#c2cad5',
                  fontSize: '14px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>⚖️</span> Tipo de processo
                <div 
                  style={{
                    height: '1px',
                    flex: '1',
                    background: 'linear-gradient(to right, rgba(255, 215, 0, 0.3), transparent)'
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('tipoProcesso', 'extrajudicial')}
                  className={`luxury-option-card ${
                    formData.tipoProcesso === 'extrajudicial' ? 'active' : ''
                  }`}
                  style={{
                    background: formData.tipoProcesso === 'extrajudicial' 
                      ? 'rgba(255, 215, 0, 0.1)' 
                      : 'rgba(26, 26, 26, 0.7)',
                    border: formData.tipoProcesso === 'extrajudicial'
                      ? '1px solid rgba(255, 215, 0, 0.5)'
                      : '1px solid rgba(133, 149, 171, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
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
                  style={{
                    background: formData.tipoProcesso === 'judicial' 
                      ? 'rgba(255, 215, 0, 0.1)' 
                      : 'rgba(26, 26, 26, 0.7)',
                    border: formData.tipoProcesso === 'judicial'
                      ? '1px solid rgba(255, 215, 0, 0.5)'
                      : '1px solid rgba(133, 149, 171, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div className="font-medium text-white">Judicial</div>
                  <div className="text-sm text-glass">3-8 anos</div>
                  <div className="text-xs text-orange-400">Tradicional</div>
                </button>
              </div>
            </div>

            <LuxuryInput
              label="Número de herdeiros"
              icon="👥"
              value={formData.herdeiros}
              onChange={(value) => handleInputChange('herdeiros', value)}
              type="number"
              placeholder="1"
            />
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
              <LuxuryCheckbox
                label="Existe testamento válido"
                icon="📜"
                checked={formData.temTestamento}
                onChange={(checked) => handleInputChange('temTestamento', checked)}
                description="Acelera o processo extrajudicial"
              />

              <LuxuryCheckbox
                label="Há herdeiros menores ou incapazes"
                icon="👶"
                checked={formData.temMenoresIncapazes}
                onChange={(checked) => handleInputChange('temMenoresIncapazes', checked)}
                description="Impede o inventário extrajudicial"
              />

              <LuxuryCheckbox
                label="Possibilidade de litígio"
                icon="⚖️"
                checked={formData.temLitigio}
                onChange={(checked) => handleInputChange('temLitigio', checked)}
                description="Aumenta custos e tempo do processo"
              />
            </div>

            <LuxuryCurrencyInput
              label="Dívidas do espólio"
              icon="💳"
              value={formData.dividasEspolio}
              onChange={(value) => handleInputChange('dividasEspolio', value)}
              hint="Dívidas deixadas pelo falecido"
            />
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
