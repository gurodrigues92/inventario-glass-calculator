
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
  premium?: boolean;
}

const GlassCard = ({ children, className, style, hover = true, premium = false }: GlassCardProps) => {
  const defaultStyle = {
    background: premium 
      ? 'linear-gradient(135deg, rgba(209, 191, 163, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)'
      : '#FFFFFF',
    backdropFilter: 'blur(10px)',
    border: premium 
      ? '2px solid rgba(209, 191, 163, 0.4)'
      : '1px solid #E8E2DD',
    borderRadius: '16px',
    boxShadow: premium
      ? '0 8px 24px rgba(209, 191, 163, 0.2), 0 4px 16px rgba(12, 44, 69, 0.1)'
      : '0 4px 16px rgba(12, 44, 69, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    color: '#2C2C2C',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const mergedStyle = { ...defaultStyle, ...style };

  return (
    <div 
      className={cn(
        'glass-card p-6',
        hover && 'hover-lift',
        premium && 'premium-card',
        className
      )}
      style={mergedStyle}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = premium
          ? '0 12px 32px rgba(209, 191, 163, 0.3), 0 8px 24px rgba(12, 44, 69, 0.15)'
          : '0 8px 24px rgba(12, 44, 69, 0.12)';
        e.currentTarget.style.borderColor = premium ? 'rgba(209, 191, 163, 0.6)' : '#9FB7D4';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = premium
          ? '0 8px 24px rgba(209, 191, 163, 0.2), 0 4px 16px rgba(12, 44, 69, 0.1)'
          : '0 4px 16px rgba(12, 44, 69, 0.08)';
        e.currentTarget.style.borderColor = premium ? 'rgba(209, 191, 163, 0.4)' : '#E8E2DD';
      } : undefined}
    >
      {premium && (
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 45%, rgba(209, 191, 163, 0.05) 50%, transparent 55%)',
            animation: 'shimmer 4s infinite',
            zIndex: 0
          }}
        />
      )}
      {children}
    </div>
  );
};

export default GlassCard;
