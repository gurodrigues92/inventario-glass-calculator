
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconWrapperProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  className?: string;
}

const IconWrapper = ({ icon: Icon, size = 20, color = '#476D9E', className = '' }: IconWrapperProps) => {
  return (
    <Icon 
      size={size} 
      color={color} 
      className={className}
      strokeWidth={1.5}
    />
  );
};

export default IconWrapper;
