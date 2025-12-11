import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WelcomeEmailRequest {
  nome: string;
  email: string;
  token: string;
  produto: string;
  siteUrl?: string;
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('=== SEND WELCOME EMAIL ===')
    console.log('Timestamp:', new Date().toISOString())
    
    const { nome, email, token, produto, siteUrl }: WelcomeEmailRequest = await req.json()
    
    console.log('📧 Preparando envio de email de boas-vindas')
    console.log('Dados recebidos:', {
      nome,
      email: email?.substring(0, 5) + '***', // Log parcial por segurança
      produto,
      hasToken: !!token,
      tokenLength: token?.length,
      siteUrl
    })

    // Validações
    if (!nome || !email || !token || !produto) {
      console.error('Dados obrigatórios ausentes:', { nome: !!nome, email: !!email, token: !!token, produto: !!produto })
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Dados obrigatórios ausentes' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // URL base para definir senha
    const baseUrl = siteUrl || 'https://calculadora.patrimonioseminventario.com.br'
    const definirSenhaUrl = `${baseUrl}/definir-senha?token=${token}`

    console.log('URL gerada:', definirSenhaUrl.replace(token, 'TOKEN_HIDDEN'))

    // Template do e-mail
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Patrimônio Sem Inventário</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0C2C45 0%, #476D9E 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Patrimônio Sem Inventário
            </h1>
            <p style="color: #E0E7FF; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Sua calculadora profissional de ITCMD e ITBI
            </p>
        </div>

        <!-- Seção 1: Confirmação da Compra -->
        <div style="padding: 40px 30px 20px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 600;">
                    🎉 Parabéns, ${nome}!
                </h2>
                <p style="color: #64748b; margin: 15px 0 0 0; font-size: 16px; line-height: 1.6;">
                    Sua compra foi aprovada com sucesso!
                </p>
                <p style="color: #0C2C45; margin: 10px 0 0 0; font-size: 15px; font-weight: 600;">
                    Produto: ${produto}
                </p>
            </div>

            <!-- Seção 2: Benefícios -->
            <div style="background-color: #f0fdf4; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #10b981; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    ✨ O que você terá acesso
                </h3>
                <div style="color: #475569; font-size: 14px; line-height: 1.8;">
                    <p style="margin: 8px 0; display: flex; align-items: start;">
                        <span style="color: #10b981; margin-right: 8px; font-size: 16px;">✅</span>
                        <span>Calcular ITCMD para inventário e doações</span>
                    </p>
                    <p style="margin: 8px 0; display: flex; align-items: start;">
                        <span style="color: #10b981; margin-right: 8px; font-size: 16px;">✅</span>
                        <span>Calcular ITBI para compra de imóveis</span>
                    </p>
                    <p style="margin: 8px 0; display: flex; align-items: start;">
                        <span style="color: #10b981; margin-right: 8px; font-size: 16px;">✅</span>
                        <span>Comparar custos: Processo Formal vs Holding Patrimonial</span>
                    </p>
                    <p style="margin: 8px 0; display: flex; align-items: start;">
                        <span style="color: #10b981; margin-right: 8px; font-size: 16px;">✅</span>
                        <span>Gerar relatórios profissionais em PDF</span>
                    </p>
                    <p style="margin: 8px 0; display: flex; align-items: start;">
                        <span style="color: #10b981; margin-right: 8px; font-size: 16px;">✅</span>
                        <span>Salvar e compartilhar seus cálculos</span>
                    </p>
                    <p style="margin: 8px 0; display: flex; align-items: start;">
                        <span style="color: #10b981; margin-right: 8px; font-size: 16px;">✅</span>
                        <span>Suporte especializado incluso</span>
                    </p>
                </div>
            </div>

            <!-- Seção 3: CTA Principal - Definir Senha -->
            <div style="background-color: #eff6ff; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #0C2C45; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    🔐 Próximo Passo: Defina sua Senha
                </h3>
                <p style="color: #64748b; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                    Para começar a usar a calculadora, você precisa definir uma senha de acesso. É rápido e simples:
                </p>
                <div style="text-align: center; margin-bottom: 15px;">
                    <a href="${definirSenhaUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #0C2C45 0%, #476D9E 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(12, 44, 69, 0.3);">
                        🔐 Definir Minha Senha
                    </a>
                </div>
                <p style="color: #f59e0b; margin: 15px 0 0 0; font-size: 13px; text-align: center; font-weight: 500;">
                    ⚠️ Link válido por 7 dias
                </p>
            </div>

            <!-- Seção 4: Acesso Direto à Calculadora -->
            <div style="text-align: center; margin: 25px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
                <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px;">
                    Já definiu sua senha? Acesse a calculadora agora:
                </p>
                <a href="https://calculadora.patrimonioseminventario.com.br/login"
                   style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
                    🚀 Acessar Calculadora
                </a>
            </div>

            <!-- Seção 5: Passo a Passo -->
            <div style="background-color: #fefce8; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #eab308; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    📋 Como começar em 3 minutos
                </h3>
                <div style="color: #475569; font-size: 14px; line-height: 1.8;">
                    <p style="margin: 10px 0;">
                        <strong style="color: #0C2C45;">1️⃣</strong> Clique em "Definir Minha Senha"
                    </p>
                    <p style="margin: 10px 0;">
                        <strong style="color: #0C2C45;">2️⃣</strong> Crie uma senha segura (mínimo 6 caracteres)
                    </p>
                    <p style="margin: 10px 0;">
                        <strong style="color: #0C2C45;">3️⃣</strong> Faça login com seu email e senha
                    </p>
                    <p style="margin: 10px 0;">
                        <strong style="color: #0C2C45;">4️⃣</strong> Comece a calcular imediatamente!
                    </p>
                </div>
            </div>

            <!-- Seção 6: E-mail não chegou? -->
            <div style="background-color: #fef2f2; border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #ef4444; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    ⏰ E-mail não chegou?
                </h3>
                <div style="color: #475569; font-size: 14px; line-height: 1.8;">
                    <p style="margin: 8px 0;">
                        • Verifique sua caixa de <strong>SPAM ou Lixo Eletrônico</strong>
                    </p>
                    <p style="margin: 8px 0;">
                        • Adicione <strong>team@updates.patrimonioseminventario.com.br</strong> aos seus contatos
                    </p>
                    <p style="margin: 8px 0;">
                        • Aguarde até 10 minutos (pode haver atraso na entrega)
                    </p>
                    <p style="margin: 8px 0;">
                        • Se não receber, entre em contato via WhatsApp
                    </p>
                </div>
            </div>

            <!-- Seção 7: Garantia -->
            <div style="background-color: #f0f9ff; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; border: 2px solid #0ea5e9; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <div style="font-size: 32px; margin-bottom: 10px;">🛡️</div>
                <h3 style="color: #1e293b; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                    Garantia Incondicional de 7 Dias
                </h3>
                <p style="color: #475569; margin: 0; font-size: 14px; line-height: 1.6;">
                    Se você não tiver clareza total sobre seu caso,<br>
                    devolvemos 100% do seu investimento. Sem perguntas.
                </p>
            </div>

            <!-- Seção 8: Suporte -->
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    💬 Precisa de Ajuda?
                </h3>
                <div style="color: #475569; font-size: 14px; line-height: 1.8;">
                    <p style="margin: 10px 0;">
                        <strong style="color: #0C2C45;">📱 WhatsApp:</strong> (11) 91787-8336
                    </p>
                    <p style="margin: 10px 0;">
                        <strong style="color: #0C2C45;">📧 Email:</strong> contato@patrimonioseminventario.com.br
                    </p>
                    <p style="margin: 10px 0; color: #64748b; font-size: 13px;">
                        ⏱️ Respondemos em até 24h
                    </p>
                </div>
            </div>

            <!-- Link alternativo -->
            <div style="text-align: center; margin: 25px 0;">
                <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 12px;">
                    Se você não conseguir clicar no botão, copie e cole este link:
                </p>
                <p style="color: #0C2C45; word-break: break-all; font-size: 11px; margin: 0; padding: 10px; background-color: #f1f5f9; border-radius: 6px;">
                    ${definirSenhaUrl}
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Obrigado por escolher o <strong>Patrimônio Sem Inventário</strong>
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                Se você não fez esta compra, pode ignorar este e-mail com segurança.
            </p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; margin: 0; font-size: 11px;">
                    © ${new Date().getFullYear()} Patrimônio Sem Inventário. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `

    console.log('Iniciando envio do e-mail...')

    // Enviar e-mail via Resend
    // Desabilitar link tracking para evitar redirecionamentos quebrados
    const emailResponse = await resend.emails.send({
      from: 'Patrimônio Sem Inventário <team@updates.patrimonioseminventario.com.br>',
      to: [email],
      subject: `🎉 Bem-vindo ao Patrimônio Sem Inventário - Defina sua senha`,
      html: emailHtml,
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID() // Evita threading no Gmail
      },
      tags: [
        { name: 'category', value: 'welcome' }
      ]
    })

    console.log('E-mail enviado com sucesso:', {
      id: emailResponse.data?.id,
      success: !emailResponse.error
    })

    if (emailResponse.error) {
      console.error('Erro no Resend:', emailResponse.error)
      throw new Error(`Falha no envio: ${emailResponse.error.message}`)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'E-mail de boas-vindas enviado com sucesso',
      emailId: emailResponse.data?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('=== ERRO SEND WELCOME EMAIL ===')
    console.error('Error details:', error)
    console.error('Stack trace:', error.stack)
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Erro interno do servidor'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})