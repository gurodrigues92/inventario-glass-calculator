import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { assinarSessao } from '../_shared/sessao.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LoginRequest {
  email: string;
  password: string;
}

// Função para hash da senha usando Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    256
  );
  
  const hash = Array.from(new Uint8Array(bits));
  const saltArray = Array.from(salt);
  
  return `${saltArray.map(b => b.toString(16).padStart(2, '0')).join('')}:${hash.map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

// Função para verificar senha usando Web Crypto API
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  console.log('=== VERIFICAÇÃO DE SENHA - INÍCIO ===');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    // Log do formato do hash
    console.log('Hash recebido - primeiros 20 chars:', hash?.substring(0, 20));
    console.log('Hash recebido - comprimento total:', hash?.length);
    
    // Se o hash parece ser do bcrypt (começa com $2), falha para forçar reset
    if (hash.startsWith('$2')) {
      console.log('❌ Hash bcrypt detectado - formato incompatível');
      return false;
    }
    
    // Validar entrada
    if (!password || !hash) {
      console.log('❌ Password ou hash vazio');
      return false;
    }

    // Separar salt e hash
    const [saltHex, hashHex] = hash.split(':');
    console.log('Salt hex - comprimento:', saltHex?.length);
    console.log('Hash hex - comprimento:', hashHex?.length);
    
    if (!saltHex || !hashHex) {
      console.log('❌ Formato de hash inválido - não contém ":"');
      return false;
    }
    
    // Validar formato hexadecimal
    const saltValid = /^[a-f0-9]+$/i.test(saltHex);
    const hashValid = /^[a-f0-9]+$/i.test(hashHex);
    console.log('Salt é hex válido:', saltValid);
    console.log('Hash é hex válido:', hashValid);
    
    if (!saltValid || !hashValid) {
      console.log('❌ Hash contém caracteres inválidos');
      return false;
    }
    
    // Converter salt
    const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    console.log('Salt convertido - bytes:', salt.length);
    
    // Converter hash esperado
    const expectedHash = hashHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16));
    console.log('Hash esperado - bytes:', expectedHash.length);
    
    // Derivar hash da senha fornecida
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    console.log('Senha codificada - bytes:', data.length);
    
    const key = await crypto.subtle.importKey(
      'raw',
      data,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      256
    );
    
    const actualHash = Array.from(new Uint8Array(bits));
    console.log('Hash calculado - bytes:', actualHash.length);
    
    // Comparar byte a byte
    let mismatchIndex = -1;
    const match = actualHash.every((byte, index) => {
      if (byte !== expectedHash[index]) {
        if (mismatchIndex === -1) mismatchIndex = index;
        return false;
      }
      return true;
    });
    
    if (match) {
      console.log('✅ Senha verificada com sucesso');
    } else {
      console.log('❌ Senha não corresponde');
      console.log('Primeiro byte diferente no índice:', mismatchIndex);
      console.log('Esperado (hex):', expectedHash.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join(''));
      console.log('Calculado (hex):', actualHash.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join(''));
    }
    
    console.log('=== VERIFICAÇÃO DE SENHA - FIM ===');
    return match;
    
  } catch (error) {
    console.error('❌ Erro na verificação da senha:', error);
    console.error('Stack:', error.stack);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey, {
      db: { schema: 'inventario_glass' },
      global: {
        headers: {
          'Accept-Profile': 'inventario_glass',
          'Content-Profile': 'inventario_glass'
        }
      }
    })

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

    // Buscar usuário pelo email ignorando caixa: o front normaliza pra minuscula,
    // mas o cadastro veio da Hotmart com a caixa original (09/09/2026, cliente travado).
    // `_` e `%` sao curinga no LIKE e aparecem em email de verdade: escapar.
    const emailNormalizado = email.trim().toLowerCase()
    const emailPattern = emailNormalizado.replace(/[\\%_]/g, (c) => `\\${c}`)

    // Duplicata por caixa existe na base (mesmo e-mail em dois produtos): pegar a
    // linha exata quando houver, e so cair no match sem caixa se nao for ambiguo.
    const escolher = (linhas: any[] | null) =>
      linhas?.find((u) => u.email === emailNormalizado) ??
      (linhas?.length === 1 ? linhas[0] : null)

    const { data: candidatos, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .ilike('email', emailPattern)
      .limit(5)

    const usuario = escolher(candidatos)

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

    // Verificar se a senha foi definida
    if (!usuario.senha_hash) {
      // O token de definicao NAO sai daqui: esta e a resposta a uma chamada sem senha
      // valida, e devolver o token entregaria a conta pra quem souber o email.
      console.log('Usuário sem senha definida:', email);
      return new Response(JSON.stringify({
        success: false,
        error: 'SENHA_NAO_DEFINIDA',
        message: 'Você ainda não definiu sua senha. Solicite o link por e-mail.'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      console.log('Usuário inativo:', email);
      return new Response(JSON.stringify({
        success: false,
        error: 'CONTA_INATIVA',
        message: 'Sua conta não está ativa. Defina sua senha primeiro.'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Log detalhado do usuário encontrado
    console.log('📋 Dados do usuário encontrado:');
    console.log('- ID:', usuario.id);
    console.log('- Email:', usuario.email);
    console.log('- Ativo:', usuario.ativo);
    console.log('- Tem senha_hash:', !!usuario.senha_hash);
    console.log('- Hash prefixo:', usuario.senha_hash?.substring(0, 20) + '...');

    // Verificar senha
    console.log('Verificando senha para usuário:', email);
    const senhaValida = await verifyPassword(password, usuario.senha_hash);
    
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

    // Detectar primeiro login + alertar Discord
    if (!usuario.primeiro_login_em) {
      const agora = new Date().toISOString()
      await supabase
        .from('usuarios')
        .update({ primeiro_login_em: agora })
        .eq('id', usuario.id)

      const discordWebhook = Deno.env.get('DISCORD_WEBHOOK_INVENTARIO')
      if (discordWebhook) {
        const payload = {
          username: 'Calculadora Inventário',
          embeds: [{
            title: '🔐 Primeiro login realizado',
            color: 3447003,
            fields: [
              { name: 'Nome', value: usuario.nome || '—', inline: true },
              { name: 'Email', value: usuario.email, inline: true },
              { name: 'WhatsApp', value: usuario.telefone || '—', inline: true },
              { name: 'Produto', value: usuario.produto || '—', inline: false }
            ],
            timestamp: agora
          }]
        }
        fetch(discordWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(err => console.error('Erro Discord (primeiro login):', err))
      }
    }

    // Remover dados sensíveis antes de retornar
    const { senha_hash, token_definicao_senha, ...usuarioSeguro } = usuario

    // Sessao assinada: e isso que autoriza as chamadas seguintes. O front nao
    // manda mais usuarioId no corpo pra dizer quem e.
    const sessao = await assinarSessao(usuario.id)

    return new Response(JSON.stringify({
      success: true,
      session: sessao,
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