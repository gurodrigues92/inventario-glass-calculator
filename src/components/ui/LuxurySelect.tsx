
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
          background: 'rgba(26, 26, 26, 0.7)',
          border: '1px solid rgba(133, 149, 171, 0.3)',
          borderRadius: '12px',
          color: '#e1e5ea',
          padding: '20px',
          fontSize: '18px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          appearance: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath fill='%23FFD700' d='M6 8L0 0h12z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 20px center',
          paddingRight: '48px'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'rgba(255, 215, 0, 0.5)';
          e.target.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(133, 149, 171, 0.3)';
          e.target.style.boxShadow = 'none';
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value}
            style={{
              background: '#1a1a1a',
              color: '#e1e5ea'
            }}
          >
            {option.label}
          </option>
        ))}
      </select>
      
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

export default LuxurySelect;
