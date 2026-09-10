import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function setup() {
  const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });
  return result;
}

const supabaseUrl = 'https://example.supabase.co';
const anon = 'anon';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
  (import.meta as any).env = {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: anon
  };
  localStorage.clear();
});

describe('AuthContext login via Edge Function', () => {
  it('returns needsPasswordDefinition and token on SENHA_NAO_DEFINIDA', async () => {
    (fetch as any).mockResolvedValueOnce(new Response(
      JSON.stringify({
        success: false,
        error: 'SENHA_NAO_DEFINIDA',
        message: 'Você precisa definir sua senha primeiro.',
        token: 'def-token'
      }), { status: 401 }
    ));

    const result = setup();
    const res = await result.current.login('user@ex.com', 'pass');
    expect(res.success).toBe(false);
    expect(res.error).toBe('SENHA_NAO_DEFINIDA');
    expect(res.needsPasswordDefinition).toBe(true);
    expect(res.token).toBe('def-token');
  });

  it('persists user and succeeds on successful function response', async () => {
    (fetch as any).mockResolvedValueOnce(new Response(
      JSON.stringify({
        success: true,
        user: {
          id: '1',
          nome: 'User',
          email: 'user@ex.com',
          ativo: true,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z'
        },
        message: 'Login realizado com sucesso'
      }), { status: 200 }
    ));

    const result = setup();
    const res = await result.current.login('user@ex.com', 'pass');
    expect(res.success).toBe(true);
    const stored = localStorage.getItem('inventario_user');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.email).toBe('user@ex.com');
  });
});

describe('AuthContext login fallback to Supabase Auth', () => {
  it('falls back when function unavailable and succeeds', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('network error'));

    const mockAuth = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: '2', email: 'f@ex.com', created_at: '2024-01-01T00:00:00.000Z' } },
          error: null
        }),
        signOut: vi.fn()
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'no row' } })
          })
        })
      })
    };

    vi.mock('@/integrations/supabase/client', () => ({ supabase: mockAuth }));

    const result = setup();
    const res = await result.current.login('f@ex.com', 'pass');
    expect(res.success).toBe(true);
    const stored = localStorage.getItem('inventario_user');
    expect(stored).toBeTruthy();
  });
});
