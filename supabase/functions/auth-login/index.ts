import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { email, password }: LoginRequest = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email e senha são obrigatórios' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Buscar usuário pelo email
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !usuario) {
      console.log('Usuário não encontrado:', email)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email ou senha incorretos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Conta não ativada. Verifique seu email.' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar se a senha foi definida
    if (!usuario.senha_hash) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Senha não foi definida. Verifique seu email para o link de ativação.' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(password, usuario.senha_hash)
    
    if (!senhaValida) {
      console.log('Senha incorreta para:', email)
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email ou senha incorretos' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Login bem-sucedido
    console.log('Login bem-sucedido para:', email)
    
    // Remover dados sensíveis antes de retornar
    const { senha_hash, token_definicao_senha, ...usuarioSeguro } = usuario

    return new Response(JSON.stringify({ 
      success: true, 
      user: usuarioSeguro,
      message: 'Login realizado com sucesso'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})