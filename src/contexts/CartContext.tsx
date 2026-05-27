import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { cestaApi, type CestaItem } from '../lib/api';
import { useAuth } from './AuthContext';

interface CartState {
  items: CestaItem[];
  loading: boolean;
}

interface CartContextValue extends CartState {
  addItem: (produto_id: number, quantidade?: number) => Promise<void>;
  updateItem: (produto_id: number, quantidade: number) => Promise<void>;
  removeItem: (produto_id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  const [state, setState] = useState<CartState>({ items: [], loading: false });

  const fetchCart = useCallback(async () => {
    if (!usuario) {
      setState({ items: [], loading: false });
      return;
    }
    setState(s => ({ ...s, loading: true }));
    try {
      const { itens } = await cestaApi.get();
      setState({ items: itens, loading: false });
    } catch {
      setState({ items: [], loading: false });
    }
  }, [usuario]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (produto_id: number, quantidade = 1) => {
    await cestaApi.addItem(produto_id, quantidade);
    await fetchCart();
  }, [fetchCart]);

  const updateItem = useCallback(async (produto_id: number, quantidade: number) => {
    if (quantidade < 1) {
      await cestaApi.removeItem(produto_id);
    } else {
      await cestaApi.updateItem(produto_id, quantidade);
    }
    await fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (produto_id: number) => {
    await cestaApi.removeItem(produto_id);
    await fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    await cestaApi.clear();
    setState({ items: [], loading: false });
  }, []);

  const itemCount = state.items.reduce((s, i) => s + i.quantidade, 0);
  const subtotal = state.items.reduce((s, i) => s + i.preco * i.quantidade, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, updateItem, removeItem, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de <CartProvider>');
  return ctx;
}
