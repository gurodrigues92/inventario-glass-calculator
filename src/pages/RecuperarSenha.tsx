import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, Gem, ArrowLeft } from 'lucide-react';

export default function RecuperarSenha() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirecionar se já estiver logado
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Usa auth nativo do Supabase ao invés de Edge Function
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/redefinir-senha`
        }
      );

      if (error) {
        console.error('Erro ao recuperar senha:', error);

        // Mensagens de erro mais amigáveis
        if (error.message.includes('Email rate limit exceeded')) {
          setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
        } else if (error.message.includes('Invalid email')) {
          setError('E-mail inválido.');
        } else {
          setError('Erro ao enviar e-mail. Tente novamente.');
        }

        setIsLoading(false);
        return;
      }

      // Sempre mostra sucesso (por segurança, não revela se email existe)
      setSuccess(true);
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
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
                E-mail Enviado!
              </h2>
              <p 
                className="mb-4"
                style={{ color: '#476D9E' }}
              >
                Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.
              </p>
              <p 
                className="text-sm mb-6"
                style={{ color: '#9FB7D4' }}
              >
                Verifique sua caixa de entrada e também a pasta de spam.
              </p>
              <Link to="/login">
                <button
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
                  Voltar para Login
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h2 
              className="text-xl font-bold mt-4"
              style={{ color: '#0C2C45' }}
            >
              Recuperar Senha
            </h2>
            <CardDescription 
              style={{ color: '#476D9E' }}
            >
              Informe seu e-mail para receber um link de recuperação
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
                  placeholder="Digite seu e-mail cadastrado"
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
                    Enviando...
                  </div>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#476D9E' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#0C2C45')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#476D9E')}
              >
                <ArrowLeft size={16} />
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
