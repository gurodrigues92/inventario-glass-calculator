import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Gem, Mail, CheckCircle } from 'lucide-react';

export default function SolicitarAtivacao() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('reenviar-email-manual', {
        body: { email }
      });

      if (error) {
        console.error('Erro ao solicitar reenvio:', error);
        setError('Erro de conexão. Tente novamente.');
        setIsLoading(false);
        return;
      }

      if (!data.success) {
        setError(data.error || 'Erro ao enviar email');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
    } catch (error) {
      console.error('Erro inesperado:', error);
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
                Email Enviado!
              </h2>
              <p 
                className="mb-6"
                style={{ color: '#476D9E' }}
              >
                Enviamos um novo email de ativação para <strong>{email}</strong>. 
                Verifique sua caixa de entrada e spam.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="inline-block w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
                  }}
                >
                  Voltar para Login
                </Link>
              </div>
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
            <CardTitle 
              className="mt-6"
              style={{ color: '#0C2C45' }}
            >
              Solicitar Email de Ativação
            </CardTitle>
            <CardDescription style={{ color: '#476D9E' }}>
              Digite seu email para receber um novo link de ativação
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert 
                  variant="destructive"
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECACA',
                    color: '#DC2626'
                  }}
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" style={{ color: '#0C2C45' }}>
                  Email
                </Label>
                <div className="relative">
                  <Mail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                    size={18} 
                    style={{ color: '#476D9E' }}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                    style={{
                      borderColor: '#E8E2DD',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full font-semibold py-6 rounded-lg transition-all duration-300"
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                  color: '#FFFFFF',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Email de Ativação'
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm" style={{ color: '#476D9E' }}>
                  Já definiu sua senha?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold hover:underline"
                    style={{ color: '#0C2C45' }}
                  >
                    Fazer Login
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
