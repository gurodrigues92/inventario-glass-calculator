
import React from 'react';

interface BreakdownCardProps {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  color: 'purple' | 'green' | 'blue' | 'orange';
}

const BreakdownCard = ({ icon, label, value, subtitle, color }: BreakdownCardProps) => {
  const colorClasses = {
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    orange: 'from-orange-500 to-red-500'
  };

  return (
    <div className="glass-card p-6 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <div className={`text-2xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent mb-2`}>
        {value}
      </div>
      <h3 className="font-semibold text-white mb-1">{label}</h3>
      <p className="text-xs text-glass">{subtitle}</p>
    </div>
  );
};

export default BreakdownCard;
