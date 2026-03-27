import { useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#737373" strokeWidth="1.5" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="3,6 5,6 21,6" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6l-1 14H6L5 6" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="6" x2="6" y2="18" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ dir = "down" }: { dir?: "up" | "down" }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      style={{ transform: dir === "up" ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
    >
      <polyline points="6,9 12,15 18,9" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#b0aeae" strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke="#b0aeae" strokeWidth="1.5" />
      <polyline points="21,15 16,10 5,21" stroke="#b0aeae" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Category = "Women" | "Men";
type ProdStatus = "Active" | "Inactive";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: Category;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  color: string;
  colorName: string;
  status: ProdStatus;
  createdAt: string;
}

type ProductPayload = Omit<Product, "id" | "createdAt">;

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:3000";
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/produtos`;

const SWATCH_PALETTE: Record<string, string> = {
  Uniform: "#1a1a1a",
  "Cream": "#f5f0e8",
  "Slate": "#5c6b7a",
  "Cognac": "#8b4a2f",
  "Forest": "#2e4a3a",
  "Dusty Rose": "#c49a9a",
  "Ivory": "#f5f2ec",
  "Navy": "#1c2d4a",
  "Sand": "#c8b89a",
  "Sage": "#8a9e8a",
  "Bone": "#e8e2d8",
  "Black": "#262626",
};

const CATEGORIES: Category[] = ["Women", "Men"];
const PROD_STATUSES: ProdStatus[] = ["Active", "Inactive"];
const COLOR_OPTIONS = Object.entries(SWATCH_PALETTE).map(([name, hex]) => ({ name, hex }));

function hexToColorName(hex?: string | null) {
  if (!hex) return "Black";
  const found = Object.entries(SWATCH_PALETTE).find(([, paletteHex]) => paletteHex.toLowerCase() === hex.toLowerCase());
  return found ? found[0] : "Black";
}

function boolToStatus(value: unknown): ProdStatus {
  if (value === true || value === "Active") return "Active";
  return "Inactive";
}

function parseApiProduct(raw: any): Product {
  const category: Category = raw.feminino ? "Women" : "Men";
  return {
    id: Number(raw.id),
    name: String(raw.nome ?? ""),
    sku: generateSku(String(raw.nome ?? "PRD"), category, Number(raw.id ?? 0)),
    category,
    description: String(raw.descricao ?? ""),
    price: Number(raw.preco ?? 0),
    comparePrice: null,
    stock: Number(raw.estoque ?? 0),
    color: String(raw.cor ?? "#262626"),
    colorName: hexToColorName(raw.cor),
    status: boolToStatus(raw.status),
    createdAt: String(raw.criado_em ?? new Date().toISOString()),
  };
}

function mapPayloadToApi(payload: ProductPayload) {
  return {
    nome: payload.name,
    descricao: payload.description,
    preco: payload.price,
    estoque: payload.stock,
    cor: payload.color,
    status: payload.status === "Active",
    feminino: payload.category === "Women",
    popular: payload.comparePrice != null,
    imagem_url: null,
  };
}

async function readResponseBody(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function getErrorMessage(response: Response, fallback: string) {
  const body = await readResponseBody(response);
  if (body && typeof body.error === "string") {
    return body.error;
  }
  return fallback;
}

async function loadProductsFromApi() {
  const response = await fetch(PRODUCTS_ENDPOINT);
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Falha ao carregar produtos."));
  }

  const body = await readResponseBody(response);
  if (!Array.isArray(body)) {
    return [] as Product[];
  }

  return body.map(parseApiProduct);
}

async function createProductInApi(payload: ProductPayload) {
  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapPayloadToApi(payload)),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Falha ao criar produto."));
  }

  const body = await readResponseBody(response);
  return parseApiProduct(body || {});
}

async function updateProductInApi(id: number, payload: ProductPayload) {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mapPayloadToApi(payload)),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Falha ao atualizar produto."));
  }

  const body = await readResponseBody(response);
  return parseApiProduct(body || {});
}

async function deleteProductInApi(id: number) {
  const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Falha ao excluir produto."));
  }
}

function fmtPrice(n: number) {
  return `$${n.toFixed(2).replace(".00", "")}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" });
}

