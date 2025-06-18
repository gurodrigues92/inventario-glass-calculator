
import React from 'react';

const Header = () => {
  return (
    <header 
      className="header-luxury fixed top-0 left-0 right-0 z-50 px-6 py-6"
      style={{
        background: 'rgba(26, 26, 26, 0.98)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="logo-diamond"
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #FFD700, #B8860B)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
              transform: 'rotate(45deg)',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ transform: 'rotate(-45deg)' }}>💎</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white tracking-wide">Inventário</h1>
            <span 
              className="text-sm font-bold tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              DESCOMPLICADO
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#" 
            className="text-glass hover:text-white transition-all duration-300 font-medium relative group"
          >
            Como funciona
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a 
            href="#" 
            className="text-glass hover:text-white transition-all duration-300 font-medium relative group"
          >
            Contato
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <button 
            className="btn-luxury-cta"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
              border: 'none',
              borderRadius: '16px',
              color: '#1a1a1a',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '12px 24px',
              fontSize: '14px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)',
              cursor: 'pointer'
            }}
          >
            <span style={{ position: 'relative', zIndex: 2 }}>
              Falar com especialista
            </span>
            <div 
              style={{
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                transition: 'left 0.5s',
                zIndex: 1
              }}
              className="shimmer-effect"
            />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
