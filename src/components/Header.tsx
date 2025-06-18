
import React from 'react';

const Header = () => {
  return (
    <header 
      className="glass-header fixed top-0 left-0 right-0 z-50 px-6 py-4"
      style={{
        background: 'rgba(133, 149, 171, 0.08)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">💎</div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">Inventário</h1>
            <span className="text-sm text-purple-300 font-medium">DESCOMPLICADO</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-glass hover:text-white transition-colors">
            Como funciona
          </a>
          <a href="#" className="text-glass hover:text-white transition-colors">
            Contato
          </a>
          <button 
            className="glass-button px-6 py-2 text-sm"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              border: 'none',
              borderRadius: '16px',
              color: '#1a1a1a',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
            }}
          >
            Falar com especialista
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
