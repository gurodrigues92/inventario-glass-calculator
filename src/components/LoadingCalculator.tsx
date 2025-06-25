
import React from 'react';
import { Calculator, Gem } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingCalculatorProps {
  progress: number;
  message: string;
}

const LoadingCalculator = ({ progress, message }: LoadingCalculatorProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Loading Header */}
      <div className="text-center mb-8 fade-in-up">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                boxShadow: '0 8px 32px rgba(12, 44, 69, 0.3)',
                animation: 'pulse 2s infinite'
              }}
            >
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <div 
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
                animation: 'pulse 1.5s infinite'
              }}
            >
              <Gem className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="heading-lg mb-2">Calculando custos do inventário</h1>
        <p className="text-glass text-lg mb-8">{message}</p>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto">
          <Progress 
            value={progress} 
            className="h-3 mb-4"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <div className="flex justify-between text-sm text-glass">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Skeleton Preview - Compacto */}
      <div className="space-y-4 opacity-30 max-w-3xl mx-auto">
        {/* Resumo Skeleton */}
        <div 
          className="glass-card p-6 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-center mb-4">
            <Skeleton className="h-6 w-32 mx-auto mb-2 bg-white/10" />
            <Skeleton className="h-8 w-48 mx-auto bg-white/10" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-4 w-20 mx-auto mb-1 bg-white/10" />
                <Skeleton className="h-6 w-24 mx-auto bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards Skeleton - Reduzido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div 
              key={i}
              className="glass-card p-4 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Skeleton className="h-5 w-24 mb-2 bg-white/10" />
              <Skeleton className="h-6 w-20 mb-1 bg-white/10" />
              <Skeleton className="h-3 w-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingCalculator;
