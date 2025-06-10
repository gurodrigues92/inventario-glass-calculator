
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import GlassCard from '../components/GlassCard';

const BasicCalculator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patrimonio: '',
    estado: 'SP',
    tipoProcesso: 'extrajudicial',
    herdeiros: '1'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    if (!numValue) return '';
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(numValue) / 100);
    return formatted;
  };

  const handlePatrimonioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    handleInputChange('patrimonio', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navegar para resultados com os dados
    navigate('/resultados', { state: { formData, calculationType: 'basic' } });
  };

  const estados = [
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'PR', label: 'Paraná' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'BA', label: 'Bahia' },
    { value: 'GO', label: 'Goiás' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'CE', label: 'Ceará' }
  ];

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
              Preencha os 4 campos abaixo para uma estimativa rápida dos custos
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
                  {estados.map(estado => (
                    <option key={estado.value} value={estado.value} className="bg-gray-900">
                      {estado.label}
                    </option>
                  ))}
                </select>
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
                    <div className="text-sm text-glass">Mais rápido e econômico</div>
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
                    <div className="text-sm text-glass">Processo tradicional</div>
                  </button>
                </div>
              </div>

              {/* Número de Herdeiros */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Número de herdeiros *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.herdeiros}
                  onChange={(e) => handleInputChange('herdeiros', e.target.value)}
                  className="glass-input w-full"
                  required
                />
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
