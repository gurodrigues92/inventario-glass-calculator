
import React from 'react';
import { Check } from 'lucide-react';
import GlassCard from './GlassCard';

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
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: '600',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
      }
    : {
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
        color: '#1a1a1a',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
        animation: 'pulse-gold 2s infinite'
      };

  return (
    <div 
      className={`min-h-[320px] flex flex-col glass-card ${className || ''}`}
      style={{
        background: 'linear-gradient(135deg, rgba(133, 149, 171, 0.05) 0%, rgba(225, 229, 234, 0.03) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: 'rgba(255, 255, 255, 0.95)',
        padding: '2rem'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div style={badgeStyles}>
          {badgeText}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 
          className="text-3xl font-semibold mb-2"
          style={{ color: 'rgba(255, 255, 255, 0.95)' }}
        >
          {title}
        </h3>
        <p 
          className="mb-6"
          style={{ color: 'rgba(255, 255, 255, 0.7)' }}
        >
          {subtitle}
        </p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <span 
                className="text-sm"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <button 
        onClick={onClick}
        className="glass-button w-full py-4 text-lg font-semibold"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          border: 'none',
          borderRadius: '16px',
          color: '#1a1a1a',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SelectionCard;
