import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Home, Car, Gem, Calculator } from 'lucide-react';
import GlassCard from '../GlassCard';
import LuxuryCurrencyInput from '../ui/LuxuryCurrencyInput';
import LuxurySelect from '../ui/LuxurySelect';
import IconWrapper from '../ui/IconWrapper';
import FormStep from '../ui/FormStep';
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
    valorInvestimentos: '',
    patrimonioHistoricoIR: ''
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
      patrimonioAtualMercado: formatCurrency(totalPatrimonio), // Valor atual de mercado
      patrimonioHistoricoIR: formData.patrimonioHistoricoIR || '0', // Valor histórico IR
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
    <div>
      <GlassCard className={`fade-in-up p-4 md:p-8`}>
        <form onSubmit={handleSubmit} className="space-y-0">
          
          {/* Etapa 1: Localização */}
          <FormStep
            stepNumber={1}
            title="Localização"
            subtitle="Informe seu estado para calcular o ITCMD correto"
            icon={<MapPin size={24} />}
          >
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
          </FormStep>

          {/* Etapa 2: Patrimônio - Imóveis */}
          <FormStep
            stepNumber={2}
            title="Imóveis"
            subtitle="Casas, apartamentos, terrenos - valor real de mercado"
            icon={<Home size={24} />}
          >
            <LuxuryCurrencyInput
              label="Valor de Mercado dos Imóveis"
              icon={<IconWrapper icon={Home} size={16} />}
              value={formData.valorImoveis}
              onChange={(value) => handleInputChange('valorImoveis', value)}
              placeholder="R$ 0,00"
              allowDecimals={true}
              hint="Casas, apartamentos, terrenos - pelo valor real de mercado atual (não valor venal)"
            />
          </FormStep>

          {/* Etapa 3: Patrimônio - Veículos */}
          <FormStep
            stepNumber={3}
            title="Veículos"
            subtitle="Carros, motos, embarcações - conforme tabela FIPE"
            icon={<Car size={24} />}
          >
            <LuxuryCurrencyInput
              label="Valor de Mercado dos Veículos"
              icon={<IconWrapper icon={Car} size={16} />}
              value={formData.valorVeiculos}
              onChange={(value) => handleInputChange('valorVeiculos', value)}
              placeholder="R$ 0,00"
              allowDecimals={true}
              hint="Carros, motos, embarcações - conforme tabela FIPE ou avaliação especializada"
            />
          </FormStep>

          {/* Etapa 4: Patrimônio - Investimentos */}
          <FormStep
            stepNumber={4}
            title="Investimentos"
            subtitle="Ações, fundos, poupança, joias, obras de arte"
            icon={<Gem size={24} />}
          >
            <LuxuryCurrencyInput
              label="Valor de Mercado dos Investimentos"
              icon={<IconWrapper icon={Gem} size={16} />}
              value={formData.valorInvestimentos}
              onChange={(value) => handleInputChange('valorInvestimentos', value)}
              placeholder="R$ 0,00"
              allowDecimals={true}
              hint="Ações, fundos, poupança, joias, obras de arte - valor atual de mercado real"
            />
          </FormStep>

          {/* Etapa 5: Patrimônio Histórico IR */}
          <FormStep
            stepNumber={5}
            title="Patrimônio Histórico (IR)"
            subtitle="Valor declarado no Imposto de Renda - opcional"
            icon={<Calculator size={24} />}
          >
            <LuxuryCurrencyInput
              label="Valor do Patrimônio no IR (Opcional)"
              icon={<IconWrapper icon={Calculator} size={16} />}
              value={formData.patrimonioHistoricoIR}
              onChange={(value) => handleInputChange('patrimonioHistoricoIR', value)}
              placeholder="R$ 0,00"
              allowDecimals={true}
              hint="Se informado, será usado para calcular o Ganho de Capital (15%). Se não informado, não haverá cobrança de Ganho de Capital."
            />
          </FormStep>

          {/* Etapa 6: Resumo */}
          <FormStep
            stepNumber={6}
            title="Resumo do Patrimônio"
            subtitle="Total calculado automaticamente"
            icon={<Calculator size={24} />}
          >
            {/* Total do Patrimônio - Otimizado para Mobile */}
            <div 
              className={`total-patrimonio ${isMobile ? 'highlight-card' : ''}`}
              style={{
                background: isMobile ? 
                  'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)' :
                  'linear-gradient(135deg, rgba(209, 191, 163, 0.1), rgba(245, 239, 235, 0.5))',
                border: isMobile ? 
                  '2px solid #D1BFA3' :
                  '1px solid rgba(209, 191, 163, 0.3)',
                boxShadow: isMobile ?
                  '0 2px 8px rgba(0, 0, 0, 0.06)' :
                  '0 4px 16px rgba(209, 191, 163, 0.1)',
                padding: isMobile ? '20px' : '28px',
                borderRadius: '12px'
              }}
            >
              <div className={`value-container ${isMobile ? 'mobile-text' : ''}`}>
                <span 
                  className={`${isMobile ? 'mobile-label section-title-mobile' : 'font-semibold text-lg'}`}
                  style={{ 
                    color: '#D1BFA3',
                    marginBottom: isMobile ? '12px' : '8px',
                    display: 'block',
                    textAlign: 'center'
                  }}
                >
                  Total do Patrimônio (Valor de Mercado):
                </span>
                <span 
                  className={`${isMobile ? 'total-value-mobile' : 'font-bold text-2xl'} total-value`}
                  style={{ 
                    color: '#D1BFA3',
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
                      color: '#C2410C',
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
                  style={{ color: '#C2410C' }}
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
                  color: '#C2410C',
                  textAlign: 'center',
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
              className={`luxury-btn-primary button-mobile touchable w-full font-semibold transition-all mt-6`}
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
                  : '0 6px 20px rgba(12, 44, 69, 0.3)',
                opacity: !isFormValid ? 0.5 : 1,
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Calcular Custos do Inventário
            </button>
          </FormStep>
        </form>
      </GlassCard>
    </div>
  );
};

export default PatrimonioForm;
