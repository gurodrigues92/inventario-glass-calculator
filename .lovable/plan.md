

# Plano: Implementar Logs Detalhados no auth-login e Testar Fluxo Completo

## Objetivo

Adicionar logs detalhados na função `auth-login` para diagnosticar exatamente onde a verificação de senha está falhando, e testar o fluxo completo de login.

---

## Diagnóstico Atual

| Usuário | Status |
|---------|--------|
| gurodrigues92@gmail.com | ❌ Tem senha mas falha ao verificar |
| ketlenmarin@gmail.com | ✅ Tem senha (precisa testar) |
| gustavodoads2@outlook.com | ✅ Tem senha (precisa testar) |
| 5 outros usuários | ⚠️ Nunca definiram senha |

---

## Modificações Técnicas

### Arquivo: `supabase/functions/auth-login/index.ts`

Adicionar logs detalhados na função `verifyPassword()` para rastrear cada etapa:

```typescript
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  console.log('=== VERIFICAÇÃO DE SENHA - INÍCIO ===');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    // Log do formato do hash
    console.log('Hash recebido - primeiros 20 chars:', hash.substring(0, 20));
    console.log('Hash recebido - comprimento total:', hash.length);
    
    // Verificar bcrypt
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
      'raw', data, { name: 'PBKDF2' }, false, ['deriveBits']
    );
    
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
      key, 256
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
```

### Logs Adicionais no Handler Principal

```typescript
// Após buscar usuário
console.log('📋 Dados do usuário encontrado:');
console.log('- ID:', usuario.id);
console.log('- Email:', usuario.email);
console.log('- Ativo:', usuario.ativo);
console.log('- Tem senha_hash:', !!usuario.senha_hash);
console.log('- Hash prefixo:', usuario.senha_hash?.substring(0, 20) + '...');
```

---

## Teste do Fluxo Completo

Após implementar os logs, vou:

1. **Chamar a edge function auth-login** com um usuário de teste
2. **Verificar os logs** para identificar exatamente onde falha
3. **Comparar o hash gerado** com o hash armazenado

---

## Arquivos Afetados

| Arquivo | Ação |
|---------|------|
| `supabase/functions/auth-login/index.ts` | Adicionar logs detalhados |

---

## Resultado Esperado

Com os logs detalhados, poderemos identificar:

- Se o formato do hash está correto
- Se o salt está sendo extraído corretamente
- Se o PBKDF2 está gerando o mesmo resultado
- Em qual byte exato a comparação falha

Isso permitirá diagnosticar se o problema é:
1. Hash gerado com parâmetros diferentes
2. Problema na conversão hex -> bytes
3. Senha diferente da que foi definida

