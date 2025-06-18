
import React from 'react';

interface LuxuryFieldProps {
  label: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

const LuxuryField = ({ label, icon, children, className = '' }: LuxuryFieldProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label 
        className="label-luxury"
        style={{
          color: '#c2cad5',
          fontSize: '14px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {icon && <span>{icon}</span>} {label}
        <div 
          style={{
            height: '1px',
            flex: '1',
            background: 'linear-gradient(to right, rgba(255, 215, 0, 0.3), transparent)'
          }}
        />
      </label>
      {children}
    </div>
  );
};

export default LuxuryField;
