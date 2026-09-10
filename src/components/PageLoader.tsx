import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-animated">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Carregando...</p>
      </div>
    </div>
  );
};

export default PageLoader;
