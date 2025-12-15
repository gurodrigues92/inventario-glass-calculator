import React from 'react';
import LuxuryField from './LuxuryField';

interface RadioOption {
  value: string;
  label: string;
}

interface LuxuryRadioGroupProps {
  label: string;
  icon?: React.ReactNode;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const LuxuryRadioGroup = ({
  label,
  icon,
  options,
  value,
  onChange,
  className = '',
  orientation = 'horizontal'
}: LuxuryRadioGroupProps) => {
  return (
    <LuxuryField label={label} icon={icon} className={className}>
      <div className={`flex ${orientation === 'vertical' ? 'flex-col gap-3' : 'flex-wrap gap-4'}`}>
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center gap-3 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300
              ${value === option.value 
                ? 'bg-primary/20 border-2 border-primary shadow-lg' 
                : 'bg-card/50 border-2 border-border/30 hover:border-primary/50 hover:bg-card/70'
              }
            `}
            style={{ minWidth: orientation === 'horizontal' ? '140px' : 'auto' }}
          >
            <div className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
              ${value === option.value 
                ? 'border-primary bg-primary' 
                : 'border-muted-foreground/50'
              }
            `}>
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </div>
            <span className={`
              text-base font-medium transition-colors duration-300
              ${value === option.value ? 'text-foreground' : 'text-muted-foreground'}
            `}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </LuxuryField>
  );
};

export default LuxuryRadioGroup;
