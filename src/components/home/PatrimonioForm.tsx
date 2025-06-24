
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Car, Gem } from 'lucide-react';
import GlassCard from '../GlassCard';
import LuxuryCurrencyInput from '../ui/LuxuryCurrencyInput';
import LuxurySelect from '../ui/LuxurySelect';
import IconWrapper from '../ui/IconWrapper';
import { ESTADOS_DATA } from '../../data/estadosData';
import { parseCurrencyValue, formatCurrency, numeroParaExtenso } from '../../utils/formatters';

const PatrimonioForm = () => {
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
    <GlassCard className="fade-in-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        <LuxurySelect
          label="Estado de Residência"
          icon={<IconWrapper icon={MapPin} size={16} />}
          value={formData.estado}
          onChange={(value) => handleInputChange('estado', value)}
          options={estadosOptions}
          placeholder="Selecione seu Estado"
          required
          hint="Para calcular o ITCMD correto"
        />

        <LuxuryCurrencyInput
          label="Valor de Mercado dos Imóveis"
          icon={<IconWrapper icon={Home} size={16} />}
          value={formData.valorImoveis}
          onChange={(value) => handleInputChange('valorImoveis', value)}
          placeholder="R$ 0,00"
          allowDecimals={true}
          hint="Casas, apartamentos, terrenos - pelo valor real de mercado atual (não valor venal)"
        />

        <LuxuryCurrencyInput
          label="Valor de Mercado dos Veículos"
          icon={<IconWrapper icon={Car} size={16} />}
          value={formData.valorVeiculos}
          onChange={(value) => handleInputChange('valorVeiculos', value)}
          placeholder="R$ 0,00"
          allowDecimals={true}
          hint="Carros, motos, embarcações - conforme tabela FIPE ou avaliação especializada"
        />

        <LuxuryCurrencyInput
          label="Valor de Mercado dos Investimentos"
          icon={<IconWrapper icon={Gem} size={16} />}
          value={formData.valorInvestimentos}
          onChange={(value) => handleInputChange('valorInvestimentos', value)}
          placeholder="R$ 0,00"
          allowDecimals={true}
          hint="Ações, fundos, poupança, joias, obras de arte - valor atual de mercado real"
        />

        {/* Total do Patrimônio */}
        <div 
          className="total-patrimonio p-6 rounded-xl border"
          style={{
            background: 'linear-gradient(135deg, rgba(209, 191, 163, 0.1), rgba(245, 239, 235, 0.5))',
            border: '1px solid rgba(209, 191, 163, 0.3)',
            boxShadow: '0 4px 16px rgba(209, 191, 163, 0.1)'
          }}
        >
          <div className="flex justify-between items-center">
            <span 
              className="text-lg font-semibold"
              style={{ color: '#0C2C45' }}
            >
              Total do Patrimônio (Valor de Mercado):
            </span>
            <span 
              className="text-2xl font-bold"
              style={{ color: '#0C2C45' }}
            >
              {formatCurrency(totalPatrimonio)}
            </span>
          </div>
          
          {/* Valor por extenso */}
          {totalPatrimonio > 0 && (
            <div 
              className="text-sm italic flex items-center gap-2 mt-2"
              style={{ color: '#476D9E' }}
            >
              <span>💰</span>
              "{numeroParaExtenso(totalPatrimonio)}"
            </div>
          )}
          
          <div className="text-xs mt-2" style={{ color: '#476D9E' }}>
            Este será o valor base para cálculo do ITCMD e demais custos
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className="luxury-btn-primary w-full py-4 text-lg font-semibold"
          style={{
            background: !isFormValid 
              ? '#E8E2DD' 
              : 'linear-gradient(135deg, #0C2C45, #476D9E)',
            color: !isFormValid ? '#9FB7D4' : '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '18px',
            fontSize: '18px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            cursor: !isFormValid ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: !isFormValid 
              ? 'none' 
              : '0 6px 20px rgba(12, 44, 69, 0.2)',
            opacity: !isFormValid ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (isFormValid) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(12, 44, 69, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (isFormValid) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(12, 44, 69, 0.2)';
            }
          }}
        >
          Calcular Custos do Inventário
        </button>
      </form>
    </GlassCard>
  );
};

export default PatrimonioForm;
