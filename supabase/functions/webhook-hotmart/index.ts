import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HotmartWebhookData {
  action: string;
  buyer: {
    email: string;
    name: string;
  };
  purchase: {
    status: string;
  };
  product: {
    name: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Webhook Hotmart recebido:', req.method)
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const webhookData: HotmartWebhookData = await req.json()
    console.log('Dados do webhook:', JSON.stringify(webhookData, null, 2))

    // Verificar se é uma compra aprovada
    if (webhookData.purchase?.status !== 'approved') {
      console.log('Status da compra não é aprovado:', webhookData.purchase?.status)
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Compra não aprovada' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }

    const { email, name } = webhookData.buyer
    const produto = webhookData.product?.name || 'Calculadora Inventário'

    // Gerar token único para definição de senha
    const tokenDefinicaoSenha = crypto.randomUUID()

    // Verificar se usuário já existe
    const { data: usuarioExistente } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (usuarioExistente) {
      // Atualizar usuário existente
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({
          ativo: true,
          data_ativacao: new Date().toISOString(),
          produto: produto,
          token_definicao_senha: tokenDefinicaoSenha
        })
        .eq('email', email)

      if (updateError) {
        console.error('Erro ao atualizar usuário:', updateError)
        throw updateError
      }

      console.log('Usuário atualizado com sucesso:', email)
    } else {
      // Criar novo usuário
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          nome: name,
          email: email,
          ativo: true,
          data_ativacao: new Date().toISOString(),
          produto: produto,
          token_definicao_senha: tokenDefinicaoSenha
        })

      if (insertError) {
        console.error('Erro ao criar usuário:', insertError)
        throw insertError
      }

      console.log('Usuário criado com sucesso:', email)
    }

    // TODO: Enviar e-mail com link para definir senha
    // Link seria: https://seudominio.com/definir-senha?token=${tokenDefinicaoSenha}
    console.log('Token para definir senha:', tokenDefinicaoSenha)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Usuário processado com sucesso',
      token: tokenDefinicaoSenha 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Erro no webhook Hotmart:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})