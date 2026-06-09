import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { produtoApi, type Produto } from "../../lib/api";

const COR_PALETTE: { nome: string; label: string; hex: string }[] = [
  { nome: "Black",  label: "Preto",    hex: "#1a1a1a" },
  { nome: "Blue",   label: "Azul",     hex: "#1a3a6b" },
  { nome: "Brown",  label: "Marrom",   hex: "#5a3825" },
  { nome: "Green",  label: "Verde",    hex: "#2d4a2d" },
  { nome: "Grey",   label: "Cinza",    hex: "#888" },
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
const TAMANHOS_ROUPAS  = ["PP", "P", "M", "G", "GG", "GGG", "GGGG"];

type Categoria = "todos" | "feminino" | "masculino";

const LABEL_CATEGORIA: Record<Categoria, string> = {
  todos:     "Todos",
  feminino:  "Feminino",
  masculino: "Masculino",
};

function fmtPreco(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ListingPage() {
  usePageTitle("Produtos");
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Todos os filtros derivados diretamente da URL (fonte única de verdade)
  const categoria = (searchParams.get("categoria") as Categoria) ?? "todos";
  const tipo = searchParams.get("tipo") ?? "";
  const coresSelecionadas = searchParams.get("cor") ? searchParams.get("cor")!.split(",") : [];
  const tamanhosSelecionados = searchParams.get("tamanho") ? searchParams.get("tamanho")!.split(",") : [];
  const apenasPopular = searchParams.get("popular") === "true";
  const apenasNovo = searchParams.get("novo") === "true";
  const apenasSocial = searchParams.get("social") === "true";
  const precoMax = searchParams.get("preco_max") ? Number(searchParams.get("preco_max")) : null;

  useEffect(() => {
    produtoApi.getAll()
      .then(data => setProdutos(data))
      .catch(e => setErro((e as Error).message ?? "Erro ao carregar produtos."))
      .finally(() => setCarregando(false));
  }, []);

  function updateParam(key: string, value: string | null) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value === null) next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  }

  const temFiltroAtivo =
    categoria !== "todos" ||
    tipo !== "" ||
    coresSelecionadas.length > 0 ||
    tamanhosSelecionados.length > 0 ||
    apenasPopular ||
    apenasNovo ||
    apenasSocial ||
    precoMax !== null;

  function limparFiltros() {
    setSearchParams({}, { replace: true });
  }

  function toggleTamanho(s: string) {
    const next = tamanhosSelecionados.includes(s)
      ? tamanhosSelecionados.filter(t => t !== s)
      : [...tamanhosSelecionados, s];
    updateParam("tamanho", next.length > 0 ? next.join(",") : null);
  }

  function toggleCor(nome: string) {
    const next = coresSelecionadas.includes(nome)
      ? coresSelecionadas.filter(c => c !== nome)
      : [...coresSelecionadas, nome];
    updateParam("cor", next.length > 0 ? next.join(",") : null);
  }

  const produtosFiltrados = produtos.filter(p => {
    if (!p.status) return false;
    if (categoria === "feminino" && !p.feminino) return false;
    if (categoria === "masculino" && p.feminino) return false;
    if (tipo && p.tipo_roupa?.toLowerCase() !== tipo.toLowerCase()) return false;
    if (coresSelecionadas.length > 0 && !coresSelecionadas.includes(p.cor ?? "")) return false;
    if (tamanhosSelecionados.length > 0) {
      const tamanhosProd = p.tamanhos ?? [];
      if (!tamanhosSelecionados.some(t => tamanhosProd.includes(t))) return false;
    }
    if (apenasPopular && !p.popular) return false;
    if (apenasNovo && !p.novo) return false;
    if (apenasSocial && !p.social) return false;
    if (precoMax !== null) {
      const precoEfetivo = p.em_sale && p.preco_sale != null ? p.preco_sale : p.preco;
      if (precoEfetivo > precoMax) return false;
    }
    return true;
  });

  const coresDisponiveis = COR_PALETTE.filter(c =>
    produtos.some(p => p.cor === c.nome)
  );

  const breadcrumbSuffix = tipo
    ? ` > ${tipo}`
    : categoria !== "todos"
      ? ` > ${LABEL_CATEGORIA[categoria]}`
      : "";

  return (
    <div className="page">
      <Header />

      <div className="listing-page">
        {/* Sidebar */}
        <aside className="listing-sidebar">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="listing-sidebar__count">
              {carregando
                ? "Carregando..."
                : `${produtosFiltrados.length} Produto${produtosFiltrados.length !== 1 ? "s" : ""}`}
            </p>
            {temFiltroAtivo && (
              <button
                onClick={limparFiltros}
                style={{ fontSize: 11, color: "#737373", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                Limpar filtros
              </button>
            )}
          </div>

          {/* Categoria */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Categoria</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(["todos", "feminino", "masculino"] as Categoria[]).map(cat => (
                <label
                  key={cat}
                  className="filter-checkbox"
                  style={{ cursor: "pointer" }}
                  onClick={() => updateParam("categoria", cat === "todos" ? null : cat)}
                >
                  <div
                    className="filter-checkbox__box"
                    style={{ background: categoria === cat ? "#262626" : undefined }}
                  />
                  <span className="filter-checkbox__label">{LABEL_CATEGORIA[cat]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de roupa */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Tipo</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                className="filter-checkbox"
                style={{ cursor: "pointer" }}
                onClick={() => updateParam("tipo", null)}
              >
                <div
                  className="filter-checkbox__box"
                  style={{ background: tipo === "" ? "#262626" : undefined }}
                />
                <span className="filter-checkbox__label">Todos</span>
              </label>
              {TIPOS_ROUPA.map(t => (
                <label
                  key={t}
                  className="filter-checkbox"
                  style={{ cursor: "pointer" }}
                  onClick={() => updateParam("tipo", tipo === t ? null : t)}
                >
                  <div
                    className="filter-checkbox__box"
                    style={{ background: tipo === t ? "#262626" : undefined }}
                  />
                  <span className="filter-checkbox__label">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Cor */}
          {coresDisponiveis.length > 0 && (
            <div className="filter-section">
              <div className="filter-section__header">
                <p className="filter-section__title">Cor</p>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {coresDisponiveis.map(({ nome, label, hex }) => (
                  <div
                    key={nome}
                    className="filter-color"
                    onClick={() => toggleCor(nome)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="filter-color__swatch"
                      style={{
                        background: hex,
                        outline: coresSelecionadas.includes(nome) ? "2px solid #262626" : "none",
                        outlineOffset: 2,
                      }}
                    />
                    <span className="filter-color__name">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tamanho */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Tamanho</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: 12, color: "#737373", marginBottom: 8 }}>Cintura</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {TAMANHOS_CINTURA.map(s => (
                <button
                  key={s}
                  onClick={() => toggleTamanho(s)}
                  style={{
                    border: "1px solid #dddbdc",
                    padding: "4px 8px",
                    fontSize: 12,
                    cursor: "pointer",
                    background: tamanhosSelecionados.includes(s) ? "#262626" : "#fff",
                    color: tamanhosSelecionados.includes(s) ? "#fff" : "#262626",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#737373", marginBottom: 8 }}>Roupas</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {TAMANHOS_ROUPAS.map(s => (
                <button
                  key={s}
                  onClick={() => toggleTamanho(s)}
                  style={{
                    border: "1px solid #dddbdc",
                    padding: "4px 8px",
                    fontSize: 12,
                    cursor: "pointer",
                    background: tamanhosSelecionados.includes(s) ? "#262626" : "#fff",
                    color: tamanhosSelecionados.includes(s) ? "#fff" : "#262626",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Destaques */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Destaques</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {([
                { label: "Novidades",  state: apenasNovo,   key: "novo" },
                { label: "Populares", state: apenasPopular, key: "popular" },
                { label: "Social",    state: apenasSocial,  key: "social" },
              ] as const).map(({ label, state, key }) => (
                <label
                  key={label}
                  className="filter-checkbox"
                  style={{ cursor: "pointer" }}
                  onClick={() => updateParam(key, state ? null : "true")}
                >
                  <div
                    className="filter-checkbox__box"
                    style={{ background: state ? "#262626" : undefined }}
                  />
                  <span className="filter-checkbox__label">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preço máximo */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Preço</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[null, 100, 200, 300].map(val => (
                <label
                  key={val ?? "todos"}
                  className="filter-checkbox"
                  style={{ cursor: "pointer" }}
                  onClick={() => updateParam("preco_max", val === null ? null : String(val))}
                >
                  <div
                    className="filter-checkbox__box"
                    style={{ background: precoMax === val ? "#262626" : undefined }}
                  />
                  <span className="filter-checkbox__label">
                    {val === null ? "Todos" : `Até ${fmtPreco(val)}`}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="listing-main">
          <p className="listing-breadcrumb">
            Início &gt; Produtos{breadcrumbSuffix}
            {apenasPopular && " > Populares"}
            {precoMax !== null && ` > Até ${fmtPreco(precoMax)}`}
          </p>
          <p className="listing-title">
            {tipo
              ? tipo
              : categoria !== "todos"
                ? LABEL_CATEGORIA[categoria]
                : "Roupas e Vestuário — Novidades"}
          </p>
          <p className="listing-featured-label">Destaques</p>

          {erro && (
            <p style={{ color: "#d0021b", fontSize: 14, padding: "20px 0" }}>{erro}</p>
          )}

          {carregando ? (
            <p style={{ color: "#737373", fontSize: 14, padding: "20px 0" }}>Carregando produtos...</p>
          ) : produtosFiltrados.length === 0 && !erro ? (
            <p style={{ color: "#737373", fontSize: 14, padding: "20px 0" }}>Nenhum produto encontrado.</p>
          ) : (
            <div className="product-grid">
              {produtosFiltrados.map(produto => {
                const corInfo = COR_PALETTE.find(c => c.nome === produto.cor);
                return (
                  <div
                    key={produto.id}
                    className="listing-product-card"
                    onClick={() => navigate(`/product/${produto.id}`)}
                  >
                    <div className="listing-product-card__img">
                      <img
                        src={produto.imagem_url ?? ""}
                        alt={produto.nome}
                      />
                      {produto.em_sale && produto.desconto_pct != null ? (
                        <div className="listing-product-card__badge listing-product-card__badge--sale">
                          −{produto.desconto_pct}%
                        </div>
                      ) : produto.novo ? (
                        <span style={{
                          position: "absolute", top: 10, left: 10,
                          fontSize: 11, fontWeight: 700, color: "#fff",
                          letterSpacing: "1px", textTransform: "uppercase",
                          textShadow: "0 1px 4px rgba(0,0,0,0.55)",
                        }}>
                          Novo!
                        </span>
                      ) : produto.popular ? (
                        <div className="listing-product-card__badge">Popular</div>
                      ) : null}
                    </div>
                    <p className="listing-product-card__name">{produto.nome}</p>
                    <div className="listing-product-card__price-row">
                      {produto.em_sale && produto.preco_sale != null ? (
                        <>
                          <span style={{ color: "#c0392b", fontWeight: 600 }}>{fmtPreco(produto.preco_sale)}</span>
                          <span style={{ color: "#b0aeae", textDecoration: "line-through", fontSize: 12, marginLeft: 6 }}>{fmtPreco(produto.preco)}</span>
                        </>
                      ) : (
                        <span style={{ color: "#262626" }}>{fmtPreco(produto.preco)}</span>
                      )}
                    </div>
                    {produto.cor && (
                      <p className="listing-product-card__color">{corInfo?.label ?? produto.cor}</p>
                    )}
                    {corInfo && (
                      <div className="listing-product-card__swatches">
                        <div
                          className="listing-product-card__swatch"
                          style={{ background: corInfo.hex }}
                        />
                      </div>
                    )}
                    {produto.estoque === 0 && (
                      <div className="listing-product-card__tags">
                        <span className="listing-product-card__tag">Sem estoque</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
