
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
          background: 'rgba(26, 26, 26, 0.7)',
          border: '1px solid rgba(133, 149, 171, 0.3)',
          borderRadius: '12px',
          color: '#e1e5ea',
          padding: '20px',
          fontSize: '18px',
          fontWeight: '600',
          transition: 'all 0.3s ease'
        }}
      />
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </p>
      )}
      
      {hint && (
        <div className="text-xs text-purple-300 italic">
          💡 {hint}
        </div>
      )}
    </LuxuryField>
  );
};

export default LuxuryCurrencyInput;
