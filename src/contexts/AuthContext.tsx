import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { invocarEdge, guardarSessao, limparSessao } from '@/lib/edge';

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
    // O localStorage e chute otimista pra tela nao piscar. Quem decide se a
    // sessao vale e o servidor: conta desativada ou token vencido cai aqui.
    const storedUser = localStorage.getItem('inventario_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao recuperar usuário do localStorage:', error);
        localStorage.removeItem('inventario_user');
      }
    }

    let cancelado = false;

    invocarEdge<{ success?: boolean; user?: Usuario }>('auth-sessao')
      .then(({ data }) => {
        if (cancelado) return;

        if (data?.success && data.user) {
          setUser(data.user);
          localStorage.setItem('inventario_user', JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem('inventario_user');
          limparSessao();
        }
      })
      .finally(() => {
        if (!cancelado) setIsLoading(false);
      });

    return () => { cancelado = true; };
  }, []);

  const login = async (email: string, password: string): Promise<{
    success: boolean;
    error?: string;
    message?: string;
    needsPasswordDefinition?: boolean;
  }> => {
    try {
      setIsLoading(true);

      // Autenticação via edge function customizada (PBKDF2 + inventario_glass.usuarios)
      const { data, error: fnError } = await invocarEdge<{
        success?: boolean;
        error?: string;
        message?: string;
        user?: Usuario;
        session?: { token: string; expiraEm: string };
      }>('auth-login', { email: email.trim().toLowerCase(), password });

      if (!data) {
        console.error('Erro ao chamar auth-login:', fnError);
        return { success: false, error: 'Erro de conexão. Tente novamente.' };
      }

      if (!data?.success) {
        const errorCode = data?.error;
        console.error('Erro no login:', errorCode);

        if (errorCode === 'SENHA_NAO_DEFINIDA') {
          return { success: false, error: 'SENHA_NAO_DEFINIDA', needsPasswordDefinition: true, message: data?.message as string };
        }
        if (errorCode === 'CONTA_INATIVA') {
          return { success: false, error: 'CONTA_INATIVA', message: data?.message as string };
        }
        return { success: false, error: data?.error || 'E-mail ou senha incorretos' };
      }

      if (!data.session?.token || !data.user) {
        console.error('auth-login respondeu sem sessão');
        return { success: false, error: 'Resposta inválida do servidor. Tente novamente.' };
      }

      // Login bem-sucedido — guardar a sessão assinada e o usuário
      const userData: Usuario = data.user;
      guardarSessao(data.session.token);
      setUser(userData);
      localStorage.setItem('inventario_user', JSON.stringify(userData));

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
    limparSessao();
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