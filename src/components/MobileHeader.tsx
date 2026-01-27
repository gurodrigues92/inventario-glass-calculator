import React, { useState } from 'react';
import { Gem, Menu, X, User, LogOut, Calculator } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SpecialistSelectionDialog from './SpecialistSelectionDialog';
import HowItWorksDialog from './HowItWorksDialog';

const MobileHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSpecialistDialogOpen, setIsSpecialistDialogOpen] = useState(false);
  const [isHowItWorksDialogOpen, setIsHowItWorksDialogOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    toggleMenu();
  };

  return (
    <>
      <header 
        className="header-luxury fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 md:py-6"
        style={{
          background: '#FFFFFF',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E8E2DD',
          boxShadow: '0 2px 8px rgba(12, 44, 69, 0.08)',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 md:space-x-4">
            <div 
              className="logo-diamond"
              style={{
                width: '48px',
                height: '48px',
                background: '#0C2C45',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
                transform: 'rotate(45deg)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ transform: 'rotate(-45deg)' }}>
                <Gem size={24} color="#FFFFFF" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 
                className="text-xl md:text-2xl font-bold tracking-wide"
                style={{ color: '#0C2C45' }}
              >
                Inventário
              </h1>
              <span 
                className="text-xs md:text-sm font-bold tracking-widest"
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
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => setIsHowItWorksDialogOpen(true)}
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
            </button>
            <button 
              onClick={() => navigate('/calculos-salvos')}
              className="font-medium relative group transition-all duration-300"
              style={{ color: '#476D9E' }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
            >
              Meus Cálculos
              <span 
                className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                style={{ background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)' }}
              ></span>
            </button>
            <button 
              onClick={() => setIsSpecialistDialogOpen(true)}
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: '#476D9E' }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          style={{
            background: 'rgba(12, 44, 69, 0.95)',
            backdropFilter: 'blur(20px)',
            top: '80px'
          }}
        >
          <nav className="flex flex-col items-center justify-start pt-8 space-y-6 px-6">
            {/* User Info */}
            {user && (
              <div className="w-full text-center pb-6 border-b border-white/20">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <User size={20} className="text-white/80" />
                  <span className="text-white font-medium">{user.nome}</span>
                </div>
                <span className="text-white/60 text-sm">{user.email}</span>
              </div>
            )}

            <button 
              onClick={() => {
                setIsHowItWorksDialogOpen(true);
                toggleMenu();
              }}
              className="text-xl font-medium text-white hover:text-opacity-80 transition-colors"
            >
              Como funciona
            </button>
            
            <button 
              onClick={() => {
                navigate('/calculos-salvos');
                toggleMenu();
              }}
              className="flex items-center space-x-2 text-xl font-medium text-white hover:text-opacity-80 transition-colors"
            >
              <Calculator size={20} />
              <span>Meus Cálculos</span>
            </button>
            
            <button 
              className="text-lg font-semibold px-8 py-4 rounded-xl transition-all"
              style={{
                background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
                color: '#0C2C45',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 4px 16px rgba(209, 191, 163, 0.3)'
              }}
              onClick={() => {
                setIsSpecialistDialogOpen(true);
                toggleMenu();
              }}
            >
              Falar com especialista
            </button>

            {/* Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-lg font-medium text-red-400 hover:text-red-300 transition-colors mt-4 pt-4 border-t border-white/20 w-full justify-center"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            )}
          </nav>
        </div>
      )}

      <SpecialistSelectionDialog 
        open={isSpecialistDialogOpen}
        onOpenChange={setIsSpecialistDialogOpen}
      />
      
      <HowItWorksDialog 
        open={isHowItWorksDialogOpen}
        onOpenChange={setIsHowItWorksDialogOpen}
      />
    </>
  );
};

export default MobileHeader;
