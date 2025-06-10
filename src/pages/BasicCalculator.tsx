
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';
import { ESTADOS_DATA, getAliquotaDisplay } from '../data/estadosData';
import { formatCurrencyInput } from '../utils/formatters';

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

  const handlePatrimonioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value);
    handleInputChange('patrimonio', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/resultados', { state: { formData, calculationType: 'basic' } });
  };

  const estadosOptions = Object.values(ESTADOS_DATA).map(estado => ({
    value: estado.uf,
    label: `${estado.nome} - ${getAliquotaDisplay(estado.uf)}`
  }));

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
              {/* Patrimônio Total */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Valor Total do Patrimônio *
                </label>
                <input
                  type="text"
                  value={formData.patrimonio}
                  onChange={handlePatrimonioChange}
                  placeholder="R$ 0,00"
                  className="glass-input w-full text-lg"
                  required
                />
                <p className="text-xs text-glass mt-1">
                  Inclua imóveis, veículos, investimentos e outros bens
                </p>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Estado onde será feito o inventário *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="glass-input w-full"
                  required
                >
                  {estadosOptions.map(estado => (
                    <option key={estado.value} value={estado.value} className="bg-gray-900">
                      {estado.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-glass mt-1">
                  Alíquotas atualizadas para 2025 - algumas são progressivas
                </p>
              </div>

              {/* Tipo de Processo */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tipo de processo desejado *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('tipoProcesso', 'extrajudicial')}
                    className={`p-4 rounded-lg border transition-all ${
                      formData.tipoProcesso === 'extrajudicial'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-glass-border bg-glass-white'
                    }`}
                  >
                    <div className="font-medium text-white">Extrajudicial</div>
                    <div className="text-sm text-glass">60-120 dias</div>
                    <div className="text-xs text-green-400">Mais econômico</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('tipoProcesso', 'judicial')}
                    className={`p-4 rounded-lg border transition-all ${
                      formData.tipoProcesso === 'judicial'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-glass-border bg-glass-white'
                    }`}
                  >
                    <div className="font-medium text-white">Judicial</div>
                    <div className="text-sm text-glass">3-8 anos</div>
                    <div className="text-xs text-orange-400">Processo tradicional</div>
                  </button>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="space-y-4">
                <h3 className="text-white font-medium">Informações Adicionais</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.temTestamento}
                      onChange={(e) => handleInputChange('temTestamento', e.target.checked)}
                      className="rounded border-glass-border"
                    />
                    <span className="text-sm text-white">Existe testamento válido</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.temMenoresIncapazes}
                      onChange={(e) => handleInputChange('temMenoresIncapazes', e.target.checked)}
                      className="rounded border-glass-border"
                    />
                    <span className="text-sm text-white">Há herdeiros menores ou incapazes</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.temLitigio}
                      onChange={(e) => handleInputChange('temLitigio', e.target.checked)}
                      className="rounded border-glass-border"
                    />
                    <span className="text-sm text-white">Possibilidade de litígio entre herdeiros</span>
                  </label>
                </div>
              </div>

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
