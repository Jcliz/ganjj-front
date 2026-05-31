import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { listProd1 } from "../../assets/assets";
import { produtosApi, type Produto } from "../../lib/api";

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

const subNav = [
  { label: "Sobre nós" },
  { label: "Lojas" },
  { label: "Sale ganjj" },
  { label: "Lookbook" },
  { label: "Trocas e devoluções" },
  { label: "Contato" },
];

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
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [coresSelecionadas, setCoresSelecionadas] = useState<string[]>([]);
  const [categoria, setCategoria] = useState<Categoria>("todos");

  useEffect(() => {
    produtosApi.list()
      .then(data => setProdutos(data))
      .catch(e => setErro((e as Error).message ?? "Erro ao carregar produtos."))
      .finally(() => setCarregando(false));
  }, []);

  const produtosFiltrados = produtos.filter(p => {
    if (!p.status) return false;
    if (categoria === "feminino" && !p.feminino) return false;
    if (categoria === "masculino" && p.feminino) return false;
    if (coresSelecionadas.length > 0 && !coresSelecionadas.includes(p.cor ?? "")) return false;
    return true;
  });

  const coresDisponiveis = COR_PALETTE.filter(c =>
    produtos.some(p => p.cor === c.nome)
  );

  return (
    <div className="page">
      <Header activeTab="men" subNavItems={subNav} />

      <div className="listing-page">
        {/* Sidebar */}
        <aside className="listing-sidebar">
          <p className="listing-sidebar__count">
            {carregando
              ? "Carregando..."
              : `${produtosFiltrados.length} Produto${produtosFiltrados.length !== 1 ? "s" : ""}`}
          </p>

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
                  onClick={() => setCategoria(cat)}
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
                    onClick={() =>
                      setCoresSelecionadas(prev =>
                        prev.includes(nome) ? prev.filter(c => c !== nome) : [...prev, nome]
                      )
                    }
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
              {["30", "32", "34", "36", "38", "40"].map(s => (
                <button key={s} style={{ border: "1px solid #dddbdc", padding: "4px 8px", fontSize: 12, cursor: "pointer", background: "#fff", color: "#262626" }}>
                  {s}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#737373", marginBottom: 8 }}>Roupas</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {["PP", "P", "M", "G", "GG", "GGG", "GGGG"].map(s => (
                <button key={s} style={{ border: "1px solid #dddbdc", padding: "4px 8px", fontSize: 12, cursor: "pointer", background: "#fff", color: "#262626" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Conteúdo principal */}
        <main className="listing-main">
          <p className="listing-breadcrumb">Início &gt; Produtos</p>
          <p className="listing-title">Roupas e Vestuário — Novidades</p>
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
                        src={produto.imagem_url ?? listProd1}
                        alt={produto.nome}
                        onError={e => { (e.target as HTMLImageElement).src = listProd1; }}
                      />
                      {produto.popular && (
                        <div className="listing-product-card__badge">Popular</div>
                      )}
                    </div>
                    <p className="listing-product-card__name">{produto.nome}</p>
                    <div className="listing-product-card__price-row">
                      <span style={{ color: "#262626" }}>{fmtPreco(produto.preco)}</span>
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
