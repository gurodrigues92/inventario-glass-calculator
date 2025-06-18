
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className, hover = true }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        'glass-card p-8',
        hover && 'hover:shadow-glow hover:-translate-y-1',
        className
      )}
      style={{
        background: 'linear-gradient(135deg, rgba(133, 149, 171, 0.05) 0%, rgba(225, 229, 234, 0.03) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: 'rgba(255, 255, 255, 0.95)'
      }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
