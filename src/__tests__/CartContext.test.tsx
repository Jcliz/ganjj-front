import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import type { ReactNode } from 'react';
import type { CestaItem } from '../lib/api';

const mockUsuario = { id: 1, nome: 'Ana', email: 'ana@ganjj.com', is_admin: false, criado_em: '2024-01-01' };

const mockItems: CestaItem[] = [
  { id: 1, produto_id: 10, nome: 'Camiseta Verde', preco: 80, cor: 'verde', imagem_url: null, quantidade: 2 },
  { id: 2, produto_id: 20, nome: 'Calça Bege', preco: 150, cor: 'bege', imagem_url: null, quantidade: 1 },
];

function makeFetchChain(calls: Array<{ ok: boolean; body: unknown }>) {
  const mock = vi.fn();
  calls.forEach(({ ok, body }) =>
    mock.mockResolvedValueOnce({ ok, status: ok ? 200 : 400, json: () => Promise.resolve(body) })
  );
  return mock;
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    makeFetchChain([
      // AuthProvider.me() → usuário logado
      { ok: true, body: { usuario: mockUsuario } },
      // CartProvider.fetchCart() → itens iniciais
      { ok: true, body: { itens: mockItems } },
    ])
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ── Teste 9 ──────────────────────────────────────────────────────────────────
describe('CartProvider - itemCount', () => {
  it('soma corretamente as quantidades dos itens', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    // aguarda o carrinho ser preenchido
    await waitFor(() => expect(result.current.items).toHaveLength(2));
    // item 1: quantidade 2, item 2: quantidade 1 → total = 3
    expect(result.current.itemCount).toBe(3);
  });
});

// ── Teste 10 ─────────────────────────────────────────────────────────────────
describe('CartProvider - subtotal', () => {
  it('calcula corretamente o subtotal dos itens', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toHaveLength(2));
    // 80*2 + 150*1 = 310
    expect(result.current.subtotal).toBe(310);
  });
});

// ── Teste bônus ───────────────────────────────────────────────────────────────
describe('CartProvider - updateItem com quantidade < 1', () => {
  it('chama removeItem em vez de updateItem quando quantidade é 0', async () => {
    vi.stubGlobal(
      'fetch',
      makeFetchChain([
        { ok: true, body: { usuario: mockUsuario } },
        { ok: true, body: { itens: mockItems } },
        // updateItem vai chamar DELETE (removeItem)
        { ok: true, body: { message: 'removido' } },
        // re-fetch do carrinho após remoção
        { ok: true, body: { itens: [mockItems[1]] } },
      ])
    );

    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.items).toHaveLength(2));

    await act(async () => {
      await result.current.updateItem(10, 0);
    });

    // Verifica que a terceira chamada fetch foi um DELETE (removeItem)
    const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls as Array<[string, RequestInit]>;
    const deleteCall = calls.find(([url, opts]) => url.includes('/api/cesta/itens/10') && opts.method === 'DELETE');
    expect(deleteCall).toBeDefined();
  });
});
