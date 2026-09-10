import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReenviarEmailRequest {
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email }: ReenviarEmailRequest = await req.json();

    if (!email) {
      throw new Error('Email é obrigatório');
    }

    console.log(`[REENVIO MANUAL] Iniciando processo para: ${email}`);

    // 1. Buscar usuário
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (errorUsuario || !usuario) {
      throw new Error(`Usuário não encontrado: ${email}`);
    }

    console.log(`[REENVIO MANUAL] Usuário encontrado: ${usuario.id}`);

    // 2. Gerar token seguro
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('gerar_token_seguro');

    if (tokenError || !tokenData) {
      throw new Error(`Erro ao gerar token: ${tokenError?.message}`);
    }

    const token = tokenData as string;
    console.log(`[REENVIO MANUAL] Token gerado com sucesso`);

    // 3. Atualizar usuário com o novo token
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({
        token_definicao_senha: token,
        token_gerado_em: new Date().toISOString()
      })
      .eq('email', email);

    if (updateError) {
      throw new Error(`Erro ao atualizar usuário: ${updateError.message}`);
    }

    console.log(`[REENVIO MANUAL] Token salvo no banco de dados`);

    // 4. Chamar edge function send-welcome-email
    const { data: emailData, error: emailError } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        nome: usuario.nome,
        email: usuario.email,
        token: token,
        produto: usuario.produto || 'Calculadora de Inventário',
        siteUrl: 'https://app.inventariodescomplicado.com.br'
      }
    });

    if (emailError) {
      console.error(`[REENVIO MANUAL] Erro ao enviar email:`, emailError);
      throw new Error(`Erro ao enviar email: ${emailError.message}`);
    }

    console.log(`[REENVIO MANUAL] Email enviado com sucesso via send-welcome-email`);

    // 5. Registrar no log de compras
    const requestId = `REENVIO_MANUAL_${crypto.randomUUID()}`;
    const { error: logError } = await supabase
      .from('log_compras_hotmart')
      .insert({
        request_id: requestId,
        email: usuario.email,
        nome: usuario.nome,
        status: 'email_reenviado_manual',
        etapa_falha: 'webhook_recebido',
        produto: usuario.produto || 'Calculadora de Inventário',
        usuario_id: usuario.id,
        processado_em: new Date().toISOString(),
        tempo_processamento_ms: 0,
        tentativa_numero: 1
      });

    if (logError) {
      console.error(`[REENVIO MANUAL] Erro ao salvar log:`, logError);
      // Não vamos falhar se o log não for salvo
    } else {
      console.log(`[REENVIO MANUAL] Log registrado com sucesso: ${requestId}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email reenviado com sucesso',
        usuario_id: usuario.id,
        email: usuario.email,
        token_valido_ate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        request_id: requestId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('[REENVIO MANUAL] Erro:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: (error instanceof Error ? error.message : String(error))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
