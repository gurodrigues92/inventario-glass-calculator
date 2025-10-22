import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ErroNotificacao {
  request_id: string;
  email: string;
  nome: string;
  produto?: string;
  etapa_falha: string;
  erro_mensagem: string;
  hotmart_transaction_id?: string;
  timestamp: string;
}

async function enviarTelegramAlerta(dados: ErroNotificacao) {
  const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
  const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials not configured');
    return;
  }

  const message = `
🔴 *ERRO NA AUTOMAÇÃO HOTMART*

👤 Cliente: \`${dados.email}\`
📝 Nome: ${dados.nome}
📦 Produto: ${dados.produto || 'N/A'}
❌ Falha em: ${dados.etapa_falha}
💬 Erro: ${dados.erro_mensagem}

🕐 ${new Date(dados.timestamp).toLocaleString('pt-BR')}
🔑 Request ID: \`${dados.request_id}\`
${dados.hotmart_transaction_id ? `📋 Transaction: \`${dados.hotmart_transaction_id}\`` : ''}

⚠️ Ação necessária: Verifique o dashboard de monitoramento
  `;
  
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
    } else {
      console.log('Telegram alert sent successfully');
    }
  } catch (error) {
    console.error('Error sending Telegram alert:', error);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const dados: ErroNotificacao = await req.json();
    
    console.log(`[${dados.request_id}] Sending error notification for ${dados.email}`);
    
    // Enviar alerta via Telegram
    await enviarTelegramAlerta(dados);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('Error in notificar-admin-erro:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
