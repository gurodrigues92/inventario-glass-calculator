
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import LuxuryField from './LuxuryField';
import { formatCurrencyAsTyping, formatSmartCurrencyInput } from '../../utils/formatters';
import { useIsMobile } from '../../hooks/use-mobile';

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
  const [isFocused, setIsFocused] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Formatação em tempo real durante a digitação
    const formattedValue = formatCurrencyAsTyping(inputValue, allowDecimals);
    onChange(formattedValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    
    // Formatação final mais robusta no blur
    if (value) {
      const finalFormatted = formatSmartCurrencyInput(value, allowDecimals);
      if (finalFormatted !== value) {
        onChange(finalFormatted);
      }
    }
    
    // Reset border styling
    if (isMobile) {
      e.target.style.borderColor = '#E0E0E0';
      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
    } else {
      e.target.style.borderColor = '#E8E2DD';
      e.target.style.boxShadow = 'none';
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    
    // Apply focus styling - mobile optimized
    if (isMobile) {
      e.target.style.borderColor = '#2196F3';
      e.target.style.boxShadow = '0 0 0 3px rgba(33, 150, 243, 0.1)';
    } else {
      e.target.style.borderColor = '#9FB7D4';
      e.target.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
    }
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

  // O valor já está formatado em tempo real
  const displayValue = value;

  return (
    <LuxuryField label={label} icon={icon} className={className}>
      <Input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${isMobile ? 'input-field-mobile' : 'glass-input'} text-lg font-semibold`}
        style={{
          background: '#FFFFFF',
          border: isMobile ? '2px solid #E0E0E0' : '1px solid #E8E2DD',
          borderRadius: isMobile ? '8px' : '8px',
          color: '#2C2C2C',
          padding: isMobile ? '16px' : '16px',
          fontSize: '16px',
          fontWeight: '500',
          minHeight: isMobile ? '48px' : 'auto',
          transition: 'all 0.3s ease',
          boxShadow: isMobile ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
          boxSizing: 'border-box'
        }}
      />
      
      {error && (
        <p className={`${isMobile ? 'mobile-text' : 'text-sm'} flex items-center gap-2`} style={{ color: '#E74C3C' }}>
          <span>⚠️</span>
          {error}
        </p>
      )}
      
      {hint && (
        <div className={`${isMobile ? 'text-xs mobile-text' : 'text-xs'} italic`} style={{ color: '#476D9E', lineHeight: '1.4' }}>
          💡 {hint}
        </div>
      )}
      
      <div className={`${isMobile ? 'text-xs mobile-text' : 'text-xs'} mt-1`} style={{ color: '#9FB7D4', lineHeight: '1.4' }}>
        {allowDecimals ? 
          'Digite naturalmente: 500000, 500.000, 500000,50 ou 500.000,50' : 
          'Digite apenas números: 500000 ou 500.000'
        }
      </div>
    </LuxuryField>
  );
};

export default LuxuryCurrencyInput;
