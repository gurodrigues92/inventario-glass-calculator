
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
  return (
    <GlassCard className={`min-h-[320px] flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${badgeType === 'fast' ? 'badge-fast' : 'badge-top'}`}>
          {badgeText}
        </div>
      </div>
      
      <div className="flex-1">
        <h3 className="heading-md mb-2">{title}</h3>
        <p className="text-glass mb-6">{subtitle}</p>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-sm text-glass">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button 
        onClick={onClick}
        className="glass-button w-full py-4 text-lg font-semibold"
      >
        {buttonText}
      </button>
    </GlassCard>
  );
};

export default SelectionCard;
