const BASE_URL = 'http://localhost:3000';

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

  const data = await res.json();

  if (!res.ok) {
    throw new Error((data as ApiError).error ?? 'Erro desconhecido.');
  }

  return data as T;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<MeResponse>('/api/auth/me'),

  logout: () =>
    request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
};
