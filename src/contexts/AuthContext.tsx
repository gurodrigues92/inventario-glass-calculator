import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  data_ativacao?: string;
  produto?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: Usuario | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ 
    success: boolean; 
    error?: string; 
    message?: string;
    token?: string;
    needsPasswordDefinition?: boolean;
  }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário no localStorage
    const storedUser = localStorage.getItem('inventario_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        localStorage.removeItem('inventario_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ 
    success: boolean; 
    error?: string; 
    message?: string;
    token?: string;
    needsPasswordDefinition?: boolean;
  }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('auth-login', {
        body: { email, password }
      });

      if (error) {
        console.error('Erro na função de login:', error);
        return { success: false, error: 'Erro de conexão' };
      }

      if (!data.success) {
        // Verificar se é erro específico que precisa de redirecionamento
        if (data.error === 'SENHA_NAO_DEFINIDA' || data.error === 'CONTA_INATIVA') {
          console.log('Usuário precisa definir senha:', data);
          return { 
            success: false, 
            error: data.error,
            message: data.message,
            token: data.token,
            needsPasswordDefinition: true
          };
        }
        return { success: false, error: data.message || data.error };
      }
      
      // Salvar usuário no estado e localStorage
      setUser(data.user);
      localStorage.setItem('inventario_user', JSON.stringify(data.user));
      localStorage.setItem('lastLoginCheck', Date.now().toString());
      
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro inesperado' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('inventario_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user?.ativo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}