function categoryLabel(category: Category) {
  const labels: Record<Category, string> = {
    Women: "Feminino",
    Men: "Masculino",
  };
  return labels[category];
}

function prodStatusLabel(status: ProdStatus) {
  const labels: Record<ProdStatus, string> = {
    Active: "Ativo",
    Inactive: "Inativo",
  };
  return labels[status];
}

function generateSku(name: string, cat: Category, id: number) {
  const catCode: Record<Category, string> = { Women: "W", Men: "M" };
  const word = name.trim().split(/\s+/).filter(Boolean)[0]?.slice(0, 3).toUpperCase() ?? "PRD";
  return `EVR-${catCode[cat]}-${word}-${String(id).padStart(3, "0")}`;
}

function StatusBadge({ status }: { status: ProdStatus }) {
  const cfg: Record<ProdStatus, { dot: string; label: string }> = {
    Active: { dot: "#2a7a3b", label: "#2a7a3b" },
    Inactive: { dot: "#d0021b", label: "#d0021b" },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: cfg[status].label, letterSpacing: "0.4px" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg[status].dot, flexShrink: 0 }} />
      {prodStatusLabel(status)}
    </span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span style={{ fontSize: 11, color: "#d0021b", letterSpacing: "0.4px" }}>Sem estoque</span>;
  if (stock < 10) return <span style={{ fontSize: 11, color: "#f5a623", letterSpacing: "0.4px" }}>Estoque baixo · {stock}</span>;
  return <span style={{ fontSize: 11, color: "#262626", letterSpacing: "0.4px" }}>{stock}</span>;
}

function ProductThumb({ color, colorName, name }: { color: string; colorName: string; name: string }) {
  const isLight = parseInt(color.slice(1), 16) > 0xaaaaaa;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 40, height: 40, background: color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, border: isLight ? "1px solid #dddbdc" : "none",
      }}>
        <ImageIcon />
      </div>
      <div>
        <p style={{ fontSize: 13, color: "#262626", letterSpacing: "0.2px", lineHeight: "18px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {name}
        </p>
        <p style={{ fontSize: 11, color: "#737373", letterSpacing: "0.4px", lineHeight: "16px" }}>
          {colorName}
        </p>
      </div>
    </div>
  );
}

interface ProdFormErrors {
  name?: string; price?: string; stock?: string; sku?: string;
}

interface ProdFormPayload {
  name: string; sku: string; category: Category; description: string;
  price: number; comparePrice: number | null; stock: number;
  color: string; colorName: string; status: ProdStatus;
}

interface ProdFormProps {
  initial?: Product | null;
  onSave: (data: ProdFormPayload) => void;
  onClose: () => void;
}

