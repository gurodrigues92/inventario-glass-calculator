import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Calculator, Target, TrendingUp, FileCheck, X } from 'lucide-react';

interface HowItWorksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowItWorksDialog = ({ open, onOpenChange }: HowItWorksDialogProps) => {
  const steps = [
    {
      icon: Calculator,
      title: "1. Informações Básicas",
      description: "Informe o estado onde será feito o inventário e os valores do patrimônio (imóveis, veículos, investimentos e outros bens)."
    },
    {
      icon: Target,
      title: "2. Cálculo Automático",
      description: "O sistema calcula automaticamente o ITCMD baseado nas alíquotas reais e atualizadas de cada estado brasileiro."
    },
    {
      icon: TrendingUp,
      title: "3. Análise de Estratégias",
      description: "Compare os custos entre inventário tradicional e holding familiar, vendo a economia potencial de até 90%."
    },
    {
      icon: FileCheck,
      title: "4. Resultados e Ações",
      description: "Receba relatório detalhado, salve seus cálculos e entre em contato com especialistas para implementação."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl border-0 p-0 overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F6F3 100%)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(12, 44, 69, 0.3)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:bg-white/20 z-50"
          style={{ color: '#D1BFA3' }}
        >
          <X size={20} />
        </button>

        <DialogHeader className="p-8 pb-4">
          <DialogTitle 
            className="text-center text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Como Funciona a Calculadora
          </DialogTitle>
          <p 
            className="text-center text-lg mt-4"
            style={{ color: '#476D9E' }}
          >
            Descubra como calcular e otimizar os custos do seu inventário em apenas 4 passos simples
          </p>
        </DialogHeader>

        <div className="p-8 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F6F3 100%)',
                    border: '1px solid #E8E2DD',
                    boxShadow: '0 4px 12px rgba(12, 44, 69, 0.08)'
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <div 
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                        boxShadow: '0 4px 12px rgba(12, 44, 69, 0.2)'
                      }}
                    >
                      <IconComponent size={24} color="#FFFFFF" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold mb-2"
                        style={{ color: '#0C2C45' }}
                      >
                        {step.title}
                      </h3>
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: '#476D9E' }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div 
            className="mt-8 p-6 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
              boxShadow: '0 8px 24px rgba(12, 44, 69, 0.3)'
            }}
          >
            <h4 className="text-xl font-semibold text-white mb-2">
              Pronto para começar?
            </h4>
            <p className="text-white/80 mb-4">
              Calcule gratuitamente os custos do seu inventário com dados reais e atualizados
            </p>
            <button
              onClick={() => onOpenChange(false)}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
                color: '#0C2C45',
                boxShadow: '0 4px 12px rgba(209, 191, 163, 0.3)'
              }}
            >
              Começar Cálculo
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowItWorksDialog;