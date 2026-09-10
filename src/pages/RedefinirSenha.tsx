import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, CheckCircle, Gem, ArrowLeft } from 'lucide-react';

export default function RedefinirSenha() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isReady, setIsReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Com implicit flow, o GoTrue redireciona com #access_token=...&type=recovery no hash
    // O Supabase client processa o hash e dispara PASSWORD_RECOVERY via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setIsReady(true);
        setError('');
      }
    });

    // Fallback direto: checa se o hash da URL já indica recovery (pode ter sido processado antes do useEffect)
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || hash.includes('access_token')) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) setIsReady(true);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  // Redirecionar se já estiver logado (mas não durante o fluxo de recovery)
  if (isAuthenticated && !isReady) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('Erro ao redefinir senha:', error);
        setError('Erro ao redefinir senha. Tente novamente.');
        return;
      }

      setSuccess(true);
      await supabase.auth.signOut();
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      console.error('Erro ao redefinir senha:', err);
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-animated flex items-center justify-center p-4">
        <Card 
          className="w-full max-w-md shadow-xl border-0 backdrop-blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #E8E2DD',
            boxShadow: '0 8px 24px rgba(12, 44, 69, 0.16)'
          }}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle 
                className="mx-auto h-16 w-16 mb-4" 
                style={{ color: '#476D9E' }}
              />
              <h2 
                className="text-2xl font-bold mb-2"
                style={{ color: '#0C2C45' }}
              >
                Senha Redefinida!
              </h2>
              <p 
                className="mb-4"
                style={{ color: '#476D9E' }}
              >
                Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                  color: '#FFFFFF',
                  border: 'none',
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
                Ir para Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Aguardando o evento PASSWORD_RECOVERY do Supabase
  if (!isReady) {
    return (
      <div className="min-h-screen bg-animated flex items-center justify-center p-4">
        <Card
          className="w-full max-w-md shadow-xl border-0"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #E8E2DD',
            boxShadow: '0 8px 24px rgba(12, 44, 69, 0.16)'
          }}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="mx-auto h-12 w-12 animate-spin mb-4" style={{ color: '#476D9E' }} />
              <p style={{ color: '#476D9E' }}>Verificando link de recuperação...</p>
              <p className="text-sm mt-3" style={{ color: '#9FB7D4' }}>
                Se esta tela não carregar, o link pode ter expirado.{' '}
                <Link to="/recuperar-senha" style={{ color: '#476D9E', fontWeight: 600 }}>
                  Solicitar novo link
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          to="/login"
          className="flex items-center space-x-2 mb-6 font-medium transition-colors"
          style={{ color: '#476D9E' }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#0C2C45'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#476D9E'}
        >
          <ArrowLeft size={20} />
          <span>Voltar para Login</span>
        </Link>

        <Card 
          className="shadow-xl border-0 backdrop-blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #E8E2DD',
            boxShadow: '0 8px 24px rgba(12, 44, 69, 0.16)'
          }}
        >
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
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
            <h2 
              className="text-xl font-bold mt-4"
              style={{ color: '#0C2C45' }}
            >
              Redefinir Senha
            </h2>
            <CardDescription 
              style={{ color: '#476D9E' }}
            >
              Crie uma nova senha para sua conta
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label 
                  htmlFor="password"
                  style={{ color: '#0C2C45', fontWeight: '600' }}
                >
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua nova senha (mín. 6 caracteres)"
                    required
                    disabled={isLoading}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8E2DD',
                      color: '#0C2C45',
                      paddingRight: '40px'
                    }}
                    className="focus:border-[#9FB7D4] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{ color: '#476D9E' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="confirmPassword"
                  style={{ color: '#0C2C45', fontWeight: '600' }}
                >
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    required
                    disabled={isLoading}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8E2DD',
                      color: '#0C2C45',
                      paddingRight: '40px'
                    }}
                    className="focus:border-[#9FB7D4] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{ color: '#476D9E' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                  color: '#FFFFFF',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(12, 44, 69, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                    (e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(12, 44, 69, 0.2)';
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redefinindo...
                  </div>
                ) : (
                  'Redefinir Senha'
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
