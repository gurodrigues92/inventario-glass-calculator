import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { parseEdgeError } from '@/lib/utils';

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

      // Autenticação via edge function customizada (PBKDF2 + inventario_glass.usuarios)
      const { data: rawData, error: fnError } = await supabase.functions.invoke('auth-login', {
        body: { email: email.trim().toLowerCase(), password }
      });

      // auth-login responde 401 com JSON de negócio (SENHA_NAO_DEFINIDA etc.) — extrair antes de tratar como falha de rede
      const data = rawData ?? (fnError ? await parseEdgeError(fnError) : null);

      if (!data) {
        console.error('Erro ao chamar auth-login:', fnError);
        return { success: false, error: 'Erro de conexão. Tente novamente.' };
      }

      if (!data?.success) {
        const errorCode = data?.error;
        console.error('Erro no login:', errorCode);

        if (errorCode === 'SENHA_NAO_DEFINIDA') {
          return { success: false, error: 'SENHA_NAO_DEFINIDA', needsPasswordDefinition: true, token: data?.token };
        }
        if (errorCode === 'CONTA_INATIVA') {
          return { success: false, error: 'CONTA_INATIVA', token: data?.token };
        }
        return { success: false, error: data?.error || 'E-mail ou senha incorretos' };
      }

      // Login bem-sucedido — salvar usuário no estado e localStorage
      const userData: Usuario = data.user;
      setUser(userData);
      localStorage.setItem('inventario_user', JSON.stringify(userData));
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}