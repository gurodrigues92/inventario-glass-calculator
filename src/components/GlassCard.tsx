
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  premium?: boolean;
}

const GlassCard = ({ children, className, hover = true, premium = false }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        'glass-card p-8',
        hover && 'hover-lift',
        premium && 'premium-card',
        className
      )}
      style={{
        background: premium 
          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(133, 149, 171, 0.05) 100%)'
          : 'linear-gradient(135deg, rgba(133, 149, 171, 0.05) 0%, rgba(225, 229, 234, 0.02) 100%)',
        backdropFilter: 'blur(20px)',
        border: premium 
          ? '2px solid rgba(255, 215, 0, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        boxShadow: premium
          ? '0 0 30px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: 'rgba(255, 255, 255, 0.95)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {premium && (
        <div 
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 45%, rgba(255, 215, 0, 0.05) 50%, transparent 55%)',
            animation: 'shimmer 4s infinite',
            zIndex: 0
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
