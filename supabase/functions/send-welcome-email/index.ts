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
    
    console.log('Dados recebidos:', {
      nome,
      email: email?.substring(0, 5) + '***', // Log parcial por segurança
      produto,
      hasToken: !!token,
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
    const baseUrl = siteUrl || 'https://app.inventariodescomplicado.com.br'
    const definirSenhaUrl = `${baseUrl}/definir-senha?token=${token}`

    console.log('URL gerada:', definirSenhaUrl.replace(token, 'TOKEN_HIDDEN'))

    // Template do e-mail
    const emailHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Inventário Descomplicado</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Inventário Descomplicado
            </h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                Sua calculadora profissional de inventário
            </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 600;">
                    Parabéns, ${nome}!
                </h2>
                <p style="color: #64748b; margin: 15px 0 0 0; font-size: 16px; line-height: 1.6;">
                    Sua compra do <strong>${produto}</strong> foi confirmada com sucesso.
                </p>
            </div>

            <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                    📧 Próximo Passo: Defina sua Senha
                </h3>
                <p style="color: #64748b; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">
                    Para acessar sua calculadora, você precisa definir uma senha de acesso. Clique no botão abaixo:
                </p>
                <div style="text-align: center;">
                    <a href="${definirSenhaUrl}" 
                       style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3); transition: all 0.2s ease;">
                        🔐 Definir Minha Senha
                    </a>
                </div>
            </div>

            <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                <div style="display: flex; align-items: flex-start;">
                    <div style="color: #f59e0b; margin-right: 10px; font-size: 20px;">⚠️</div>
                    <div>
                        <h4 style="color: #92400e; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
                            Importante
                        </h4>
                        <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.5;">
                            Este link é válido por <strong>7 dias</strong>. Após definir sua senha, você poderá acessar a calculadora sempre que precisar.
                        </p>
                    </div>
                </div>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #64748b; margin: 0; font-size: 14px;">
                    Se você não conseguir clicar no botão, copie e cole este link no seu navegador:
                </p>
                <p style="color: #3b82f6; word-break: break-all; font-size: 12px; margin: 10px 0; padding: 10px; background-color: #f1f5f9; border-radius: 6px;">
                    ${definirSenhaUrl}
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
                Obrigado por escolher o <strong>Inventário Descomplicado</strong>
            </p>
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                Se você não fez esta compra, pode ignorar este e-mail com segurança.
            </p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; margin: 0; font-size: 11px;">
                    © ${new Date().getFullYear()} Inventário Descomplicado. Todos os direitos reservados.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `

    console.log('Iniciando envio do e-mail...')

    // Enviar e-mail via Resend
    const emailResponse = await resend.emails.send({
      from: 'Inventário Descomplicado <noreply@upload.patrimonioseminventario.com.br>',
      to: [email],
      subject: `🎉 Bem-vindo ao Inventário Descomplicado - Defina sua senha`,
      html: emailHtml,
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