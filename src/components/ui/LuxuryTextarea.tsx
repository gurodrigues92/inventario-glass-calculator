import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import LuxuryField from './LuxuryField';

interface LuxuryTextareaProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const LuxuryTextarea = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = ''
}: LuxuryTextareaProps) => {
  return (
    <LuxuryField label={label} icon={icon} className={className}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="text-base font-medium resize-none"
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
    </LuxuryField>
  );
};

export default LuxuryTextarea;
