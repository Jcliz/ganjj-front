import React, { useState, useMemo } from "react";
import { AdminSidebar } from "../components/AdminSidebar";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

type Category  = "Women" | "Men" | "Kids" | "Accessories";
type ProdStatus = "Active" | "Draft" | "Archived";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: Category;
  description: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  color: string;         // hex swatch
  colorName: string;
  status: ProdStatus;
  createdAt: string;     // ISO date
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SWATCH_PALETTE: Record<string, string> = {
  Uniform:     "#1a1a1a",
  "Cream":     "#f5f0e8",
  "Slate":     "#5c6b7a",
  "Cognac":    "#8b4a2f",
  "Forest":    "#2e4a3a",
  "Dusty Rose":"#c49a9a",
  "Ivory":     "#f5f2ec",
  "Navy":      "#1c2d4a",
  "Sand":      "#c8b89a",
  "Sage":      "#8a9e8a",
  "Bone":      "#e8e2d8",
  "Black":     "#262626",
};

const INITIAL_PRODUCTS: Product[] = [
  { id:1,  name:"The Organic Cotton Box-Cut Tee",    sku:"EVR-W-TEE-001", category:"Women",      description:"A relaxed box-cut tee cut from 100% organic cotton. Garment-dyed for a lived-in finish.", price:35,  comparePrice:null, stock:142, color:"#1a1a1a", colorName:"Uniform",     status:"Active",   createdAt:"2024-01-10" },
  { id:2,  name:"The Track Pant",                    sku:"EVR-W-PNT-002", category:"Women",      description:"Tapered track pant in a premium cotton-modal blend. Elastic waistband with drawstring.",   price:68,  comparePrice:null, stock:87,  color:"#f5f0e8", colorName:"Cream",       status:"Active",   createdAt:"2024-01-15" },
  { id:3,  name:"The Straight Leg Jean",             sku:"EVR-M-JNS-003", category:"Men",        description:"A straight-leg jean in 10 oz Japanese selvedge denim. Subtle fading, five-pocket design.", price:98,  comparePrice:null, stock:54,  color:"#5c6b7a", colorName:"Slate",       status:"Active",   createdAt:"2024-02-01" },
  { id:4,  name:"The Italian Leather Belt",          sku:"EVR-A-BLT-004", category:"Accessories",description:"Full-grain Italian leather with a matte metal buckle. Available in 1\" width.",             price:55,  comparePrice:75,   stock:33,  color:"#8b4a2f", colorName:"Cognac",      status:"Active",   createdAt:"2024-02-14" },
  { id:5,  name:"The Merino Turtleneck",             sku:"EVR-W-KNT-005", category:"Women",      description:"A fine-gauge merino wool turtleneck. Temperature-regulating and naturally wrinkle-resistant.",price:120,comparePrice:null, stock:61,  color:"#2e4a3a", colorName:"Forest",      status:"Active",   createdAt:"2024-02-20" },
  { id:6,  name:"The ReNew Fleece Jacket",           sku:"EVR-M-JKT-006", category:"Men",        description:"Made from 100% recycled plastic bottles. Cozy fleece with a stand-up collar.",             price:135, comparePrice:168,  stock:4,   color:"#c49a9a", colorName:"Dusty Rose",  status:"Active",   createdAt:"2024-03-01" },
  { id:7,  name:"The Kids Organic Sweatshirt",       sku:"EVR-K-SWT-007", category:"Kids",       description:"A classic pullover sweatshirt in 100% organic cotton fleece. Unisex fit.",                  price:48,  comparePrice:null, stock:0,   color:"#f5f2ec", colorName:"Ivory",       status:"Draft",    createdAt:"2024-03-10" },
  { id:8,  name:"The Oxford Shirt",                  sku:"EVR-M-SHT-008", category:"Men",        description:"A classic Oxford shirt in stonewashed GOTS-certified cotton. Slightly boxy fit.",           price:78,  comparePrice:null, stock:99,  color:"#1c2d4a", colorName:"Navy",        status:"Active",   createdAt:"2024-03-15" },
  { id:9,  name:"The Canvas Tote",                   sku:"EVR-A-BAG-009", category:"Accessories",description:"Heavyweight 18 oz canvas with reinforced stitching. Fits a 13\" laptop.",                   price:35,  comparePrice:null, stock:200, color:"#c8b89a", colorName:"Sand",        status:"Active",   createdAt:"2024-04-01" },
  { id:10, name:"The Linen Shirt Dress",             sku:"EVR-W-DRS-010", category:"Women",      description:"A relaxed shirt dress in 100% Belgian linen. Adjustable waist tie.",                       price:110, comparePrice:null, stock:27,  color:"#8a9e8a", colorName:"Sage",        status:"Active",   createdAt:"2024-04-08" },
  { id:11, name:"The Reversible Sherpa Jacket",      sku:"EVR-M-JKT-011", category:"Men",        description:"Sherpa fleece on one side, smooth nylon on the other. Fully reversible.",                  price:198, comparePrice:248,  stock:12,  color:"#e8e2d8", colorName:"Bone",        status:"Active",   createdAt:"2024-04-20" },
  { id:12, name:"The Ribbed Tank",                   sku:"EVR-W-TNK-012", category:"Women",      description:"A fine-rib tank in Pima cotton. Great layering piece or worn alone.",                      price:28,  comparePrice:null, stock:0,   color:"#262626", colorName:"Black",       status:"Archived", createdAt:"2024-05-01" },
];

