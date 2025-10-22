import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting - controle de spam/ataques
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60000 // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 10 // máximo 10 requests por minuto por IP

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

// Função auxiliar para rate limiting
function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientLimit = rateLimitMap.get(clientIP)

  if (!clientLimit || now > clientLimit.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (clientLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  clientLimit.count++
  return true
}

// Função auxiliar para sanitizar dados
function sanitizeString(str: string): string {
  if (!str) return ''
  return str.trim().substring(0, 255) // limita tamanho e remove espaços
}

// Função auxiliar para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Função auxiliar para retry de operações de banco
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      console.warn(`Tentativa ${attempt}/${maxRetries} falhou:`, error.message)
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }
  
  throw new Error('Operação falhou após todas as tentativas')
}

serve(async (req) => {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()
  
  console.log('=== WEBHOOK HOTMART INICIADO ===')
  console.log('Request ID:', requestId)
  console.log('Timestamp:', new Date().toISOString())
  console.log('Method:', req.method)
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Rate limiting por IP
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown'
    
    const userAgent = req.headers.get('user-agent') || 'unknown'
    console.log('Cliente IP:', clientIP)
    
    if (!checkRateLimit(clientIP)) {
      console.warn('Rate limit excedido para IP:', clientIP)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Rate limit excedido' 
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Timeout para operações críticas
    const timeoutMs = 30000 // 30 segundos
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout na operação')), timeoutMs)
    )

    const webhookData: HotmartWebhookData = await Promise.race([
      req.json(),
      timeoutPromise
    ]) as HotmartWebhookData

    console.log('Dados do webhook recebidos:', {
      action: webhookData.action,
      buyerEmail: webhookData.buyer?.email?.substring(0, 5) + '***',
      purchaseStatus: webhookData.purchase?.status,
      productName: webhookData.product?.name
    })

    // Validações rigorosas dos dados
    if (!webhookData.buyer?.email || !webhookData.buyer?.name) {
      console.error('Dados do comprador ausentes:', webhookData.buyer)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Dados do comprador inválidos' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

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

    // Sanitizar e validar dados de entrada
    const email = sanitizeString(webhookData.buyer.email).toLowerCase()
    const name = sanitizeString(webhookData.buyer.name)
    const produto = sanitizeString(webhookData.product?.name || 'Calculadora Inventário')
    
    // LOG 1: Webhook recebido
    await supabase.from('log_compras_hotmart').insert({
      request_id: requestId,
      email,
      nome: name,
      produto,
      status: 'webhook_recebido',
      webhook_payload: webhookData,
      ip_origem: clientIP,
      user_agent: userAgent
    })

    if (!isValidEmail(email)) {
      console.error('E-mail inválido:', email)
      await supabase.from('log_compras_hotmart').update({
        status: 'erro_validacao',
        etapa_falha: 'validacao_email',
        erro_mensagem: 'E-mail inválido'
      }).eq('request_id', requestId)
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'E-mail inválido' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!name || name.length < 2) {
      console.error('Nome inválido:', name)
      await supabase.from('log_compras_hotmart').update({
        status: 'erro_validacao',
        etapa_falha: 'validacao_nome',
        erro_mensagem: 'Nome inválido'
      }).eq('request_id', requestId)
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Nome inválido' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Processando usuário no banco de dados...')

    // Verificar se usuário já existe (com retry)
    const { data: usuarioExistente } = await retryOperation(async () => {
      const result = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single()
      return result
    })

    let isNewUser = false
    let tokenDefinicaoSenha: string

    // Gerar token seguro usando a função do banco
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('gerar_token_seguro')
    
    if (tokenError || !tokenData) {
      console.error('Erro ao gerar token:', tokenError)
      throw new Error('Falha ao gerar token de segurança')
    }
    
    tokenDefinicaoSenha = tokenData

    let usuarioId: string | null = null

    if (usuarioExistente) {
      console.log('Atualizando usuário existente...')
      usuarioId = usuarioExistente.id
      
      // Atualizar usuário existente (com retry)
      await retryOperation(async () => {
        const { error: updateError } = await supabase
          .from('usuarios')
          .update({
            ativo: true,
            data_ativacao: new Date().toISOString(),
            produto: produto,
            token_definicao_senha: tokenDefinicaoSenha,
            token_gerado_em: new Date().toISOString()
          })
          .eq('email', email)

        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError)
          throw updateError
        }
      })

      console.log('Usuário atualizado com sucesso:', email)
      
      // LOG 2: Usuário atualizado
      await supabase.from('log_compras_hotmart').update({
        status: 'usuario_atualizado',
        usuario_id: usuarioId
      }).eq('request_id', requestId)
    } else {
      console.log('Criando novo usuário...')
      isNewUser = true
      
      // Criar novo usuário (com retry)
      const { data: novoUsuario } = await retryOperation(async () => {
        const result = await supabase
          .from('usuarios')
          .insert({
            nome: name,
            email: email,
            ativo: true,
            data_ativacao: new Date().toISOString(),
            produto: produto,
            token_definicao_senha: tokenDefinicaoSenha,
            token_gerado_em: new Date().toISOString()
          })
          .select()
          .single()

        if (result.error) {
          console.error('Erro ao criar usuário:', result.error)
          throw result.error
        }
        return result
      })

      usuarioId = novoUsuario?.id || null
      console.log('Usuário criado com sucesso:', email)
      
      // LOG 3: Usuário criado
      await supabase.from('log_compras_hotmart').update({
        status: 'usuario_criado',
        usuario_id: usuarioId
      }).eq('request_id', requestId)
    }

    // Enviar e-mail de boas-vindas automático
    console.log('Enviando e-mail de boas-vindas...')
    
    try {
      // Chamar edge function de envio de e-mail
      const emailResponse = await supabase.functions.invoke('send-welcome-email', {
        body: {
          nome: name,
          email: email,
          token: tokenDefinicaoSenha,
          produto: produto,
          siteUrl: 'https://app.inventariodescomplicado.com.br' // URL de produção
        }
      })

      if (emailResponse.error) {
        console.error('Erro ao enviar e-mail:', emailResponse.error)
        
        // LOG 4A: Erro ao enviar email
        await supabase.from('log_compras_hotmart').update({
          status: 'erro_email',
          etapa_falha: 'envio_email',
          erro_mensagem: emailResponse.error.message || 'Erro desconhecido',
          tempo_processamento_ms: Date.now() - startTime
        }).eq('request_id', requestId)
        
        // Notificar admin do erro
        await supabase.functions.invoke('notificar-admin-erro', {
          body: {
            request_id: requestId,
            email,
            nome: name,
            produto,
            etapa_falha: 'envio_email',
            erro_mensagem: emailResponse.error.message || 'Erro ao enviar email',
            timestamp: new Date().toISOString()
          }
        })
        
        console.warn('E-mail não enviado, mas usuário foi processado. Token:', tokenDefinicaoSenha)
      } else {
        console.log('E-mail enviado com sucesso:', emailResponse.data)
        
        // LOG 4B: Email enviado com sucesso
        await supabase.from('log_compras_hotmart').update({
          status: 'email_enviado',
          processado_em: new Date().toISOString(),
          tempo_processamento_ms: Date.now() - startTime
        }).eq('request_id', requestId)
      }
    } catch (emailError) {
      console.error('Falha crítica no envio de e-mail:', emailError)
      
      // LOG 4C: Erro crítico no email
      await supabase.from('log_compras_hotmart').update({
        status: 'erro_email',
        etapa_falha: 'envio_email_critico',
        erro_mensagem: emailError.message,
        erro_stack: emailError.stack,
        tempo_processamento_ms: Date.now() - startTime
      }).eq('request_id', requestId)
      
      // Notificar admin do erro crítico
      await supabase.functions.invoke('notificar-admin-erro', {
        body: {
          request_id: requestId,
          email,
          nome: name,
          produto,
          etapa_falha: 'envio_email_critico',
          erro_mensagem: emailError.message,
          timestamp: new Date().toISOString()
        }
      })
      
      console.warn('E-mail não enviado devido a erro, mas usuário foi processado. Token:', tokenDefinicaoSenha)
    }

    // Métricas de performance
    const processingTime = Date.now() - startTime
    console.log('=== WEBHOOK HOTMART CONCLUÍDO ===')
    console.log('Request ID:', requestId)
    console.log('Tempo de processamento:', processingTime + 'ms')
    console.log('Novo usuário:', isNewUser)
    console.log('E-mail enviado para:', email.substring(0, 5) + '***')

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Usuário processado e e-mail enviado com sucesso',
      requestId: requestId,
      isNewUser: isNewUser,
      processingTime: processingTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Erro no webhook Hotmart:', error)
    
    // LOG ERRO: Erro geral não capturado
    try {
      await supabase.from('log_compras_hotmart').insert({
        request_id: requestId,
        email: 'erro_webhook@desconhecido.com',
        nome: 'Erro ao processar',
        status: 'erro_banco',
        etapa_falha: 'processamento_geral',
        erro_mensagem: error.message,
        erro_stack: error.stack,
        webhook_payload: {},
        ip_origem: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })
      
      // Notificar admin do erro geral
      await supabase.functions.invoke('notificar-admin-erro', {
        body: {
          request_id: requestId,
          email: 'erro_webhook@desconhecido.com',
          nome: 'Erro ao processar',
          produto: 'N/A',
          etapa_falha: 'processamento_geral',
          erro_mensagem: error.message,
          timestamp: new Date().toISOString()
        }
      })
    } catch (logError) {
      console.error('Erro ao registrar erro no log:', logError)
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})