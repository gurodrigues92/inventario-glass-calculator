
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className, hover = true }: GlassCardProps) => {
  return (
    <div className={cn(
      'glass-card p-8',
      hover && 'hover:shadow-glow hover:-translate-y-1',
      className
    )}>
      {children}
    </div>
  );
};

export default GlassCard;