const CATEGORIES: Category[]    = ["Women", "Men", "Kids", "Accessories"];
const PROD_STATUSES: ProdStatus[] = ["Active", "Draft", "Archived"];
const COLOR_OPTIONS = Object.entries(SWATCH_PALETTE).map(([name, hex]) => ({ name, hex }));

let nextProdId = INITIAL_PRODUCTS.length + 1;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtPrice(n: number) {
  return `$${n.toFixed(2).replace(".00", "")}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function generateSku(name: string, cat: Category, id: number) {
  const catCode: Record<Category, string> = { Women: "W", Men: "M", Kids: "K", Accessories: "A" };
  const word = name.trim().split(/\s+/).filter(Boolean)[0]?.slice(0, 3).toUpperCase() ?? "PRD";
  return `EVR-${catCode[cat]}-${word}-${String(id).padStart(3, "0")}`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProdStatus }) {
  const cfg: Record<ProdStatus, { dot: string; label: string }> = {
    Active:   { dot: "#2a7a3b", label: "#2a7a3b" },
    Draft:    { dot: "#f5a623", label: "#b07a0a" },
    Archived: { dot: "#b0aeae", label: "#737373" },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: cfg[status].label, letterSpacing: "0.4px" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg[status].dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// ─── Stock badge ──────────────────────────────────────────────────────────────

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span style={{ fontSize: 11, color: "#d0021b", letterSpacing: "0.4px" }}>Out of stock</span>;
  if (stock < 10)  return <span style={{ fontSize: 11, color: "#f5a623", letterSpacing: "0.4px" }}>Low · {stock}</span>;
  return <span style={{ fontSize: 11, color: "#262626", letterSpacing: "0.4px" }}>{stock}</span>;
}

// ─── Product thumbnail ────────────────────────────────────────────────────────

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

// ─── Form modal ───────────────────────────────────────────────────────────────

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
  const [name,         setName]         = useState(initial?.name         ?? "");
  const [sku,          setSku]          = useState(initial?.sku          ?? "");
  const [category,     setCategory]     = useState<Category>(initial?.category ?? "Women");
  const [description,  setDescription]  = useState(initial?.description  ?? "");
  const [price,        setPrice]        = useState(String(initial?.price   ?? ""));
  const [comparePrice, setComparePrice] = useState(String(initial?.comparePrice ?? ""));
  const [stock,        setStock]        = useState(String(initial?.stock   ?? ""));
  const [colorName,    setColorName]    = useState(initial?.colorName ?? "Black");
  const [status,       setStatus]       = useState<ProdStatus>(initial?.status ?? "Draft");
  const [errors,       setErrors]       = useState<ProdFormErrors>({});
  const [focused,      setFocused]      = useState<string | null>(null);

  const selectedColor = SWATCH_PALETTE[colorName] ?? "#262626";

  function validate(): ProdFormErrors {
    const e: ProdFormErrors = {};
    if (!name.trim()) e.name = "Product name is required.";
    if (!sku.trim())  e.sku  = "SKU is required.";
    const p = parseFloat(price);
    if (isNaN(p) || p < 0) e.price = "Enter a valid price.";
    const s = parseInt(stock);
    if (isNaN(s) || s < 0) e.stock = "Enter a valid stock quantity.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
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
    setSku(generateSku(name, category, nextProdId));
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
        {/* Head */}
        <div className="admin-modal__head">
          <p className="admin-modal__title">{isEdit ? "Edit Product" : "New Product"}</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          {input("p-name", "PRODUCT NAME", name, setName, {
            placeholder: "e.g. The Organic Cotton Tee",
            error: errors.name,
          })}

          {/* SKU */}
          {input("p-sku", "SKU", sku, setSku, {
            placeholder: "EVR-W-TEE-001",
            error: errors.sku,
            rightSlot: (
              <button
                type="button"
                onClick={autoGenSku}
                style={{ padding: "0 10px", height: "100%", fontSize: 10, letterSpacing: "0.6px", color: "#737373", background: "#f5f4f4", border: "none", borderLeft: "1px solid #dddbdc", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit" }}
              >
                AUTO
              </button>
            ),
          })}

          {/* Category + Status */}
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">CATEGORY</label>
              <div className="admin-form__select-wrap" style={{ borderColor: "#dddbdc" }}>
                <select className="admin-form__select" value={category} onChange={e => setCategory(e.target.value as Category)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
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
                  {PROD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span style={{ pointerEvents: "none", position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
                  <ChevronIcon dir="down" />
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="admin-form__field">
            <label className="admin-form__label" htmlFor="p-desc">DESCRIPTION</label>
            <textarea
              id="p-desc"
              className="admin-form__input"
              rows={3}
              placeholder="Short product description for the listing page…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onFocus={() => setFocused("p-desc")}
              onBlur={() => setFocused(null)}
              style={{ borderColor: focused === "p-desc" ? "#262626" : "#dddbdc", resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {/* Price row */}
          <div className="admin-form__row">
            {input("p-price", "PRICE ($)", price, setPrice, {
              type: "number", placeholder: "0.00", error: errors.price,
              hint: "Regular selling price",
            })}
            {input("p-compare", "COMPARE AT ($)", comparePrice, setComparePrice, {
              type: "number", placeholder: "0.00",
              hint: "Original price — leave blank if not on sale",
            })}
          </div>

          {/* Stock */}
          {input("p-stock", "STOCK QUANTITY", stock, setStock, {
            type: "number", placeholder: "0", error: errors.stock,
            hint: "Set to 0 to mark as out of stock",
          })}

          {/* Color swatch */}
          <div className="admin-form__field">
            <label className="admin-form__label">COLOR</label>
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

          {/* Actions */}
          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--dark">
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteModal({ product, onConfirm, onClose }: { product: Product; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__head">
          <p className="admin-modal__title">Delete Product</p>
          <button className="admin-modal__close" onClick={onClose}><CloseIcon /></button>
        </div>
        <p className="admin-delete__msg">
          Are you sure you want to delete <strong>{product.name}</strong>?{" "}
          This will remove it from the store permanently.
        </p>
        <div className="admin-modal__actions">
          <button className="admin-btn admin-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="admin-btn admin-btn--danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 7;

export function AdminProductsPage() {
  const [products,       setProducts]      = useState<Product[]>(INITIAL_PRODUCTS);
  const [search,         setSearch]        = useState("");
  const [catFilter,      setCatFilter]     = useState<Category | "All">("All");
  const [statusFilter,   setStatusFilter]  = useState<ProdStatus | "All">("All");
  const [sortBy,         setSortBy]        = useState<"name" | "price" | "stock" | "createdAt">("createdAt");
  const [sortDir,        setSortDir]       = useState<"asc" | "desc">("desc");
  const [page,           setPage]          = useState(1);
  const [showForm,       setShowForm]      = useState(false);
  const [editTarget,     setEditTarget]    = useState<Product | null>(null);
  const [deleteTarget,   setDeleteTarget]  = useState<Product | null>(null);
  const [toast,          setToast]         = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.colorName.toLowerCase().includes(q);
      const matchCat    = catFilter    === "All" || p.category === catFilter;
      const matchStatus = statusFilter === "All" || p.status   === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name")      cmp = a.name.localeCompare(b.name);
      if (sortBy === "price")     cmp = a.price - b.price;
      if (sortBy === "stock")     cmp = a.stock - b.stock;
      if (sortBy === "createdAt") cmp = a.createdAt.localeCompare(b.createdAt);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [products, search, catFilter, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(col: "name" | "price" | "stock" | "createdAt") {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
    setPage(1);
  }

  function handleCreate(data: ProdFormPayload) {
    const np: Product = { ...data, id: nextProdId++, createdAt: new Date().toISOString().slice(0, 10) };
    setProducts(prev => [np, ...prev]);
    setShowForm(false);
    showToast("Product added successfully.");
    setPage(1);
  }

  function handleEdit(data: ProdFormPayload) {
    setProducts(prev => prev.map(p => p.id === editTarget!.id ? { ...p, ...data } : p));
    setEditTarget(null);
    setShowForm(false);
    showToast("Product updated.");
  }

  function handleDelete() {
    setProducts(prev => prev.filter(p => p.id !== deleteTarget!.id));
    setDeleteTarget(null);
    showToast("Product deleted.");
    if (paginated.length === 1 && page > 1) setPage(p => p - 1);
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

  const activeCount   = products.filter(p => p.status === "Active").length;
  const draftCount    = products.filter(p => p.status === "Draft").length;
  const outOfStock    = products.filter(p => p.stock === 0).length;
  const onSaleCount   = products.filter(p => p.comparePrice != null).length;

  return (
    <div className="admin-page">
      <AdminSidebar activeItem="products" />

      <main className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <div>
            <p className="admin-topbar__title">Product Catalog</p>
            <p className="admin-topbar__sub">{products.length} items · {activeCount} active · {draftCount} drafts</p>
          </div>
          <button
            className="admin-btn admin-btn--dark admin-btn--icon"
            onClick={() => { setEditTarget(null); setShowForm(true); }}
          >
            <PlusIcon />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[
            { label: "Total Items",   value: products.length },
            { label: "Active",        value: activeCount },
            { label: "Drafts",        value: draftCount },
            { label: "Archived",      value: products.filter(p => p.status === "Archived").length },
            { label: "On Sale",       value: onSaleCount },
            { label: "Out of Stock",  value: outOfStock },
          ].map(s => (
            <div key={s.label} className="admin-stat">
              <p className="admin-stat__value">{s.value}</p>
              <p className="admin-stat__label">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search">
            <span className="admin-search__icon"><SearchIcon /></span>
            <input
              className="admin-search__input"
              placeholder="Search by name, SKU or color…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="admin-filters">
            <div className="admin-filter-select-wrap">
              <select className="admin-filter-select" value={catFilter} onChange={e => { setCatFilter(e.target.value as Category | "All"); setPage(1); }}>
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>
            <div className="admin-filter-select-wrap">
              <select className="admin-filter-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as ProdStatus | "All"); setPage(1); }}>
                <option value="All">All Statuses</option>
                {PROD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="admin-filter-chevron"><ChevronIcon dir="down" /></span>
            </div>
            {(search || catFilter !== "All" || statusFilter !== "All") && (
              <button className="admin-btn admin-btn--ghost" onClick={() => { setSearch(""); setCatFilter("All"); setStatusFilter("All"); setPage(1); }}>
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <SortTh col="name"      label="Product" />
                <th className="admin-table__th">SKU</th>
                <th className="admin-table__th">Category</th>
                <SortTh col="price"     label="Price"   right />
                <SortTh col="stock"     label="Stock"   right />
                <th className="admin-table__th">Status</th>
                <SortTh col="createdAt" label="Added"   />
                <th className="admin-table__th admin-table__th--actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="admin-table__empty">
                    No products match your filters.
                  </td>
                </tr>
              ) : paginated.map(p => (
                <tr key={p.id} className="admin-table__row">
                  {/* Product */}
                  <td className="admin-table__td">
                    <ProductThumb color={p.color} colorName={p.colorName} name={p.name} />
                  </td>
                  {/* SKU */}
                  <td className="admin-table__td admin-table__td--muted" style={{ fontSize: 11, letterSpacing: "0.4px" }}>
                    {p.sku}
                  </td>
                  {/* Category */}
                  <td className="admin-table__td">
                    <span style={{ fontSize: 11, letterSpacing: "0.6px", color: "#737373", textTransform: "uppercase" }}>
                      {p.category}
                    </span>
                  </td>
                  {/* Price */}
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
                  {/* Stock */}
                  <td className="admin-table__td" style={{ textAlign: "right" }}>
                    <StockBadge stock={p.stock} />
                  </td>
                  {/* Status */}
                  <td className="admin-table__td"><StatusBadge status={p.status} /></td>
                  {/* Added */}
                  <td className="admin-table__td admin-table__td--muted">{fmtDate(p.createdAt)}</td>
                  {/* Actions */}
                  <td className="admin-table__td admin-table__td--actions">
                    <button
                      className="admin-action-btn"
                      onClick={() => { setEditTarget(p); setShowForm(true); }}
                    >
                      <EditIcon /> Edit
                    </button>
                    <button
                      className="admin-action-btn admin-action-btn--danger"
                      onClick={() => setDeleteTarget(p)}
                    >
                      <TrashIcon /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="admin-pagination">
          <p className="admin-pagination__info">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="admin-pagination__btns">
            <button className="admin-pagination__btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`admin-pagination__btn${n === page ? " admin-pagination__btn--active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button className="admin-pagination__btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </div>
      </main>

      {/* Modals */}
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

      {/* Toast */}
      {toast && (
        <div className="admin-toast">
          <span className="admin-toast__dot" />
          {toast}
        </div>
      )}
    </div>
  );
}
