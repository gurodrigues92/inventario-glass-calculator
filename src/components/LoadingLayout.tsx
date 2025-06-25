
import React from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface LoadingLayoutProps {
  children: React.ReactNode;
}

const LoadingLayout = ({ children }: LoadingLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className="min-h-screen h-screen bg-animated flex items-center justify-center"
      style={{
        padding: isMobile ? '16px' : '24px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {children}
    </div>
  );
};

export default LoadingLayout;
