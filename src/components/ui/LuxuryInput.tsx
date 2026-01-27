
import React from 'react';
import { Input } from '@/components/ui/input';
import LuxuryField from './LuxuryField';

interface LuxuryInputProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  hint?: string;
}

const LuxuryInput = ({ 
  label, 
  icon, 
  value, 
  onChange, 
  placeholder, 
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  error,
  hint
}: LuxuryInputProps) => {
  return (
    <LuxuryField label={label} icon={icon} className={className}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="text-base font-medium"
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
          e.currentTarget.style.borderColor = '#9FB7D4';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(159, 183, 212, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#E8E2DD';
          e.currentTarget.style.boxShadow = 'none';
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

export default LuxuryInput;
