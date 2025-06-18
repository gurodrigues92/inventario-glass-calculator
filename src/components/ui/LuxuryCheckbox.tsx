
import React from 'react';
import LuxuryField from './LuxuryField';

interface LuxuryCheckboxProps {
  label: string;
  icon?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  description?: string;
}

const LuxuryCheckbox = ({ 
  label, 
  icon, 
  checked, 
  onChange, 
  disabled = false,
  className = '',
  description
}: LuxuryCheckboxProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label 
        className="luxury-checkbox-card cursor-pointer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(26, 26, 26, 0.7)',
          border: '1px solid rgba(133, 149, 171, 0.3)',
          borderRadius: '12px',
          padding: '16px 20px',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)';
          e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(133, 149, 171, 0.3)';
          e.currentTarget.style.background = 'rgba(26, 26, 26, 0.7)';
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="luxury-checkbox"
          style={{
            width: '18px',
            height: '18px',
            accentColor: '#FFD700',
            cursor: 'pointer'
          }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-white font-medium">
            {icon && <span>{icon}</span>}
            {label}
          </div>
          {description && (
            <div className="text-xs text-purple-300 mt-1">{description}</div>
          )}
        </div>
      </label>
    </div>
  );
};

export default LuxuryCheckbox;