function ProductFormModal({ initial, onSave, onClose }: ProdFormProps) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "Women");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [comparePrice, setComparePrice] = useState(String(initial?.comparePrice ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? ""));
  const [colorName, setColorName] = useState(initial?.colorName ?? "Black");
  const [status, setStatus] = useState<ProdStatus>(initial?.status ?? "Active");
  const [errors, setErrors] = useState<ProdFormErrors>({});
  const [focused, setFocused] = useState<string | null>(null);

  const selectedColor = SWATCH_PALETTE[colorName] ?? "#262626";

  function validate(): ProdFormErrors {
    const e: ProdFormErrors = {};
    if (!name.trim()) e.name = "Nome do produto é obrigatório.";
    if (!sku.trim()) e.sku = "SKU é obrigatório.";
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) e.price = "Informe um preço válido.";
    const s = parseInt(stock);
    if (isNaN(s) || s < 0) e.stock = "Informe uma quantidade válida.";
    return e;
  }

  function handleSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const cp = parseFloat(comparePrice);
    onSave({
      name, sku, category, description,
      price: parseFloat(price),
      comparePrice: (!isNaN(cp) && cp > 0) ? cp : null,
      stock: parseInt(stock),
      color: selectedColor, colorName,
      status,
    });
  }

  function autoGenSku() {
    setSku(generateSku(name, category, Math.floor(Math.random() * 900 + 100)));
  }

  function input(
    id: string, label: string, val: string, set: (v: string) => void,
    opts?: { type?: string; placeholder?: string; hint?: string; error?: string; rightSlot?: React.ReactNode }
  ) {
    return (
      <div className="admin-form__field">
        <label className="admin-form__label" htmlFor={id}>{label}</label>
        <div style={{ position: "relative" }}>
          <input
            id={id}
            className="admin-form__input"
            type={opts?.type ?? "text"}
            placeholder={opts?.placeholder}
            value={val}
            onChange={e => set(e.target.value)}
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused(null)}
            style={{ borderColor: opts?.error ? "#d0021b" : focused === id ? "#262626" : "#dddbdc", paddingRight: opts?.rightSlot ? 80 : undefined }}
            autoComplete="off"
          />
          {opts?.rightSlot && (
            <span style={{ position: "absolute", right: 0, top: 0, height: "100%", display: "flex", alignItems: "center" }}>
              {opts.rightSlot}
            </span>
          )}
        </div>
        {opts?.error && <p className="admin-form__error">{opts.error}</p>}
        {opts?.hint && !opts.error && <p style={{ fontSize: 11, color: "#737373", letterSpacing: "0.2px", marginTop: 2 }}>{opts.hint}</p>}
      </div>
    );
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="admin-modal__head">
          <p className="admin-modal__title">{isEdit ? "Editar produto" : "Novo produto"}</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          {input("p-name", "NOME DO PRODUTO", name, setName, {
            placeholder: "ex: Camiseta de algodão orgânico",
            error: errors.name,
          })}

          {input("p-sku", "SKU", sku, setSku, {
            placeholder: "EVR-W-TEE-001",
            error: errors.sku,
            rightSlot: (
              <button
                type="button"
                onClick={autoGenSku}
                style={{ padding: "0 10px", height: "100%", fontSize: 10, letterSpacing: "0.6px", color: "#737373", background: "#f5f4f4", border: "none", borderLeft: "1px solid #dddbdc", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}
              >
                GERAR
              </button>
            ),
          })}

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">CATEGORIA</label>
              <div className="admin-form__select-wrap" style={{ borderColor: "#dddbdc" }}>
                <select className="admin-form__select" value={category} onChange={e => setCategory(e.target.value as Category)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
                </select>
                <span style={{ pointerEvents: "none", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                  <ChevronIcon dir="down" />
                </span>
              </div>
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">STATUS</label>
              <div className="admin-form__select-wrap" style={{ borderColor: "#dddbdc" }}>
                <select className="admin-form__select" value={status} onChange={e => setStatus(e.target.value as ProdStatus)}>
                  {PROD_STATUSES.map(s => <option key={s} value={s}>{prodStatusLabel(s)}</option>)}
                </select>
                <span style={{ pointerEvents: "none", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                  <ChevronIcon dir="down" />
                </span>
              </div>
            </div>
          </div>

          <div className="admin-form__field">
            <label className="admin-form__label" htmlFor="p-desc">DESCRIÇÃO</label>
            <textarea
              id="p-desc"
              className="admin-form__input"
              rows={3}
              placeholder="Descrição para a página de listagem"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onFocus={() => setFocused("p-desc")}
              onBlur={() => setFocused(null)}
              style={{ borderColor: focused === "p-desc" ? "#262626" : "#dddbdc", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div className="admin-form__row">
            {input("p-price", "PREÇO ($)", price, setPrice, {
              type: "number", placeholder: "0.00", error: errors.price,
              hint: "Preço de venda regular",
            })}
            {input("p-compare", "PREÇO DE ($)", comparePrice, setComparePrice, {
              type: "number", placeholder: "0.00",
              hint: "Preço original, deixe em branco se não estiver em promoção",
            })}
          </div>

          {input("p-stock", "QUANTIDADE EM ESTOQUE", stock, setStock, {
            type: "number", placeholder: "0", error: errors.stock,
            hint: "Defina como 0 para marcar sem estoque",
          })}

          <div className="admin-form__field">
            <label className="admin-form__label">COR</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {COLOR_OPTIONS.map(opt => {
                const isLight = parseInt(opt.hex.slice(1), 16) > 0xaaaaaa;
                const active = colorName === opt.name;
                return (
                  <button
                    key={opt.name}
                    type="button"
                    title={opt.name}
                    onClick={() => setColorName(opt.name)}
                    style={{
                      width: 28, height: 28,
                      background: opt.hex,
                      border: active ? "2px solid #262626" : isLight ? "1px solid #dddbdc" : "2px solid transparent",
                      cursor: "pointer",
                      outline: active ? "2px solid #fff" : "none",
                      outlineOffset: active ? "-4px" : "0",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
              <span style={{ fontSize: 12, color: "#737373", letterSpacing: "0.4px", marginLeft: 4 }}>{colorName}</span>
            </div>
          </div>

          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="admin-btn admin-btn--dark">
              {isEdit ? "Salvar alterações" : "Adicionar produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ product, onConfirm, onClose }: { product: Product; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__head">
          <p className="admin-modal__title">Excluir produto</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>
        <p className="admin-delete__msg">
          Tem certeza que deseja excluir <strong>{product.name}</strong>?{" "}
          Isso removerá o produto da loja permanentemente.
        </p>
        <div className="admin-modal__actions">
          <button className="admin-btn admin-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="admin-btn admin-btn--danger" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 7;

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<Category | "All">("All");
  const [statusFilter, setStatusFilter] = useState<ProdStatus | "All">("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock" | "createdAt">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  async function refreshProducts() {
    setErrorMessage(null);
    try {
      const loadedProducts = await loadProductsFromApi();
      setProducts(loadedProducts);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao carregar produtos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.colorName.toLowerCase().includes(q);
      const matchCat = catFilter === "All" || p.category === catFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.name.localeCompare(b.name);
      if (sortBy === "price") cmp = a.price - b.price;
      if (sortBy === "stock") cmp = a.stock - b.stock;
      if (sortBy === "createdAt") cmp = a.createdAt.localeCompare(b.createdAt);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [products, search, catFilter, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(col: "name" | "price" | "stock" | "createdAt") {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
    setPage(1);
  }

  async function handleCreate(data: ProdFormPayload) {
    setIsSaving(true);
    try {
      const created = await createProductInApi(data);
      setProducts(prev => [created, ...prev]);
      setShowForm(false);
      showToast("Produto adicionado com sucesso.");
      setPage(1);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao criar produto.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleEdit(data: ProdFormPayload) {
    if (!editTarget) return;

    setIsSaving(true);
    try {
      const updated = await updateProductInApi(editTarget.id, data);
      setProducts(prev => prev.map(p => p.id === editTarget.id ? updated : p));
      setEditTarget(null);
      setShowForm(false);
      showToast("Produto atualizado.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao atualizar produto.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setIsSaving(true);
    try {
      await deleteProductInApi(deleteTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Produto excluído.");
      if (paginated.length === 1 && page > 1) setPage(p => p - 1);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao excluir produto.");
    } finally {
      setIsSaving(false);
    }
  }

  function SortTh({ col, label, right }: { col: "name" | "price" | "stock" | "createdAt"; label: string; right?: boolean }) {
    const active = sortBy === col;
    return (
      <th
        className="admin-table__th admin-table__th--sortable"
        onClick={() => handleSort(col)}
        style={{ color: active ? "#262626" : "#737373", textAlign: right ? "right" : "left" }}
      >
        {label}
        <span style={{ marginLeft: 4, opacity: active ? 1 : 0.4 }}>
          <ChevronIcon dir={active && sortDir === "asc" ? "up" : "down"} />
        </span>
      </th>
    );
  }

  const activeCount = products.filter(p => p.status === "Active").length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const onSaleCount = products.filter(p => p.comparePrice != null).length;

  return (
    <div className="admin-page">
      <AdminSidebar activeItem="products" />

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="admin-topbar__title">Catálogo de produtos</p>
            <p className="admin-topbar__sub">{products.length} itens · {activeCount} ativos</p>
          </div>
          <button
            className="admin-btn admin-btn--dark admin-btn--icon"
            onClick={() => { setEditTarget(null); setShowForm(true); }}
            disabled={isSaving}
          >
            <PlusIcon />
            Adicionar produto
          </button>
        </div>

        {errorMessage && (
          <div style={{
            border: "1px solid #f3c2c9",
            background: "#fff4f6",
            color: "#8a1c2a",
            padding: "10px 12px",
            marginBottom: 16,
            fontSize: 13,
          }}>
            {errorMessage}
          </div>
        )}

        <div className="admin-stats">
          {[
            { label: "Total de itens", value: products.length },
            { label: "Ativos", value: activeCount },
            { label: "Inativos", value: products.filter(p => p.status === "Inactive").length },
            { label: "Em promoção", value: onSaleCount },
            { label: "Sem estoque", value: outOfStock },
          ].map(s => (
            <div key={s.label} className="admin-stat">
              <p className="admin-stat__value">{s.value}</p>
              <p className="admin-stat__label">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <span className="admin-search__icon"><SearchIcon /></span>
            <input
              className="admin-search__input"
              placeholder="Buscar por nome, SKU ou cor..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="admin-filters">
            <div className="admin-filter-select-wrap">
              <select className="admin-filter-select" value={catFilter} onChange={e => { setCatFilter(e.target.value as Category | "All"); setPage(1); }}>
                <option value="All">Todas as categorias</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{categoryLabel(c)}</option>)}
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>
            <div className="admin-filter-select-wrap">
              <select className="admin-filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as ProdStatus | "All"); setPage(1); }}>
                <option value="All">Todos os status</option>
                {PROD_STATUSES.map(s => <option key={s} value={s}>{prodStatusLabel(s)}</option>)}
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>
            {(search || catFilter !== "All" || statusFilter !== "All") && (
              <button className="admin-btn admin-btn--ghost" onClick={() => { setSearch(""); setCatFilter("All"); setStatusFilter("All"); setPage(1); }}>
                Limpar
              </button>
            )}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <SortTh col="name" label="Produto" />
                <th className="admin-table__th">SKU</th>
                <th className="admin-table__th">Categoria</th>
                <SortTh col="price" label="Preço" right />
                <SortTh col="stock" label="Estoque" right />
                <th className="admin-table__th">Status</th>
                <SortTh col="createdAt" label="Adicionado" />
                <th className="admin-table__th admin-table__th--actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="admin-table__empty">
                    Carregando produtos...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table__empty">
                    Nenhum produto corresponde aos filtros.
                  </td>
                </tr>
              ) : paginated.map(p => (
                <tr key={p.id} className="admin-table__row">
                  <td className="admin-table__td">
                    <ProductThumb color={p.color} colorName={p.colorName} name={p.name} />
                  </td>
                  <td className="admin-table__td admin-table__td--muted" style={{ fontSize: 11, letterSpacing: "0.4px" }}>
                    {p.sku}
                  </td>
                  <td className="admin-table__td">
                    <span style={{ fontSize: 11, letterSpacing: "0.6px", color: "#737373", textTransform: "uppercase" }}>
                      {categoryLabel(p.category)}
                    </span>
                  </td>
                  <td className="admin-table__td" style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                      <span style={{ fontSize: 13, color: "#262626" }}>{fmtPrice(p.price)}</span>
                      {p.comparePrice && (
                        <span style={{ fontSize: 11, color: "#b0aeae", textDecoration: "line-through" }}>
                          {fmtPrice(p.comparePrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="admin-table__td" style={{ textAlign: "right" }}>
                    <StockBadge stock={p.stock} />
                  </td>
                  <td className="admin-table__td"><StatusBadge status={p.status} /></td>
                  <td className="admin-table__td admin-table__td--muted">{fmtDate(p.createdAt)}</td>
                  <td className="admin-table__td admin-table__td--actions">
                    <button
                      className="admin-action-btn"
                      onClick={() => { setEditTarget(p); setShowForm(true); }}
                      disabled={isSaving}
                    >
                      <EditIcon /> Editar
                    </button>
                    <button
                      className="admin-action-btn admin-action-btn--danger"
                      onClick={() => setDeleteTarget(p)}
                      disabled={isSaving}
                    >
                      <TrashIcon /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <p className="admin-pagination__info">
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </p>
          <div className="admin-pagination__btns">
            <button className="admin-pagination__btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`admin-pagination__btn${n === page ? " admin-pagination__btn--active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button className="admin-pagination__btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Próxima →</button>
          </div>
        </div>
      </main>

      {showForm && (
        <ProductFormModal
          initial={editTarget}
          onSave={editTarget ? handleEdit : handleCreate}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {toast && (
        <div className="admin-toast">
          <span className="admin-toast__dot" />
          {toast}
        </div>
      )}
    </div>
  );
}
