
import React from 'react';
import { Check } from 'lucide-react';

interface SelectionCardProps {
  title: string;
  subtitle: string;
  badgeText: string;
  badgeType: 'fast' | 'top';
  features: string[];
  buttonText: string;
  onClick: () => void;
  className?: string;
}

const SelectionCard = ({
  title,
  subtitle,
  badgeText,
  badgeType,
  features,
  buttonText,
  onClick,
  className
}: SelectionCardProps) => {
  const badgeStyles = badgeType === 'fast' 
    ? {
        background: 'linear-gradient(135deg, #10B981, #059669)',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em'
      }
    : {
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
        color: '#1a1a1a',
        padding: '8px 20px',
        borderRadius: '25px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
        animation: 'pulse-gold 2s infinite'
      };

  return (
    <div 
      className={`selection-card min-h-[400px] flex flex-col hover-lift ${className || ''}`}
      style={{
        background: 'linear-gradient(135deg, rgba(133, 149, 171, 0.05) 0%, rgba(225, 229, 234, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(133, 149, 171, 0.2)',
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Shimmer Effect */}
      <div 
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent 45%, rgba(255, 215, 0, 0.05) 50%, transparent 55%)',
          animation: 'shimmer 6s infinite',
          zIndex: 0
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Badge */}
        <div className="flex items-center justify-between mb-6">
          <div style={badgeStyles}>
            {badgeText}
          </div>
        </div>
        
        {/* Card Icon */}
        <div 
          style={{
            width: '64px',
            height: '64px',
            background: 'rgba(255, 215, 0, 0.1)',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '24px'
          }}
        >
          ⚖️
        </div>
        
        {/* Title and Content */}
        <div className="flex-1">
          <h3 
            className="text-card-title mb-3"
            style={{ fontSize: '28px', color: '#ffffff', fontWeight: '600', marginBottom: '12px' }}
          >
            {title}
          </h3>
          <p 
            className="text-subtitle mb-6"
            style={{ color: 'rgba(164, 176, 192, 1)', fontSize: '16px', marginBottom: '24px' }}
          >
            {subtitle}
          </p>
          
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Check className="w-3 h-3 text-green-400" />
                </div>
                <span 
                  className="text-sm"
                  style={{ color: 'rgba(194, 202, 213, 1)', fontSize: '14px' }}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Button */}
        <button 
          onClick={onClick}
          className="btn-select w-full py-4 text-lg font-semibold"
          style={{
            width: '100%',
            padding: '16px 32px',
            background: 'transparent',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            color: '#FFD700',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)';
            e.currentTarget.style.color = '#1a1a1a';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#FFD700';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SelectionCard;
