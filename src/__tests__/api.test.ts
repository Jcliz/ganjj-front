import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authApi, cestaApi } from '../lib/api';

function mockFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch(200, {}));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ── Teste 1 ──────────────────────────────────────────────────────────────────
describe('request wrapper', () => {
  it('envia credentials: include em todas as requisições', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { usuario: null }));
    await authApi.me();
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(options.credentials).toBe('include');
  });

  // ── Teste 2 ──────────────────────────────────────────────────────────────
  it('lança Error quando a resposta não é ok', async () => {
    vi.stubGlobal('fetch', mockFetch(401, { error: 'Não autorizado.' }));
    await expect(authApi.me()).rejects.toThrow('Não autorizado.');
  });

  // ── Teste 3 ──────────────────────────────────────────────────────────────
  it('usa "Erro desconhecido." quando o corpo não traz campo error', async () => {
    vi.stubGlobal('fetch', mockFetch(500, {}));
    await expect(authApi.me()).rejects.toThrow('Erro desconhecido.');
  });
});

// ── Teste 4 ──────────────────────────────────────────────────────────────────
describe('authApi.login', () => {
  it('faz POST para /api/auth/login com email e senha', async () => {
    const usuario = { id: 1, nome: 'João', email: 'j@j.com', is_admin: false, criado_em: '' };
    vi.stubGlobal('fetch', mockFetch(200, { message: 'ok', usuario }));
    await authApi.login('j@j.com', 'senha123');
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/auth/login');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body as string)).toEqual({ email: 'j@j.com', password: 'senha123' });
  });
});

// ── Teste 5 ──────────────────────────────────────────────────────────────────
describe('cestaApi.addItem', () => {
  it('faz POST para /api/cesta/itens com produto_id e quantidade', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { message: 'adicionado' }));
    await cestaApi.addItem(42, 3);
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/cesta/itens');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body as string)).toEqual({ produto_id: 42, quantidade: 3 });
  });
});
