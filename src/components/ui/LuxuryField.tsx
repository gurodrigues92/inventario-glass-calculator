
import React from 'react';

interface LuxuryFieldProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const LuxuryField = ({ label, icon, children, className = '' }: LuxuryFieldProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <label 
        className="label-luxury"
        style={{
          color: '#0C2C45',
          fontSize: '14px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {icon && <span style={{ color: '#476D9E' }}>{icon}</span>} {label}
        <div 
          style={{
            height: '1px',
            flex: '1',
            background: 'linear-gradient(to right, rgba(209, 191, 163, 0.3), transparent)'
          }}
        />
      </label>
      {children}
    </div>
  );
};

export default LuxuryField;
