import React from 'react';
import { Gem } from 'lucide-react';

const Header = () => {
  return (
    <header 
      className="header-luxury fixed top-0 left-0 right-0 z-50 px-6 py-6"
      style={{
        background: '#FFFFFF',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E8E2DD',
        boxShadow: '0 2px 8px rgba(12, 44, 69, 0.08)',
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
              background: '#0C2C45',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
              transform: 'rotate(45deg)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ transform: 'rotate(-45deg)' }}>
              <Gem size={28} color="#FFFFFF" strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 
              className="text-2xl font-bold tracking-wide"
              style={{ color: '#0C2C45' }}
            >
              Inventário
            </h1>
            <span 
              className="text-sm font-bold tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
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
            className="font-medium relative group transition-all duration-300"
            style={{ color: '#476D9E' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
          >
            Como funciona
            <span 
              className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              style={{ background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)' }}
            ></span>
          </a>
          <a 
            href="#" 
            className="font-medium relative group transition-all duration-300"
            style={{ color: '#476D9E' }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
          >
            Contato
            <span 
              className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
              style={{ background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)' }}
            ></span>
          </a>
          <button 
            className="btn-luxury-cta"
            style={{
              background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
              border: 'none',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '12px 24px',
              fontSize: '14px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(12, 44, 69, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(12, 44, 69, 0.2)';
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
