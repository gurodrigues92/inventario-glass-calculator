
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import LuxuryField from './LuxuryField';
import { formatCurrencyInput, formatCurrencyInputWithoutDecimals } from '../../utils/formatters';

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
  allowDecimals = true
}: LuxuryCurrencyInputProps) => {
  const [rawInput, setRawInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setRawInput(inputValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    // Format the currency value
    let formattedValue = '';
    if (rawInput || value) {
      const inputToFormat = rawInput || value;
      if (allowDecimals) {
        formattedValue = formatCurrencyInput(inputToFormat);
      } else {
        formattedValue = formatCurrencyInputWithoutDecimals(inputToFormat);
      }
    }
    
    onChange(formattedValue);
    setRawInput('');
    
    // Reset border styling
    e.target.style.borderColor = '#E8E2DD';
    e.target.style.boxShadow = 'none';
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    
    // Show unformatted value for easier editing
    if (value && !rawInput) {
      const unformatted = value.replace(/R\$\s?/, '').replace(/\./g, '');
      setRawInput(unformatted);
    }
    
    // Apply focus styling
    e.target.style.borderColor = '#9FB7D4';
    e.target.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow Enter to format immediately
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
    
    // Allow only numbers, comma, period, and navigation keys
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    const isNumber = /[0-9]/.test(e.key);
    const isDecimalSeparator = e.key === ',' || e.key === '.';
    
    if (!allowedKeys.includes(e.key) && !isNumber && !isDecimalSeparator) {
      e.preventDefault();
    }
  };

  // Show rawInput during editing, formatted value when not editing
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
