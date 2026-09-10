import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Header from '@/components/Header';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  produto: string | null;
  created_at: string;
  senha_hash: string | null;
}

export default function ReenviarAtivacao() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'success' | 'error', texto: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    carregarUsuariosPendentes();
  }, [user]);

  const carregarUsuariosPendentes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .is('senha_hash', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setMensagem({ tipo: 'error', texto: 'Erro ao carregar usuários pendentes' });
    } finally {
      setIsLoading(false);
    }
  };

  const reenviarEmail = async (usuario: Usuario) => {
    setProcessando(usuario.id);
    setMensagem(null);

    try {
      const { data, error } = await supabase.functions.invoke('reenviar-email-manual', {
        body: { email: usuario.email }
      });

      if (error) throw error;

      if (data.success) {
        setMensagem({ 
          tipo: 'success', 
          texto: `Email reenviado com sucesso para ${usuario.nome}` 
        });
      } else {
        setMensagem({ 
          tipo: 'error', 
          texto: data.error || 'Erro ao reenviar email' 
        });
      }
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      setMensagem({ tipo: 'error', texto: 'Erro ao reenviar email' });
    } finally {
      setProcessando(null);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-animated">
      <Header />
      <main className="pt-28 pb-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
        <Card 
          className="shadow-xl border-0 backdrop-blur-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #E8E2DD',
            boxShadow: '0 8px 24px rgba(12, 44, 69, 0.16)'
          }}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle style={{ color: '#0C2C45' }}>
                  Usuários Pendentes de Ativação
                </CardTitle>
                <CardDescription style={{ color: '#476D9E' }}>
                  Usuários que ainda não definiram senha
                </CardDescription>
              </div>
              <Button
                onClick={carregarUsuariosPendentes}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {mensagem && (
              <Alert 
                className="mb-4"
                style={{
                  background: mensagem.tipo === 'success' ? '#F0FDF4' : '#FEF2F2',
                  border: mensagem.tipo === 'success' ? '1px solid #BBF7D0' : '1px solid #FECACA',
                  color: mensagem.tipo === 'success' ? '#15803D' : '#DC2626'
                }}
              >
                {mensagem.tipo === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{mensagem.texto}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" style={{ color: '#476D9E' }} />
                <p className="mt-2" style={{ color: '#476D9E' }}>Carregando...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#10B981' }} />
                <p className="text-lg font-semibold" style={{ color: '#0C2C45' }}>
                  Nenhum usuário pendente!
                </p>
                <p style={{ color: '#476D9E' }}>
                  Todos os usuários já definiram suas senhas.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E8E2DD'
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: '#0C2C45' }}>
                        {usuario.nome}
                      </h3>
                      <p className="text-sm" style={{ color: '#476D9E' }}>
                        {usuario.email}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        Produto: {usuario.produto || 'N/A'} • 
                        Criado em: {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      onClick={() => reenviarEmail(usuario)}
                      disabled={processando === usuario.id}
                      size="sm"
                      className="ml-4"
                      style={{
                        background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
                        color: '#FFFFFF',
                        border: 'none'
                      }}
                    >
                      {processando === usuario.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Reenviar Email
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  );
}
