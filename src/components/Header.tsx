
import React, { useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import MobileHeader from './MobileHeader';
import { Gem, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SpecialistSelectionDialog from './SpecialistSelectionDialog';

const Header = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const [isSpecialistDialogOpen, setIsSpecialistDialogOpen] = useState(false);

  if (isMobile) {
    return <MobileHeader />;
  }

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
            className="btn-luxury-cta hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
              border: 'none',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              padding: '12px 40px',
              fontSize: '13px',
              position: 'relative',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            Falar com especialista
          </button>

          {/* Menu do usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center space-x-2 border-2 hover:bg-gray-50">
                <User size={18} />
                <span className="hidden lg:inline font-medium">{user?.nome || 'Usuário'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.nome}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/calculos-salvos')}>
                <span>Meus Cálculos</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>

      <SpecialistSelectionDialog 
        open={isSpecialistDialogOpen}
        onOpenChange={setIsSpecialistDialogOpen}
      />
    </header>
  );
};

export default Header;
