import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authApi, type Usuario, type RegisterPayload } from '../lib/api';

interface AuthState {
  usuario: Usuario | null;
  /** true enquanto verifica a sessão inicial */
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    usuario: null,
    loading: true,
  });

  // Ao montar, tenta restaurar a sessão pelo cookie
  useEffect(() => {
    authApi
      .me()
      .then(({ usuario }) => setState({ usuario, loading: false }))
      .catch(() => setState({ usuario: null, loading: false }));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { usuario } = await authApi.login(email, password);
    setState({ usuario, loading: false });
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { usuario } = await authApi.register(payload);
    setState({ usuario, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setState({ usuario: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
