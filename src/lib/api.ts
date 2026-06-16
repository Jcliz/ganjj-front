const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:3000';

export interface ApiError {
  error: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  is_admin: boolean;
  criado_em: string;
}

// Wrapper genérico — sempre envia credentials (cookie JWT)
async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  // Respostas sem corpo (ex.: 204) ou não-JSON não devem quebrar o parse
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error((data as ApiError | null)?.error ?? 'Erro desconhecido.');
  }

  return data as T;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  message: string;
  usuario: Usuario;
}

export interface MeResponse {
  usuario: Usuario;
}

export const authApi = {
  register: (body: RegisterPayload) =>
    request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha: password }),
    }),

  me: () => request<MeResponse>('/api/auth/me'),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
};

// ─── Produto ───────────────────────────────────────────────────────────────

export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  cor: string | null;
  status: boolean;
  imagem_url: string | null;
  popular: boolean;
  feminino: boolean;
  novo: boolean;
  social: boolean;
  tipo_roupa: string | null;
  tamanhos: string[] | null;
  criado_em: string;
  em_sale: boolean;
  desconto_pct: number | null;
  preco_sale: number | null;
}

export interface ProdutoPayload {
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  cor?: string;
  status?: boolean;
  imagem_url?: string;
  popular?: boolean;
  feminino?: boolean;
  novo?: boolean;
  social?: boolean;
  tipo_roupa?: string;
  tamanhos?: string[];
}

export const produtoApi = {
  getAll: () => request<Produto[]>('/api/produtos'),
  getById: (id: number) => request<Produto>(`/api/produtos/${id}`),
  create: (body: ProdutoPayload) =>
    request<Produto>('/api/produtos', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: number, body: Partial<ProdutoPayload>) =>
    request<Produto>(`/api/produtos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: number) =>
    request<{ message: string }>(`/api/produtos/${id}`, { method: 'DELETE' }),
};

export const uploadApi = {
  uploadImagem: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('imagem', file);
    const res = await fetch(`${BASE_URL}/api/produtos/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error((data as ApiError).error ?? 'Erro no upload');
    return (data as { url: string }).url;
  },
};

// ─── Sale ──────────────────────────────────────────────────────────────────

export type SaleCategoria = 'Superiores' | 'Inferiores' | 'Inverno';

export interface SaleItem {
  id: number;
  nome: string;
  descricao: string | null;
  preco: number;
  preco_sale: number;
  estoque: number;
  cor: string | null;
  status: boolean;
  imagem_url: string | null;
  popular: boolean;
  feminino: boolean;
  criado_em: string;
  sale_id: number;
  desconto_pct: number;
  categoria: SaleCategoria;
}

export const saleApi = {
  list: (categoria?: string) => {
    const qs = categoria && categoria !== 'Todos'
      ? `?categoria=${encodeURIComponent(categoria)}`
      : '';
    return request<SaleItem[]>(`/api/sale${qs}`);
  },
};

// ─── Cesta ─────────────────────────────────────────────────────────────────

export interface CestaItem {
  id: number;
  produto_id: number;
  nome: string;
  preco: number;
  cor: string | null;
  imagem_url: string | null;
  quantidade: number;
}

export interface CestaResponse {
  itens: CestaItem[];
}

// ─── Pedidos ───────────────────────────────────────────────────────────────

export interface PedidoItem {
  nome: string;
  tamanho: string | null;
  quantidade: number;
  preco: number;
}

export interface Pedido {
  id: number;
  codigo: string;
  status: string;
  passo_atual: number;
  total: number;
  endereco_entrega: string | null;
  numero_rastreio: string | null;
  criado_em: string;
  itens: PedidoItem[];
}

export interface AdminPedido extends Pedido {
  cliente_nome: string | null;
  cliente_email: string | null;
}

export const pedidoApi = {
  meus: () => request<Pedido[]>('/api/pedidos/meus'),
  adminTodos: () => request<AdminPedido[]>('/api/pedidos/admin/todos'),
  atualizarPasso: (id: number, passo: number) =>
    request<{ id: number; passo_atual: number; status: string }>(`/api/pedidos/${id}/passo`, {
      method: 'PUT',
      body: JSON.stringify({ passo }),
    }),
};

// ─── Cesta ─────────────────────────────────────────────────────────────────

export const cestaApi = {
  get: () =>
    request<CestaResponse>('/api/cesta'),

  addItem: (produto_id: number, quantidade = 1) =>
    request<{ message: string }>('/api/cesta/itens', {
      method: 'POST',
      body: JSON.stringify({ produto_id, quantidade }),
    }),

  updateItem: (produto_id: number, quantidade: number) =>
    request<{ message: string }>(`/api/cesta/itens/${produto_id}`, {
      method: 'PUT',
      body: JSON.stringify({ quantidade }),
    }),

  removeItem: (produto_id: number) =>
    request<{ message: string }>(`/api/cesta/itens/${produto_id}`, {
      method: 'DELETE',
    }),

  clear: () =>
    request<{ message: string }>('/api/cesta', { method: 'DELETE' }),
};
