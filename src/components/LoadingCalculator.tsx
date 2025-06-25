
import React from 'react';
import { Calculator, Gem } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '../hooks/use-mobile';

interface LoadingCalculatorProps {
  progress: number;
  message: string;
}

const LoadingCalculator = ({ progress, message }: LoadingCalculatorProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`w-full max-w-4xl mx-auto ${isMobile ? 'mobile-container px-4' : 'px-4'}`}>
      {/* Loading Header */}
      <div className={`text-center fade-in-up ${isMobile ? 'mb-6' : 'mb-8'}`}>
        <div className={`flex items-center justify-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
          <div className="relative">
            <div 
              className="rounded-2xl flex items-center justify-center"
              style={{
                width: isMobile ? '56px' : '80px',
                height: isMobile ? '56px' : '80px',
                background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                boxShadow: '0 8px 32px rgba(12, 44, 69, 0.3)',
                animation: 'pulse 2s infinite'
              }}
            >
              <Calculator className={`text-white ${isMobile ? 'w-7 h-7' : 'w-10 h-10'}`} />
            </div>
            <div 
              className="absolute -top-1 -right-1 md:-top-2 md:-right-2 rounded-full flex items-center justify-center"
              style={{
                width: isMobile ? '24px' : '32px',
                height: isMobile ? '24px' : '32px',
                background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
                animation: 'pulse 1.5s infinite'
              }}
            >
              <Gem className={`text-white ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
            </div>
          </div>
        </div>
        
        <h1 
          className={`font-bold mb-2 ${isMobile ? 'text-2xl mobile-text' : 'text-4xl'}`} 
          style={{ 
            color: '#FFFFFF',
            lineHeight: isMobile ? '1.3' : '1.2',
            wordBreak: 'break-word'
          }}
        >
          Calculando custos do inventário
        </h1>
        <p 
          className={`text-glass ${isMobile ? 'text-base mobile-text px-4 mb-6' : 'text-lg mb-8'}`}
          style={{ lineHeight: '1.5' }}
        >
          {message}
        </p>
        
        {/* Progress Bar */}
        <div className={`mx-auto ${isMobile ? 'max-w-xs' : 'max-w-md'}`}>
          <Progress 
            value={progress} 
            className={`mb-4 ${isMobile ? 'h-2' : 'h-3'}`}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div className={`flex justify-between text-glass ${isMobile ? 'text-xs mobile-text' : 'text-sm'}`}>
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Skeleton Preview - Responsivo */}
      <div className={`space-y-3 md:space-y-4 opacity-30 mx-auto ${isMobile ? 'max-w-sm' : 'max-w-3xl'}`}>
        {/* Resumo Skeleton */}
        <div 
          className={`glass-card rounded-2xl ${isMobile ? 'section-mobile p-4' : 'p-6'}`}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className={`text-center ${isMobile ? 'mb-3' : 'mb-4'}`}>
            <Skeleton className={`mx-auto mb-2 bg-white/10 ${isMobile ? 'h-4 w-24' : 'h-6 w-32'}`} />
            <Skeleton className={`mx-auto bg-white/10 ${isMobile ? 'h-6 w-32' : 'h-8 w-48'}`} />
          </div>
          
          <div className={`grid gap-3 md:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className={`mx-auto mb-1 bg-white/10 ${isMobile ? 'h-3 w-16' : 'h-4 w-20'}`} />
                <Skeleton className={`mx-auto bg-white/10 ${isMobile ? 'h-5 w-20' : 'h-6 w-24'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Cards Skeleton - Responsivo */}
        <div className={`grid gap-3 md:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {[1, 2].map((i) => (
            <div 
              key={i}
              className={`glass-card rounded-2xl ${isMobile ? 'section-mobile p-3' : 'p-4'}`}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Skeleton className={`mb-2 bg-white/10 ${isMobile ? 'h-4 w-20' : 'h-5 w-24'}`} />
              <Skeleton className={`mb-1 bg-white/10 ${isMobile ? 'h-5 w-16' : 'h-6 w-20'}`} />
              <Skeleton className={`w-full bg-white/10 ${isMobile ? 'h-2' : 'h-3'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingCalculator;
