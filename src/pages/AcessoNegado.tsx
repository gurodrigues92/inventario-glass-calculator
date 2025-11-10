import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem, ShoppingCart, Mail, CheckCircle } from 'lucide-react';

export default function AcessoNegado() {
  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
                  width: '64px',
                  height: '64px',
                  background: '#0C2C45',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
                  transform: 'rotate(45deg)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ transform: 'rotate(-45deg)' }}>
                  <Gem size={32} color="#FFFFFF" strokeWidth={1.5} />
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
              className="text-3xl font-bold mt-4"
              style={{ color: '#0C2C45' }}
            >
              Acesso Restrito
            </CardTitle>
            <CardDescription 
              className="text-lg"
              style={{ color: '#476D9E' }}
            >
              Para usar a Calculadora de Inventário, você precisa adquirir o produto
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div 
              className="rounded-lg p-6"
              style={{
                background: 'rgba(159, 183, 212, 0.1)',
                border: '1px solid rgba(159, 183, 212, 0.3)'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-3"
                style={{ color: '#0C2C45' }}
              >
                Como obter acesso?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <ShoppingCart 
                    className="w-5 h-5 mt-1 flex-shrink-0" 
                    style={{ color: '#476D9E' }}
                  />
                  <div>
                    <p 
                      className="font-medium"
                      style={{ color: '#0C2C45' }}
                    >
                      1. Adquira o produto
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: '#476D9E' }}
                    >
                      Compre a Calculadora de Inventário em nossa plataforma
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail 
                    className="w-5 h-5 mt-1 flex-shrink-0" 
                    style={{ color: '#476D9E' }}
                  />
                  <div>
                    <p 
                      className="font-medium"
                      style={{ color: '#0C2C45' }}
                    >
                      2. Verifique seu e-mail
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: '#476D9E' }}
                    >
                      Após a compra, você receberá um e-mail com link para ativar sua conta
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle 
                    className="w-5 h-5 mt-1 flex-shrink-0" 
                    style={{ color: '#476D9E' }}
                  />
                  <div>
                    <p 
                      className="font-medium"
                      style={{ color: '#0C2C45' }}
                    >
                      3. Defina sua senha
                    </p>
                    <p 
                      className="text-sm"
                      style={{ color: '#476D9E' }}
                    >
                      Clique no link do e-mail para definir sua senha e ativar o acesso
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={() => window.open('https://lp.patrimonioseminventario.com.br/', '_blank')}
                className="inline-flex items-center space-x-2 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
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
                <ShoppingCart className="w-5 h-5" />
                <span>Adquirir Calculadora</span>
              </button>

              <div className="space-y-2">
                <p style={{ color: '#476D9E', fontSize: '14px' }}>
                  Já comprou o produto?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium transition-colors"
                    style={{ color: '#476D9E' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                  >
                    Fazer login
                  </Link>
                </p>
                <p style={{ color: '#476D9E', fontSize: '14px' }}>
                  Esqueceu sua senha?{' '}
                  <Link 
                    to="/recuperar-senha" 
                    className="font-medium transition-colors"
                    style={{ color: '#476D9E' }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                  >
                    Recuperar acesso
                  </Link>
                </p>
              </div>
            </div>

            <div 
              className="rounded-lg p-4"
              style={{
                background: 'rgba(209, 191, 163, 0.1)',
                border: '1px solid rgba(209, 191, 163, 0.3)'
              }}
            >
              <h4 
                className="font-semibold mb-2"
                style={{ color: '#0C2C45' }}
              >
                Suporte
              </h4>
              <p 
                className="text-sm"
                style={{ color: '#476D9E' }}
              >
                Teve problemas com a compra ou não recebeu o e-mail de ativação?
                Entre em contato conosco através do e-mail:{' '}
                <a
                  href="mailto:contato@patrimonioseminventario.com.br"
                  className="font-medium transition-colors"
                  style={{ color: '#476D9E' }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#0C2C45'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#476D9E'}
                >
                  contato@patrimonioseminventario.com.br
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}