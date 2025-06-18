
import React from 'react';
import Header from './Header';

interface ResultsPageLayoutProps {
  children: React.ReactNode;
}

const ResultsPageLayout = ({ children }: ResultsPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-animated">
      <Header />
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default ResultsPageLayout;
