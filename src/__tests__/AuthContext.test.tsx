import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

const mockUsuario = { id: 1, nome: 'Ana', email: 'ana@ganjj.com', is_admin: false, criado_em: '2024-01-01' };

function makeFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

beforeEach(() => {
  // Por padrão, /me retorna 401 (sem sessão ativa)
  vi.stubGlobal('fetch', makeFetch(401, { error: 'sem sessão' }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ── Teste 6 ──────────────────────────────────────────────────────────────────
describe('useAuth', () => {
  it('lança erro quando usado fora do AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth deve ser usado dentro de <AuthProvider>'
    );
  });
});

// ── Teste 7 ──────────────────────────────────────────────────────────────────
describe('AuthProvider - login', () => {
  it('atualiza usuario no estado após login bem-sucedido', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        // primeira chamada: authApi.me() no mount
        .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({ error: 'não autenticado' }) })
        // segunda chamada: authApi.login()
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ message: 'ok', usuario: mockUsuario }) })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('ana@ganjj.com', 'senha');
    });

    expect(result.current.usuario).toEqual(mockUsuario);
  });
});

// ── Teste 8 ──────────────────────────────────────────────────────────────────
describe('AuthProvider - logout', () => {
  it('limpa usuario após logout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        // mount: /me retorna usuário logado
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ usuario: mockUsuario }) })
        // logout
        .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve({ message: 'ok' }) })
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.usuario).toEqual(mockUsuario));

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.usuario).toBeNull();
  });
});
