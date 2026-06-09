import { useState, useEffect, useMemo, useRef } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import { AdminSidebar } from "../components/AdminSidebar";
import { produtoApi, uploadApi, type Produto, type ProdutoPayload } from "../../lib/api";

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

const COR_PALETTE: { nome: string; label: string; hex: string }[] = [
  { nome: "Black",  label: "Preto",    hex: "#1a1a1a" },
  { nome: "Blue",   label: "Azul",     hex: "#1a3a6b" },
  { nome: "Brown",  label: "Marrom",   hex: "#5a3825" },
  { nome: "Green",  label: "Verde",    hex: "#2d4a2d" },
  { nome: "Grey",   label: "Cinza",    hex: "#888888" },
  { nome: "Orange", label: "Laranja",  hex: "#d46b1a" },
  { nome: "Pink",   label: "Rosa",     hex: "#e8a5b0" },
  { nome: "Red",    label: "Vermelho", hex: "#c0392b" },
  { nome: "Tan",    label: "Bege",     hex: "#c8a87a" },
  { nome: "Sage",   label: "Sálvia",   hex: "#8a9e8a" },
  { nome: "Navy",   label: "Marinho",  hex: "#1c2d4a" },
  { nome: "Cream",  label: "Creme",    hex: "#f5f0e8" },
];

const TIPOS_ROUPA = ["Camisas", "Camisetas", "Casacos", "Jaquetas", "Calças", "Jeans"];
const TAMANHOS_CINTURA = ["30", "32", "34", "36", "38", "40"];
const TAMANHOS_ROUPAS = ["PP", "P", "M", "G", "GG", "GGG", "GGGG"];

function fmtPreco(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: status ? "#2a7a3b" : "#737373", letterSpacing: "0.4px" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: status ? "#2a7a3b" : "#b0aeae", flexShrink: 0 }} />
      {status ? "Ativo" : "Inativo"}
    </span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span style={{ fontSize: 11, color: "#d0021b" }}>Sem estoque</span>;
  if (stock < 10)  return <span style={{ fontSize: 11, color: "#f5a623" }}>Baixo · {stock}</span>;
  return <span style={{ fontSize: 11, color: "#262626" }}>{stock}</span>;
}

