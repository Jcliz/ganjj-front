import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authApi, cestaApi, produtoApi, saleApi } from '../lib/api';

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
    expect(JSON.parse(options.body as string)).toEqual({ email: 'j@j.com', senha: 'senha123' });
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

// ── authApi ───────────────────────────────────────────────────────────────────

describe('authApi.register', () => {
  it('faz POST para /api/auth/register com os campos corretos', async () => {
    const usuario = { id: 1, nome: 'Ana Silva', email: 'a@b.com', is_admin: false, criado_em: '' };
    vi.stubGlobal('fetch', mockFetch(201, { message: 'ok', usuario }));
    const payload = { firstName: 'Ana', lastName: 'Silva', email: 'a@b.com', senha: '123' };
    await authApi.register(payload);
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/auth/register');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body as string)).toEqual(payload);
  });
});

describe('authApi.logout', () => {
  it('faz POST para /api/auth/logout', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { message: 'Logout realizado com sucesso' }));
    await authApi.logout();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/auth/logout');
    expect(options.method).toBe('POST');
  });
});

// ── produtoApi ────────────────────────────────────────────────────────────────

describe('produtoApi.getAll', () => {
  it('faz GET para /api/produtos', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await produtoApi.getAll();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/produtos');
    expect(options.method).toBeUndefined();
  });
});

describe('produtoApi.getById', () => {
  it('faz GET para /api/produtos/:id', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { id: 5 }));
    await produtoApi.getById(5);
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/produtos/5');
  });
});

// ── saleApi ───────────────────────────────────────────────────────────────────

describe('saleApi.list', () => {
  it('faz GET para /api/sale sem query string quando categoria é undefined', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await saleApi.list();
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/sale');
    expect(url).not.toContain('?');
  });

  it('faz GET para /api/sale sem query string quando categoria é "Todos"', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await saleApi.list('Todos');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).not.toContain('?');
  });

  it('inclui categoria na query string quando fornecida', async () => {
    vi.stubGlobal('fetch', mockFetch(200, []));
    await saleApi.list('Superiores');
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('categoria=Superiores');
  });
});

// ── cestaApi (demais métodos) ─────────────────────────────────────────────────

describe('cestaApi.get', () => {
  it('faz GET para /api/cesta', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { itens: [] }));
    await cestaApi.get();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/cesta');
    expect(options.method).toBeUndefined();
  });
});

describe('cestaApi.clear', () => {
  it('faz DELETE para /api/cesta', async () => {
    vi.stubGlobal('fetch', mockFetch(200, { message: 'ok' }));
    await cestaApi.clear();
    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/api/cesta');
    expect(options.method).toBe('DELETE');
  });
});
