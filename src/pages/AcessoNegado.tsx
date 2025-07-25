import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ShoppingCart, Mail, CheckCircle } from 'lucide-react';

export default function AcessoNegado() {
  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Para usar a Calculadora de Inventário, você precisa adquirir o produto
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-amber-800 mb-3">
                Como obter acesso?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <ShoppingCart className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800">1. Adquira o produto</p>
                    <p className="text-amber-700 text-sm">
                      Compre a Calculadora de Inventário em nossa plataforma
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800">2. Verifique seu e-mail</p>
                    <p className="text-amber-700 text-sm">
                      Após a compra, você receberá um e-mail com link para ativar sua conta
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-800">3. Defina sua senha</p>
                    <p className="text-amber-700 text-sm">
                      Clique no link do e-mail para definir sua senha e ativar o acesso
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button
                asChild
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                <a
                  href="https://pay.hotmart.com/seulink"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Adquirir Calculadora</span>
                </a>
              </Button>

              <p className="text-sm text-gray-600">
                Já comprou o produto?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
                  Fazer login
                </Link>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Suporte</h4>
              <p className="text-blue-700 text-sm">
                Teve problemas com a compra ou não recebeu o e-mail de ativação?
                Entre em contato conosco através do e-mail:{' '}
                <a
                  href="mailto:suporte@calculadorainventario.com"
                  className="font-medium hover:underline"
                >
                  suporte@calculadorainventario.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}