function ProductThumb({ produto }: { produto: Produto }) {
  const corInfo = COR_PALETTE.find(c => c.nome === produto.cor);
  const hex = corInfo?.hex ?? "#dddbdc";
  const isLight = parseInt(hex.slice(1), 16) > 0xaaaaaa;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 40, height: 40, background: hex, flexShrink: 0,
        border: isLight ? "1px solid #dddbdc" : "none",
        overflow: "hidden",
      }}>
        {produto.imagem_url && (
          <img src={produto.imagem_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>
      <div>
        <p style={{ fontSize: 13, color: "#262626", lineHeight: "18px", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {produto.nome}
        </p>
        <p style={{ fontSize: 11, color: "#737373", lineHeight: "16px" }}>
          {corInfo?.label ?? produto.cor ?? "—"}
          {produto.tipo_roupa && ` · ${produto.tipo_roupa}`}
        </p>
      </div>
    </div>
  );
}

interface FormErrors { nome?: string; preco?: string; estoque?: string; }

interface ProdFormProps {
  initial?: Produto | null;
  onSave: (data: ProdutoPayload) => Promise<void>;
  onClose: () => void;
}

function ProductFormModal({ initial, onSave, onClose }: ProdFormProps) {
  const isEdit = !!initial;
  const [nome, setNome] = useState(initial?.nome ?? "");
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [preco, setPreco] = useState(String(initial?.preco ?? ""));
  const [estoque, setEstoque] = useState(String(initial?.estoque ?? ""));
  const [cor, setCor] = useState(initial?.cor ?? "");
  const [status, setStatus] = useState(initial?.status ?? true);
  const [imagemUrl, setImagemUrl] = useState(initial?.imagem_url ?? "");
  const [popular, setPopular] = useState(initial?.popular ?? false);
  const [novo, setNovo]       = useState(initial?.novo    ?? true);
  const [social, setSocial]   = useState(initial?.social  ?? false);
  const [feminino, setFeminino] = useState(initial?.feminino ?? false);
  const [tipoRoupa, setTipoRoupa] = useState(initial?.tipo_roupa ?? "");
  const [tamanhos, setTamanhos] = useState<string[]>(initial?.tamanhos ?? []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleTamanho(s: string) {
    setTamanhos(prev => prev.includes(s) ? prev.filter(t => t !== s) : [...prev, s]);
  }

  async function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadApi.uploadImagem(file);
      setImagemUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!nome.trim()) e.nome = "Nome é obrigatório.";
    const p = parseFloat(preco);
    if (isNaN(p) || p < 0) e.preco = "Informe um preço válido.";
    const s = parseInt(estoque);
    if (isNaN(s) || s < 0) e.estoque = "Informe uma quantidade válida.";
    return e;
  }

  async function handleSubmit(ev: React.SyntheticEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await onSave({
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
        cor: cor || undefined,
        status,
        imagem_url: imagemUrl.trim() || undefined,
        popular,
        feminino,
        novo,
        social,
        tipo_roupa: tipoRoupa || undefined,
        tamanhos: tamanhos.length > 0 ? tamanhos : undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  function inputField(
    id: string, label: string, val: string, set: (v: string) => void,
    opts?: { type?: string; placeholder?: string; error?: string; hint?: string }
  ) {
    return (
      <div className="admin-form__field">
        <label className="admin-form__label" htmlFor={id}>{label}</label>
        <input
          id={id}
          className="admin-form__input"
          type={opts?.type ?? "text"}
          placeholder={opts?.placeholder}
          value={val}
          onChange={e => set(e.target.value)}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          style={{ borderColor: opts?.error ? "#d0021b" : focused === id ? "#262626" : "#dddbdc" }}
          autoComplete="off"
        />
        {opts?.error && <p className="admin-form__error">{opts.error}</p>}
        {opts?.hint && !opts.error && <p style={{ fontSize: 11, color: "#737373", marginTop: 2 }}>{opts.hint}</p>}
      </div>
    );
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" style={{ maxWidth: 600, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div className="admin-modal__head">
          <p className="admin-modal__title">{isEdit ? "Editar produto" : "Novo produto"}</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          {inputField("p-nome", "NOME DO PRODUTO", nome, setNome, {
            placeholder: "ex: Camiseta de algodão orgânico",
            error: errors.nome,
          })}

          <div className="admin-form__field">
            <label className="admin-form__label" htmlFor="p-desc">DESCRIÇÃO</label>
            <textarea
              id="p-desc"
              className="admin-form__input"
              rows={2}
              placeholder="Descrição opcional"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              onFocus={() => setFocused("p-desc")}
              onBlur={() => setFocused(null)}
              style={{ borderColor: focused === "p-desc" ? "#262626" : "#dddbdc", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          <div className="admin-form__row">
            {inputField("p-preco", "PREÇO (R$)", preco, setPreco, {
              type: "number", placeholder: "0.00", error: errors.preco,
            })}
            {inputField("p-estoque", "ESTOQUE", estoque, setEstoque, {
              type: "number", placeholder: "0", error: errors.estoque,
            })}
          </div>

          {/* Tipo de Roupa e Gênero */}
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">TIPO DE ROUPA</label>
              <div className="admin-form__select-wrap" style={{ borderColor: "#dddbdc" }}>
                <select className="admin-form__select" value={tipoRoupa} onChange={e => setTipoRoupa(e.target.value)}>
                  <option value="">— Nenhum —</option>
                  {TIPOS_ROUPA.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span style={{ pointerEvents: "none", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                  <ChevronIcon dir="down" />
                </span>
              </div>
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">GÊNERO</label>
              <div className="admin-form__select-wrap" style={{ borderColor: "#dddbdc" }}>
                <select className="admin-form__select" value={feminino ? "feminino" : "masculino"} onChange={e => setFeminino(e.target.value === "feminino")}>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
                <span style={{ pointerEvents: "none", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                  <ChevronIcon dir="down" />
                </span>
              </div>
            </div>
          </div>

          {/* Tamanhos */}
          <div className="admin-form__field">
            <label className="admin-form__label">TAMANHOS DISPONÍVEIS</label>
            <p style={{ fontSize: 11, color: "#737373", marginBottom: 6 }}>Cintura</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {TAMANHOS_CINTURA.map(s => (
                <button
                  key={s} type="button" onClick={() => toggleTamanho(s)}
                  style={{
                    border: "1px solid #dddbdc", padding: "4px 8px", fontSize: 12, cursor: "pointer",
                    background: tamanhos.includes(s) ? "#262626" : "#fff",
                    color: tamanhos.includes(s) ? "#fff" : "#262626",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "#737373", marginBottom: 6 }}>Roupas</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {TAMANHOS_ROUPAS.map(s => (
                <button
                  key={s} type="button" onClick={() => toggleTamanho(s)}
                  style={{
                    border: "1px solid #dddbdc", padding: "4px 8px", fontSize: 12, cursor: "pointer",
                    background: tamanhos.includes(s) ? "#262626" : "#fff",
                    color: tamanhos.includes(s) ? "#fff" : "#262626",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Cor */}
          <div className="admin-form__field">
            <label className="admin-form__label">COR</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              {COR_PALETTE.map(opt => {
                const isLight = parseInt(opt.hex.slice(1), 16) > 0xaaaaaa;
                const active = cor === opt.nome;
                return (
                  <button
                    key={opt.nome} type="button" title={opt.label}
                    onClick={() => setCor(active ? "" : opt.nome)}
                    style={{
                      width: 28, height: 28, background: opt.hex, cursor: "pointer",
                      border: active ? "2px solid #262626" : isLight ? "1px solid #dddbdc" : "2px solid transparent",
                      outline: active ? "2px solid #fff" : "none",
                      outlineOffset: active ? "-4px" : "0",
                      flexShrink: 0,
                    }}
                  />
                );
              })}
              <span style={{ fontSize: 12, color: "#737373", marginLeft: 4 }}>
                {COR_PALETTE.find(c => c.nome === cor)?.label ?? (cor ? cor : "Nenhuma")}
              </span>
            </div>
          </div>

          {/* Upload de imagem */}
          <div className="admin-form__field">
            <label className="admin-form__label">IMAGEM DO PRODUTO</label>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {/* Preview */}
              <div style={{
                width: 72, height: 72, flexShrink: 0,
                border: "1px solid #dddbdc",
                background: "#f5f5f5",
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {uploading ? (
                  <span style={{ fontSize: 10, color: "#737373" }}>...</span>
                ) : imagemUrl ? (
                  <img src={imagemUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 10, color: "#b0aeae" }}>sem img</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    style={{ fontSize: 12, padding: "5px 10px" }}
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploading ? "Enviando..." : imagemUrl ? "Trocar imagem" : "Escolher imagem"}
                  </button>
                  {imagemUrl && !uploading && (
                    <button
                      type="button"
                      className="admin-btn admin-btn--ghost"
                      style={{ fontSize: 12, padding: "5px 10px", color: "#d0021b", borderColor: "#d0021b" }}
                      onClick={() => setImagemUrl("")}
                    >
                      Remover
                    </button>
                  )}
                </div>
                {uploadError && (
                  <p style={{ fontSize: 11, color: "#d0021b", marginTop: 4 }}>{uploadError}</p>
                )}
                {!uploadError && (
                  <p style={{ fontSize: 11, color: "#737373", marginTop: 4 }}>PNG, JPG ou WEBP · máx. 5 MB</p>
                )}
              </div>
            </div>
          </div>

          {/* Status e checkboxes */}
          <div className="admin-form__row" style={{ alignItems: "center" }}>
            <div className="admin-form__field">
              <label className="admin-form__label">STATUS</label>
              <div className="admin-form__select-wrap" style={{ borderColor: "#dddbdc" }}>
                <select className="admin-form__select" value={status ? "ativo" : "inativo"} onChange={e => setStatus(e.target.value === "ativo")}>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                <span style={{ pointerEvents: "none", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                  <ChevronIcon dir="down" />
                </span>
              </div>
            </div>
            <div className="admin-form__field" style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 20 }}>
              {([
                { label: "Popular", state: popular, set: setPopular },
                { label: "Novo",    state: novo,    set: setNovo },
                { label: "Social",  state: social,  set: setSocial },
              ] as const).map(({ label, state, set }) => (
                <label key={label} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#262626" }}>
                  <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} style={{ cursor: "pointer" }} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" className="admin-btn admin-btn--dark" disabled={saving}>
              {saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Adicionar produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ produto, onConfirm, onClose }: { produto: Produto; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__head">
          <p className="admin-modal__title">Excluir produto</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>
        <p className="admin-delete__msg">
          Tem certeza que deseja excluir <strong>{produto.nome}</strong>?{" "}
          Isso removerá o produto permanentemente.
        </p>
        <div className="admin-modal__actions">
          <button className="admin-btn admin-btn--ghost" onClick={onClose}>Cancelar</button>
          <button className="admin-btn admin-btn--danger" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 10;

export function AdminProductsPage() {
  usePageTitle("Produtos — Admin");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [generoFilter, setGeneroFilter] = useState<"all" | "feminino" | "masculino">("all");
  const [sortBy, setSortBy] = useState<"nome" | "preco" | "estoque" | "criado_em">("criado_em");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Produto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Produto | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastError, setToastError] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function showError(msg: string) {
    setToastError(msg);
    setTimeout(() => setToastError(null), 3500);
  }

  function loadProdutos() {
    setCarregando(true);
    produtoApi.getAll()
      .then(data => setProdutos(data))
      .catch(() => showError("Erro ao carregar produtos."))
      .finally(() => setCarregando(false));
  }

  useEffect(() => { loadProdutos(); }, []);

  async function handleCreate(data: ProdutoPayload) {
    await produtoApi.create(data);
    setShowForm(false);
    showToast("Produto adicionado com sucesso.");
    loadProdutos();
    setPage(1);
  }

  async function handleEdit(data: ProdutoPayload) {
    await produtoApi.update(editTarget!.id, data);
    setEditTarget(null);
    setShowForm(false);
    showToast("Produto atualizado.");
    loadProdutos();
  }

  async function handleDelete() {
    await produtoApi.delete(deleteTarget!.id);
    setDeleteTarget(null);
    showToast("Produto excluído.");
    loadProdutos();
    if (paginated.length === 1 && page > 1) setPage(p => p - 1);
  }

  const filtered = useMemo(() => {
    let list = produtos.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.nome.toLowerCase().includes(q) || (p.tipo_roupa ?? "").toLowerCase().includes(q);
      const matchTipo = tipoFilter === "all" || p.tipo_roupa === tipoFilter;
      const matchGenero = generoFilter === "all" || (generoFilter === "feminino" ? p.feminino : !p.feminino);
      return matchSearch && matchTipo && matchGenero;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "nome") cmp = a.nome.localeCompare(b.nome);
      if (sortBy === "preco") cmp = a.preco - b.preco;
      if (sortBy === "estoque") cmp = a.estoque - b.estoque;
      if (sortBy === "criado_em") cmp = a.criado_em.localeCompare(b.criado_em);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [produtos, search, tipoFilter, generoFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(col: "nome" | "preco" | "estoque" | "criado_em") {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
    setPage(1);
  }

  function SortTh({ col, label, right }: { col: "nome" | "preco" | "estoque" | "criado_em"; label: string; right?: boolean }) {
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

  const activeCount = produtos.filter(p => p.status).length;
  const inactiveCount = produtos.filter(p => !p.status).length;
  const outOfStock = produtos.filter(p => p.estoque === 0).length;
  const onSaleCount = produtos.filter(p => p.em_sale).length;

  return (
    <div className="admin-page">
      <AdminSidebar activeItem="products" />

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="admin-topbar__title">Catálogo de produtos</p>
            <p className="admin-topbar__sub">{produtos.length} itens · {activeCount} ativos · {inactiveCount} inativos</p>
          </div>
          <button
            className="admin-btn admin-btn--dark admin-btn--icon"
            onClick={() => { setEditTarget(null); setShowForm(true); }}
          >
            <PlusIcon />
            Adicionar produto
          </button>
        </div>

        <div className="admin-stats">
          {[
            { label: "Total de itens",  value: produtos.length },
            { label: "Ativos",          value: activeCount },
            { label: "Inativos",        value: inactiveCount },
            { label: "Em promoção",     value: onSaleCount },
            { label: "Sem estoque",     value: outOfStock },
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
              placeholder="Buscar por nome ou tipo..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="admin-filters">
            <div className="admin-filter-select-wrap">
              <select className="admin-filter-select" value={tipoFilter} onChange={e => { setTipoFilter(e.target.value); setPage(1); }}>
                <option value="all">Todos os tipos</option>
                {TIPOS_ROUPA.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>
            <div className="admin-filter-select-wrap">
              <select className="admin-filter-select" value={generoFilter} onChange={e => { setGeneroFilter(e.target.value as "all" | "feminino" | "masculino"); setPage(1); }}>
                <option value="all">Todos os gêneros</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>
            {(search || tipoFilter !== "all" || generoFilter !== "all") && (
              <button className="admin-btn admin-btn--ghost" onClick={() => { setSearch(""); setTipoFilter("all"); setGeneroFilter("all"); setPage(1); }}>
                Limpar
              </button>
            )}
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <SortTh col="nome" label="Produto" />
                <th className="admin-table__th">Tipo</th>
                <th className="admin-table__th">Gênero</th>
                <SortTh col="preco" label="Preço" right />
                <SortTh col="estoque" label="Estoque" right />
                <th className="admin-table__th">Status</th>
                <SortTh col="criado_em" label="Adicionado" />
                <th className="admin-table__th admin-table__th--actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {carregando ? (
                <tr>
                  <td colSpan={8} className="admin-table__empty">Carregando...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table__empty">Nenhum produto encontrado.</td>
                </tr>
              ) : paginated.map(p => (
                <tr key={p.id} className="admin-table__row">
                  <td className="admin-table__td">
                    <ProductThumb produto={p} />
                  </td>
                  <td className="admin-table__td">
                    <span style={{ fontSize: 11, letterSpacing: "0.6px", color: "#737373" }}>
                      {p.tipo_roupa ?? <span style={{ color: "#b0aeae" }}>—</span>}
                    </span>
                  </td>
                  <td className="admin-table__td">
                    <span style={{ fontSize: 11, letterSpacing: "0.6px", color: "#737373" }}>
                      {p.feminino ? "Feminino" : "Masculino"}
                    </span>
                  </td>
                  <td className="admin-table__td" style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                      {p.em_sale && p.preco_sale != null ? (
                        <>
                          <span style={{ fontSize: 13, color: "#c0392b" }}>{fmtPreco(p.preco_sale)}</span>
                          <span style={{ fontSize: 11, color: "#b0aeae", textDecoration: "line-through" }}>{fmtPreco(p.preco)}</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 13, color: "#262626" }}>{fmtPreco(p.preco)}</span>
                      )}
                    </div>
                  </td>
                  <td className="admin-table__td" style={{ textAlign: "right" }}>
                    <StockBadge stock={p.estoque} />
                  </td>
                  <td className="admin-table__td"><StatusBadge status={p.status} /></td>
                  <td className="admin-table__td admin-table__td--muted">{fmtDate(p.criado_em)}</td>
                  <td className="admin-table__td admin-table__td--actions">
                    <button
                      className="admin-action-btn"
                      onClick={() => { setEditTarget(p); setShowForm(true); }}
                    >
                      <EditIcon /> Editar
                    </button>
                    <button
                      className="admin-action-btn admin-action-btn--danger"
                      onClick={() => setDeleteTarget(p)}
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
          produto={deleteTarget}
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

      {toastError && (
        <div className="admin-toast" style={{ background: "#d0021b" }}>
          {toastError}
        </div>
      )}
    </div>
  );
}
