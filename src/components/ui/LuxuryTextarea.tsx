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
        className="glass-input text-base font-medium resize-none"
        style={{
          background: 'rgba(26, 26, 26, 0.7)',
          border: '1px solid rgba(133, 149, 171, 0.3)',
          borderRadius: '12px',
          color: '#e1e5ea',
          padding: '16px 20px',
          fontSize: '16px',
          fontWeight: '500',
          transition: 'all 0.3s ease'
        }}
      />
    </LuxuryField>
  );
};

export default LuxuryTextarea;
