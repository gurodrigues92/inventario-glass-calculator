import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppRequest {
  nome: string;
  telefone: string;
  token: string;
  produto: string;
  siteUrl?: string;
}

serve(async (req) => {
  console.log('=== send-whatsapp-welcome iniciado ===')

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const evolutionUrl = Deno.env.get('EVOLUTION_API_URL')
    const evolutionKey = Deno.env.get('EVOLUTION_API_KEY')
    const instanceName = Deno.env.get('EVOLUTION_INSTANCE_NAME')

    if (!evolutionUrl || !evolutionKey || !instanceName) {
      throw new Error('Configuração da Evolution API incompleta')
    }

    const { nome, telefone, token, produto, siteUrl }: WhatsAppRequest = await req.json()

    console.log('Dados recebidos:', { 
      nome, 
      telefone: telefone?.substring(0, 5) + '***',
      produto,
      hasToken: !!token 
    })

    if (!telefone) {
      console.log('Telefone não fornecido, ignorando envio')
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Telefone não fornecido' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Formatar telefone (remover caracteres especiais)
    const phoneFormatted = telefone.replace(/\D/g, '')
    
    // Garantir que tenha o código do país (55 para Brasil)
    const phoneWithCountry = phoneFormatted.startsWith('55') 
      ? phoneFormatted 
      : `55${phoneFormatted}`
    
    const baseUrl = siteUrl || 'https://calculadora.patrimonioseminventario.com.br'
    const definirSenhaUrl = `${baseUrl}/definir-senha?token=${token}`

    // Montar mensagem formatada
    const message = `🎉 *Olá, ${nome}!*

Sua compra do *${produto}* foi aprovada com sucesso!

📱 *Acesse agora a Calculadora de Inventário*

Para definir sua senha e acessar a ferramenta, clique no link abaixo:

🔗 ${definirSenhaUrl}

✅ *O que você pode fazer:*
• Calcular custos de inventário judicial e extrajudicial
• Comparar valores de ITCMD por estado
• Simular economia com holding familiar
• Gerar relatórios profissionais

Em caso de dúvidas, responda esta mensagem!

_Patrimônio Sem Inventário_`

    console.log('Enviando WhatsApp para:', phoneWithCountry.substring(0, 5) + '***')

    // Enviar via Evolution API
    const response = await fetch(
      `${evolutionUrl}/message/sendText/${instanceName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionKey
        },
        body: JSON.stringify({
          number: phoneWithCountry,
          text: message
        })
      }
    )

    const result = await response.json()
    
    console.log('Resposta Evolution API:', { 
      status: response.status, 
      ok: response.ok,
      result: JSON.stringify(result).substring(0, 200)
    })

    if (!response.ok) {
      throw new Error(`Evolution API error: ${JSON.stringify(result)}`)
    }

    console.log('✅ WhatsApp enviado com sucesso!')

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'WhatsApp enviado com sucesso' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error.message)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
