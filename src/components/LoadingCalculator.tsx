
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
    <div className="max-w-4xl mx-auto">
      {/* Loading Header */}
      <div className="text-center mb-12 fade-in-up">
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

      {/* Skeleton Preview */}
      <div className="space-y-6 opacity-30">
        {/* Resumo Skeleton */}
        <div 
          className="glass-card p-8 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="text-center mb-6">
            <Skeleton className="h-8 w-48 mx-auto mb-4 bg-white/10" />
            <Skeleton className="h-12 w-64 mx-auto bg-white/10" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-24 mx-auto mb-2 bg-white/10" />
                <Skeleton className="h-8 w-32 mx-auto bg-white/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="glass-card p-6 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Skeleton className="h-6 w-32 mb-4 bg-white/10" />
              <Skeleton className="h-8 w-24 mb-2 bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingCalculator;
