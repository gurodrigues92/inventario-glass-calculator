
import React from 'react';
import { Input } from '@/components/ui/input';
import LuxuryField from './LuxuryField';
import { formatCurrencyInputWithoutDecimals } from '../../utils/formatters';

interface LuxuryCurrencyInputProps {
  label: string;
  icon?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  hint?: string;
  allowDecimals?: boolean;
}

const LuxuryCurrencyInput = ({ 
  label, 
  icon = '💰', 
  value, 
  onChange, 
  placeholder = 'R$ 0',
  required = false,
  disabled = false,
  className = '',
  error,
  hint,
  allowDecimals = false
}: LuxuryCurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    if (allowDecimals) {
      // Para valores com decimais, permite entrada mais flexível
      inputValue = inputValue.replace(/[^\d,]/g, '');
      
      if (inputValue) {
        // Converte vírgula para ponto temporariamente
        const numericValue = parseFloat(inputValue.replace(',', '.'));
        if (!isNaN(numericValue)) {
          const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(numericValue);
          onChange(formattedValue);
        } else {
          onChange('');
        }
      } else {
        onChange('');
      }
    } else {
      // Para valores sem decimais (comportamento original)
      const formattedValue = formatCurrencyInputWithoutDecimals(inputValue);
      onChange(formattedValue);
    }
  };

  return (
    <LuxuryField label={label} icon={icon} className={className}>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="glass-input text-lg font-semibold"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2DD',
          borderRadius: '8px',
          color: '#2C2C2C',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#9FB7D4';
          e.target.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E8E2DD';
          e.target.style.boxShadow = 'none';
        }}
      />
      
      {error && (
        <p className="text-sm flex items-center gap-2" style={{ color: '#E74C3C' }}>
          <span>⚠️</span>
          {error}
        </p>
      )}
      
      {hint && (
        <div className="text-xs italic" style={{ color: '#476D9E' }}>
          💡 {hint}
        </div>
      )}
    </LuxuryField>
  );
};

export default LuxuryCurrencyInput;
