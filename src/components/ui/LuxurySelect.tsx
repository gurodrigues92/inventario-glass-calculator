
import React from 'react';
import LuxuryField from './LuxuryField';

interface LuxurySelectProps {
  label: string;
  icon?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  hint?: string;
}

const LuxurySelect = ({ 
  label, 
  icon, 
  value, 
  onChange, 
  options,
  placeholder = 'Selecione...',
  required = false,
  disabled = false,
  className = '',
  error,
  hint
}: LuxurySelectProps) => {
  return (
    <LuxuryField label={label} icon={icon} className={className}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full"
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E2DD',
          borderRadius: '8px',
          color: '#2C2C2C',
          padding: '16px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          appearance: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%23476D9E' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
          paddingRight: '40px'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#9FB7D4';
          e.target.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#E8E2DD';
          e.target.style.boxShadow = 'none';
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            style={{
              background: '#FFFFFF',
              color: '#2C2C2C'
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
      
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

export default LuxurySelect;
