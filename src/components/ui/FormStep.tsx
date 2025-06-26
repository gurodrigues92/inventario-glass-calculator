
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';

interface FormStepProps {
  title: string;
  subtitle?: string;
  stepNumber: number;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const FormStep = ({ 
  title, 
  subtitle, 
  stepNumber, 
  icon, 
  children,
  className = '' 
}: FormStepProps) => {
  const isMobile = useIsMobile();

  // Cores minimalistas baseadas no step number
  const getStepColors = (stepNum: number) => {
    switch (stepNum) {
      case 1:
      case 2:
        return {
          accent: '#0C2C45', // azul-profundo
          border: '#E8E2DD'  // borda-principal
        };
      case 3:
      case 4:
        return {
          accent: '#476D9E', // azul-medio
          border: '#E8E2DD'  // borda-principal
        };
      case 5:
        return {
          accent: '#D1BFA3', // dourado-suave
          border: '#D1BFA3'  // borda-dourada
        };
      default:
        return {
          accent: '#0C2C45',
          border: '#E8E2DD'
        };
    }
  };

  const colors = getStepColors(stepNumber);

  return (
    <div 
      className={`form-step-container ${className} ${isMobile ? 'mobile-form-step' : ''}`}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 249, 250, 0.9) 100%)',
        border: `1px solid ${colors.border}`,
        borderRadius: '16px',
        padding: isMobile ? '20px' : '32px',
        marginBottom: isMobile ? '20px' : '32px',
        boxShadow: '0 4px 16px rgba(12, 44, 69, 0.06)',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Accent bar minimalista */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: colors.accent,
          opacity: 0.7
        }}
      />
      
      {/* Step Header */}
      <div className={`step-header ${isMobile ? 'mobile-step-header' : 'flex items-center gap-4'} mb-6`}>
        <div 
          className="step-number"
          style={{
            background: colors.accent,
            color: '#FFFFFF',
            width: isMobile ? '40px' : '48px',
            height: isMobile ? '40px' : '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600',
            boxShadow: `0 2px 8px ${colors.accent}20`
          }}
        >
          {stepNumber}
        </div>
        
        <div className={`step-icon ${isMobile ? 'mobile-step-icon' : ''}`} style={{ color: colors.accent, fontSize: '24px' }}>
          {icon}
        </div>
        
        <div className="step-text flex-1">
          <h3 
            className={`step-title ${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-1`}
            style={{ color: colors.accent }}
          >
            {title}
          </h3>
          {subtitle && (
            <p 
              className={`step-subtitle ${isMobile ? 'text-sm' : 'text-base'}`}
              style={{ color: '#476D9E', opacity: 0.8 }}
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
