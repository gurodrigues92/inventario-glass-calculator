
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Car, Gem } from 'lucide-react';
import GlassCard from '../GlassCard';
import LuxuryCurrencyInput from '../ui/LuxuryCurrencyInput';
import LuxurySelect from '../ui/LuxurySelect';
import IconWrapper from '../ui/IconWrapper';
import { ESTADOS_DATA } from '../../data/estadosData';
import { parseCurrencyValue, formatCurrency, numeroParaExtenso } from '../../utils/formatters';
import { useIsMobile } from '../../hooks/use-mobile';

const PatrimonioForm = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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

  // Função para abreviar valores muito grandes no mobile
  const formatValueForDisplay = (value: number) => {
    if (!isMobile || value < 1000000) {
      return formatCurrency(value);
    }
    
    if (value >= 1000000000) {
      return `R$ ${(value / 1000000000).toFixed(2).replace('.', ',')}B`;
    } else if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(2).replace('.', ',')}M`;
    }
    
    return formatCurrency(value);
  };

  return (
    <div className={isMobile ? 'mobile-container' : ''}>
      <GlassCard className={`fade-in-up ${isMobile ? 'section-mobile' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={isMobile ? 'input-group-mobile' : ''}>
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
          </div>

          <div className={isMobile ? 'input-group-mobile' : ''}>
            <LuxuryCurrencyInput
              label="Valor de Mercado dos Imóveis"
              icon={<IconWrapper icon={Home} size={16} />}
              value={formData.valorImoveis}
              onChange={(value) => handleInputChange('valorImoveis', value)}
              placeholder="R$ 0,00"
              allowDecimals={true}
              hint="Casas, apartamentos, terrenos - pelo valor real de mercado atual (não valor venal)"
            />
          </div>

          <div className={isMobile ? 'input-group-mobile' : ''}>
            <LuxuryCurrencyInput
              label="Valor de Mercado dos Veículos"
              icon={<IconWrapper icon={Car} size={16} />}
              value={formData.valorVeiculos}
              onChange={(value) => handleInputChange('valorVeiculos', value)}
              placeholder="R$ 0,00"
              allowDecimals={true}
              hint="Carros, motos, embarcações - conforme tabela FIPE ou avaliação especializada"
            />
          </div>

          <div className={isMobile ? 'input-group-mobile' : ''}>
            <LuxuryCurrencyInput
              label="Valor de Mercado dos Investimentos"
              icon={<IconWrapper icon={Gem} size={16} />}
              value={formData.valorInvestimentos}
              onChange={(value) => handleInputChange('valorInvestimentos', value)}
              placeholder="R$ 0,00"
              allowDecimals={true}
              hint="Ações, fundos, poupança, joias, obras de arte - valor atual de mercado real"
            />
          </div>

          {/* Total do Patrimônio - Otimizado para Mobile */}
          <div 
            className={`total-patrimonio ${isMobile ? 'highlight-card' : ''}`}
            style={{
              background: isMobile ? 
                'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' :
                'linear-gradient(135deg, rgba(209, 191, 163, 0.1), rgba(245, 239, 235, 0.5))',
              border: isMobile ? 
                '2px solid #e3f2fd' :
                '1px solid rgba(209, 191, 163, 0.3)',
              boxShadow: isMobile ?
                '0 2px 8px rgba(0, 0, 0, 0.06)' :
                '0 4px 16px rgba(209, 191, 163, 0.1)',
              padding: isMobile ? '16px' : '24px',
              borderRadius: '12px'
            }}
          >
            <div className={`value-container ${isMobile ? 'mobile-text' : ''}`}>
              <span 
                className={`${isMobile ? 'mobile-label section-title-mobile' : 'font-semibold text-lg'}`}
                style={{ 
                  color: '#0C2C45',
                  marginBottom: isMobile ? '12px' : '8px',
                  display: 'block',
                  textAlign: isMobile ? 'center' : 'left'
                }}
              >
                Total do Patrimônio (Valor de Mercado):
              </span>
              <span 
                className={`${isMobile ? 'total-value-mobile' : 'font-bold text-2xl'} total-value`}
                style={{ 
                  color: '#0C2C45',
                  display: 'block',
                  wordBreak: 'break-word',
                  textAlign: 'center'
                }}
              >
                {formatValueForDisplay(totalPatrimonio)}
              </span>
              
              {/* Valor completo em mobile se abreviado */}
              {isMobile && totalPatrimonio >= 1000000 && (
                <div 
                  className="text-xs mt-2"
                  style={{ 
                    color: '#476D9E',
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}
                >
                  Valor completo: {formatCurrency(totalPatrimonio)}
                </div>
              )}
            </div>
            
            {/* Valor por extenso - Responsivo */}
            {totalPatrimonio > 0 && (
              <div 
                className={`flex items-start gap-2 mt-3 ${isMobile ? 'mobile-text' : 'text-sm'}`}
                style={{ color: '#476D9E' }}
              >
                <span>💰</span>
                <span className="italic flex-1" style={{ lineHeight: '1.4' }}>
                  "{numeroParaExtenso(totalPatrimonio)}"
                </span>
              </div>
            )}
            
            <div 
              className={`mt-2 ${isMobile ? 'text-xs mobile-text' : 'text-xs'}`} 
              style={{ 
                color: '#476D9E',
                textAlign: isMobile ? 'center' : 'left',
                lineHeight: '1.4'
              }}
            >
              Este será o valor base para cálculo do ITCMD e demais custos
            </div>
          </div>

          {/* Submit Button - Otimizado para Mobile */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`luxury-btn-primary button-mobile touchable w-full font-semibold transition-all`}
            style={{
              background: !isFormValid 
                ? '#E8E2DD' 
                : 'linear-gradient(135deg, #0C2C45, #476D9E)',
              color: !isFormValid ? '#9FB7D4' : '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: isMobile ? '16px 24px' : '18px 24px',
              fontSize: isMobile ? '16px' : '18px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: !isFormValid ? 'not-allowed' : 'pointer',
              boxShadow: !isFormValid 
                ? 'none' 
                : '0 6px 20px rgba(12, 44, 69, 0.2)',
              opacity: !isFormValid ? 0.5 : 1,
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Calcular Custos do Inventário
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default PatrimonioForm;
