
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import LuxuryField from './LuxuryField';
import { formatSmartCurrencyInput } from '../../utils/formatters';

interface LuxuryCurrencyInputProps {
  label: string;
  icon?: React.ReactNode;
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
  icon, 
  value, 
  onChange, 
  placeholder = 'Ex: 500.000,00',
  required = false,
  disabled = false,
  className = '',
  error,
  hint,
  allowDecimals = false
}: LuxuryCurrencyInputProps) => {
  const [rawInput, setRawInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRawInput(inputValue);
    
    // Durante a digitação, permite entrada mais livre
    if (isFocused) {
      // Apenas remove caracteres completamente inválidos
      const cleanInput = inputValue.replace(/[^\d,\.\s]/g, '');
      if (cleanInput !== inputValue) {
        setRawInput(cleanInput);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Quando sai do campo, formata o valor
    const formattedValue = formatSmartCurrencyInput(rawInput || value, allowDecimals);
    if (formattedValue) {
      onChange(formattedValue);
      setRawInput('');
    } else if (rawInput === '') {
      onChange('');
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Quando foca, mostra valor sem formatação para facilitar edição
    if (value && !rawInput) {
      const unformatted = value.replace(/R\$\s?/, '').replace(/\./g, '');
      setRawInput(unformatted);
    }
    
    e.target.style.borderColor = '#9FB7D4';
    e.target.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite Enter para formatar imediatamente
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  // Mostra rawInput durante edição, value formatado quando não está editando
  const displayValue = isFocused ? rawInput : value;

  return (
    <LuxuryField label={label} icon={icon} className={className}>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
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
        onBlur={(e) => {
          handleBlur();
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
      
      <div className="text-xs mt-1" style={{ color: '#9FB7D4' }}>
        {allowDecimals ? 
          'Digite naturalmente: 500000, 500.000, 500000,50 ou 500.000,50' : 
          'Digite apenas números: 500000 ou 500.000'
        }
      </div>
    </LuxuryField>
  );
};

export default LuxuryCurrencyInput;
