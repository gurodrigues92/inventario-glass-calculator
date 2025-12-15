
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

export default LuxuryInput;
