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

      // Primeiro tenta autenticar com Supabase Auth nativo
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);

        // Mensagens de erro amigáveis
        if (authError.message.includes('Invalid login credentials')) {
          return { success: false, error: 'E-mail ou senha incorretos' };
        } else if (authError.message.includes('Email not confirmed')) {
          return { success: false, error: 'E-mail não confirmado' };
        } else {
          return { success: false, error: 'Erro ao fazer login. Tente novamente.' };
        }
      }

      // Se autenticou com sucesso, busca dados adicionais do usuário na tabela 'usuarios'
      if (authData?.user) {
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email.trim().toLowerCase())
          .single();

        if (userError || !userData) {
          // Se não encontrou na tabela usuarios, usa dados do auth
          const basicUser: Usuario = {
            id: authData.user.id,
            nome: authData.user.email || '',
            email: authData.user.email || '',
            ativo: true,
            created_at: authData.user.created_at,
            updated_at: new Date().toISOString()
          };

          setUser(basicUser);
          localStorage.setItem('inventario_user', JSON.stringify(basicUser));
          localStorage.setItem('lastLoginCheck', Date.now().toString());

          return { success: true };
        }

        // Verifica se usuário está ativo
        if (!userData.ativo) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Conta inativa. Entre em contato com o suporte.'
          };
        }

        // Salvar usuário no estado e localStorage
        setUser(userData);
        localStorage.setItem('inventario_user', JSON.stringify(userData));
        localStorage.setItem('lastLoginCheck', Date.now().toString());

        return { success: true };
      }

      return { success: false, error: 'Erro inesperado' };
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