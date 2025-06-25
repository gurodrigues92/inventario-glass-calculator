
import React from 'react';

interface LoadingLayoutProps {
  children: React.ReactNode;
}

const LoadingLayout = ({ children }: LoadingLayoutProps) => {
  return (
    <div className="min-h-screen h-screen bg-animated flex items-center justify-center p-6">
      {children}
    </div>
  );
};

export default LoadingLayout;
