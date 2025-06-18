
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import PatrimonioInput from '../components/calculator/PatrimonioInput';
import EstadoSelector from '../components/calculator/EstadoSelector';
import TipoProcessoSelector from '../components/calculator/TipoProcessoSelector';
import InformacoesAdicionais from '../components/calculator/InformacoesAdicionais';

const BasicCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patrimonio: '',
    estado: 'SP',
    tipoProcesso: 'extrajudicial',
    herdeiros: '1',
    temTestamento: false,
    temMenoresIncapazes: false,
    temLitigio: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/resultados', { state: { formData, calculationType: 'basic' } });
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
              className="badge-fast inline-block mb-4"
              style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Cálculo Rápido
            </div>
            <h1 className="heading-lg mb-4">Cálculo Básico de ITCMD</h1>
            <p className="text-glass">
              Preencha os campos abaixo para uma estimativa rápida dos custos
            </p>
          </div>

          {/* Form */}
          <GlassCard className="fade-in-up stagger-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <PatrimonioInput
                value={formData.patrimonio}
                onChange={(value) => handleInputChange('patrimonio', value)}
              />

              <EstadoSelector
                value={formData.estado}
                onChange={(value) => handleInputChange('estado', value)}
              />

              <TipoProcessoSelector
                value={formData.tipoProcesso}
                onChange={(value) => handleInputChange('tipoProcesso', value)}
              />

              <InformacoesAdicionais
                temTestamento={formData.temTestamento}
                temMenoresIncapazes={formData.temMenoresIncapazes}
                temLitigio={formData.temLitigio}
                onToggle={handleInputChange}
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="luxury-btn-primary w-full py-4 text-lg font-semibold"
                disabled={!formData.patrimonio || !formData.estado}
                style={{
                  background: !formData.patrimonio || !formData.estado 
                    ? 'rgba(133, 149, 171, 0.3)' 
                    : 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
                  color: !formData.patrimonio || !formData.estado ? '#8595ab' : '#1a1a1a',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '18px',
                  fontSize: '18px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: !formData.patrimonio || !formData.estado ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: !formData.patrimonio || !formData.estado 
                    ? 'none' 
                    : '0 6px 20px rgba(255, 215, 0, 0.3)',
                  opacity: !formData.patrimonio || !formData.estado ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (formData.patrimonio && formData.estado) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 215, 0, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (formData.patrimonio && formData.estado) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.3)';
                  }
                }}
              >
                Calcular ITCMD
              </button>
            </form>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default BasicCalculator;
