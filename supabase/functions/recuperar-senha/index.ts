import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RecuperarSenhaRequest {
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Configuração do servidor incompleta');
    }

    if (!resendApiKey) {
      console.error('RESEND_API_KEY não configurada');
      throw new Error('Serviço de e-mail não configurado');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      db: { schema: 'inventario_glass' },
      global: {
        headers: {
          'Accept-Profile': 'inventario_glass',
          'Content-Profile': 'inventario_glass'
        }
      }
    });
    const resend = new Resend(resendApiKey);

    const { email }: RecuperarSenhaRequest = await req.json();

    if (!email || !email.trim()) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'E-mail é obrigatório' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Buscando usuário com e-mail:', email);

    // Buscar usuário pelo e-mail
    // Busca ignorando caixa.
    // `_` e `%` sao curinga no LIKE e aparecem em email de verdade: escapar.
    const emailNormalizado = email.trim().toLowerCase();
    const emailPattern = emailNormalizado.replace(/[\\%_]/g, (c) => `\\${c}`);

    // Duplicata por caixa existe na base (mesmo e-mail em dois produtos): pegar a
    // linha exata quando houver, e so cair no match sem caixa se nao for ambiguo.
    const escolher = (linhas: any[] | null) =>
      linhas?.find((u) => u.email === emailNormalizado) ??
      (linhas?.length === 1 ? linhas[0] : null)

    const { data: candidatos, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id, nome, email, ativo')
      .ilike('email', emailPattern)
      .limit(5);

    const usuario = escolher(candidatos);

    if (usuarioError) {
      console.error('Erro ao buscar usuário:', usuarioError);
      // Retornar sucesso genérico por segurança
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Se o e-mail existir em nossa base, você receberá instruções para redefinir sua senha.'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Se usuário não existe, retornar sucesso genérico (segurança)
    if (!usuario) {
      console.log('Usuário não encontrado, mas retornando sucesso por segurança');
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Se o e-mail existir em nossa base, você receberá instruções para redefinir sua senha.'
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Usuário encontrado:', usuario.id);

    // Trava de repeticao: a funcao e publica, entao sem isso da pra encher a caixa
    // de qualquer comprador chamando em loop (10/09/2026).
    const cincoMinAtras = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recente } = await supabase
      .from('password_reset_tokens')
      .select('id')
      .eq('user_id', usuario.id)
      .gt('created_at', cincoMinAtras)
      .limit(1);

    if (recente && recente.length > 0) {
      console.log('Pedido repetido em menos de 5 minutos, ignorando:', usuario.id);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Se o e-mail existir em nossa base, você receberá instruções para redefinir sua senha.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Gerar token seguro usando a função do banco
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('gerar_token_seguro');

    if (tokenError || !tokenData) {
      console.error('Erro ao gerar token:', tokenError);
      throw new Error('Erro ao gerar token de recuperação');
    }

    const token = tokenData;
    console.log('Token gerado com sucesso');

    // Calcular data de expiração (7 dias)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Inserir token na tabela password_reset_tokens
    const { error: insertError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: usuario.id,
        token: token,
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (insertError) {
      console.error('Erro ao inserir token de recuperação:', insertError);
      throw new Error('Erro ao processar recuperação');
    }

    console.log('Token de recuperação salvo no banco de dados');

    // Construir URL de recuperação
    const linkRecuperacao = `https://calculadora.patrimonioseminventario.com.br/definir-senha?token=${token}`;

    console.log('Enviando e-mail de recuperação para:', email);

    // Enviar e-mail
    const { error: emailError } = await resend.emails.send({
      from: 'Inventário Descomplicado <noreply@updates.patrimonioseminventario.com.br>',
      to: [usuario.email],
      subject: 'Recuperação de Senha - Inventário Descomplicado',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F5EFEB;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 8px 24px rgba(12, 44, 69, 0.16);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 56px; height: 56px; background: #0C2C45; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; transform: rotate(45deg); box-shadow: 0 4px 16px rgba(12, 44, 69, 0.2);">
                  <span style="transform: rotate(-45deg); font-size: 28px; color: white;">💎</span>
                </div>
                <h1 style="color: #0C2C45; margin: 20px 0 0 0; font-size: 24px;">Inventário Descomplicado</h1>
              </div>
              
              <h2 style="color: #0C2C45; font-size: 20px; margin-bottom: 20px;">Olá, ${usuario.nome}!</h2>
              
              <p style="color: #476D9E; line-height: 1.6; margin-bottom: 20px;">
                Recebemos uma solicitação para redefinir a senha da sua conta. 
                Se foi você, clique no botão abaixo para criar uma nova senha:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${linkRecuperacao}" 
                   style="display: inline-block; background: linear-gradient(135deg, #0C2C45, #476D9E); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 16px rgba(12, 44, 69, 0.2);">
                  Redefinir Senha
                </a>
              </div>
              
              <p style="color: #476D9E; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                Ou copie e cole este link no seu navegador:
              </p>
              <p style="color: #476D9E; font-size: 12px; word-break: break-all; background: #F5EFEB; padding: 12px; border-radius: 6px;">
                ${linkRecuperacao}
              </p>
              
              <div style="border-top: 1px solid #E8E2DD; margin-top: 30px; padding-top: 20px;">
                <p style="color: #476D9E; font-size: 14px; line-height: 1.6;">
                  <strong>⚠️ Importante:</strong> Este link expira em 7 dias.
                </p>
                <p style="color: #476D9E; font-size: 14px; line-height: 1.6;">
                  Se você não solicitou a recuperação de senha, ignore este e-mail. 
                  Sua conta permanecerá segura.
                </p>
              </div>
            </div>
            
            <p style="text-align: center; color: #9FB7D4; font-size: 12px; margin-top: 20px;">
              © 2025 Inventário Descomplicado. Todos os direitos reservados.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('Erro ao enviar e-mail:', emailError);
      throw new Error('Erro ao enviar e-mail de recuperação');
    }

    console.log('E-mail enviado com sucesso');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Se o e-mail existir em nossa base, você receberá instruções para redefinir sua senha.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Erro na função recuperar-senha:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro ao processar solicitação' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
