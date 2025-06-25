
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';

interface FormStepProps {
  title: string;
  subtitle?: string;
  stepNumber: number;
  icon: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string;
  borderColor?: string;
  className?: string;
}

const FormStep = ({ 
  title, 
  subtitle, 
  stepNumber, 
  icon, 
  children, 
  accentColor = '#0C2C45',
  borderColor = '#E8E2DD',
  className = '' 
}: FormStepProps) => {
  const isMobile = useIsMobile();

  return (
    <div 
      className={`form-step-container ${className} ${isMobile ? 'mobile-form-step' : ''}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
        border: `2px solid ${borderColor}`,
        borderRadius: '16px',
        padding: isMobile ? '20px' : '32px',
        marginBottom: isMobile ? '20px' : '32px',
        boxShadow: '0 8px 32px rgba(12, 44, 69, 0.08)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Accent bar */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`
        }}
      />
      
      {/* Step Header */}
      <div className={`step-header ${isMobile ? 'mobile-step-header' : 'flex items-center gap-4'} mb-6`}>
        <div 
          className="step-number"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)`,
            color: '#FFFFFF',
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '700',
            boxShadow: `0 4px 16px ${accentColor}40`
          }}
        >
          {stepNumber}
        </div>
        
        <div className={`step-icon ${isMobile ? 'mobile-step-icon' : ''}`} style={{ color: accentColor, fontSize: '24px' }}>
          {icon}
        </div>
        
        <div className="step-text flex-1">
          <h3 
            className={`step-title ${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-1`}
            style={{ color: accentColor }}
          >
            {title}
          </h3>
          {subtitle && (
            <p 
              className={`step-subtitle ${isMobile ? 'text-sm' : 'text-base'}`}
              style={{ color: '#476D9E' }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Step Content */}
      <div className="step-content">
        {children}
      </div>
    </div>
  );
};

export default FormStep;
