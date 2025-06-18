
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
            <div className="badge-fast inline-block mb-4">Cálculo Rápido</div>
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
                className="glass-button w-full py-4 text-lg font-semibold"
                disabled={!formData.patrimonio || !formData.estado}
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
