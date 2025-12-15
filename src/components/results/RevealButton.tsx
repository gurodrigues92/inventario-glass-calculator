
import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface RevealButtonProps {
  title: string;
  subtitle?: string;
  highlight?: string;
  onClick: () => void;
  variant?: 'primary' | 'success' | 'premium';
  icon?: React.ReactNode;
}

const RevealButton = ({ 
  title, 
  subtitle, 
  highlight,
  onClick, 
  variant = 'primary',
  icon
}: RevealButtonProps) => {
  const isMobile = useIsMobile();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
          boxShadow: '0 4px 20px rgba(39, 174, 96, 0.3)',
          hoverShadow: '0 8px 30px rgba(39, 174, 96, 0.4)'
        };
      case 'premium':
        return {
          background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
          boxShadow: '0 4px 20px rgba(209, 191, 163, 0.3)',
          hoverShadow: '0 8px 30px rgba(209, 191, 163, 0.4)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
          boxShadow: '0 4px 20px rgba(12, 44, 69, 0.3)',
          hoverShadow: '0 8px 30px rgba(12, 44, 69, 0.4)'
        };
    }
  };

  const styles = getVariantStyles();
  const textColor = variant === 'premium' ? '#0C2C45' : '#FFFFFF';

  return (
    <div 
      className={`mt-8 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isMobile ? 'mx-2' : ''}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(209, 191, 163, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClick}
    >
      <div className="text-center mb-4">
        {icon && (
          <div className="mb-3 flex justify-center">
            {icon}
          </div>
        )}
        <h4 
          className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-2`}
          style={{ color: '#0C2C45' }}
        >
          {title}
        </h4>
        {subtitle && (
          <p 
            className={`${isMobile ? 'text-sm' : 'text-sm'} mb-3`}
            style={{ color: '#476D9E' }}
          >
            {subtitle}
          </p>
        )}
        {highlight && (
          <div 
            className={`inline-block ${isMobile ? 'px-3 py-1' : 'px-4 py-1'} rounded-full mb-4`}
            style={{
              background: 'linear-gradient(135deg, #27AE60, #2ECC71)',
              color: 'white',
              fontSize: isMobile ? '11px' : '12px',
              fontWeight: '600'
            }}
          >
            <Sparkles className="inline w-3 h-3 mr-1" />
            {highlight}
          </div>
        )}
      </div>
      
      <button
        className={`w-full ${isMobile ? 'py-3 px-4 text-sm' : 'py-4 px-6 text-base'} font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2`}
        style={{
          background: styles.background,
          color: textColor,
          boxShadow: styles.boxShadow,
          border: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = styles.hoverShadow;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = styles.boxShadow;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <span>{title.includes('Descobrir') ? 'Descobrir como economizar' : title.includes('Conhecer') ? 'Conhecer Holding S/A' : 'Ver comparativo completo'}</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </div>
  );
};

export default RevealButton;
