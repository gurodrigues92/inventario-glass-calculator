import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Gem } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirecionar se já estiver logado
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      // Verificar se precisa definir senha
      if (result.needsPasswordDefinition && result.token) {
        console.log('Redirecionando para definir senha com token:', result.token);
        navigate(`/definir-senha?token=${result.token}`);
        return;
      }
      
      // Mostrar mensagem específica ou genérica
      if (result.error === 'SENHA_NAO_DEFINIDA') {
        setError('Você precisa definir sua senha primeiro. Redirecionando...');
        setTimeout(() => {
          navigate('/definir-senha');
        }, 2000);
              } else if (result.error === 'CONTA_INATIVA') {
        setError('Sua conta não está ativa. Você precisa definir sua senha primeiro.');
      } else if (result.error === 'Credenciais inválidas' || result.error === 'Email ou senha incorretos') {
        setError('Email ou senha incorretos. Se você ainda não definiu sua senha, clique em "Não recebeu o email?" abaixo.');
      } else {
        setError(result.message || result.error || 'Erro no login');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            <CardDescription 
              className="mt-4"
              style={{ color: '#476D9E' }}
            >
              Acesse sua conta para usar a calculadora de inventário
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
                  htmlFor="email"
                  style={{ color: '#0C2C45', fontWeight: '600' }}
                >
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                  disabled={isLoading}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E2DD',
                    color: '#0C2C45'
                  }}
                  className="focus:border-[#9FB7D4] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="password"
                  style={{ color: '#0C2C45', fontWeight: '600' }}
                >
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
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

              <div className="text-right mb-2">
                <Link 
                  to="/recuperar-senha" 
                  className="text-sm font-medium transition-colors"
                  style={{ color: '#476D9E' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                >
                  Esqueceu sua senha?
                </Link>
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
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p style={{ color: '#476D9E', fontSize: '14px' }}>
                Ainda não tem acesso?{' '}
                <Link 
                  to="/acesso-negado" 
                  className="font-medium transition-colors"
                  style={{ color: '#476D9E' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                >
                  Saiba como adquirir
                </Link>
              </p>
              
              <p style={{ color: '#476D9E', fontSize: '12px' }}>
                Recebeu um link de ativação?{' '}
                <Link 
                  to="/definir-senha" 
                  className="font-medium transition-colors"
                  style={{ color: '#476D9E' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                >
                  Definir senha
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}