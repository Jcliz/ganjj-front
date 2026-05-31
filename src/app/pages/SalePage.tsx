import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { catShirts, catDenim, catOuterwear, listProd1 } from "../../assets/assets";
import { saleApi, type SaleItem } from "../../lib/api";

type FilterCategoria = "Todos" | "Superiores" | "Inferiores" | "Inverno";
type SortKey = "featured" | "price-asc" | "price-desc" | "pct";

const CATEGORIES: FilterCategoria[] = ["Todos", "Superiores", "Inferiores", "Inverno"];

function fmtPreco(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getTimeLeft() {
  const end = new Date();
  end.setDate(end.getDate() + 3);
  end.setHours(23, 59, 59, 0);
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="sale-countdown__unit">
      <span className="sale-countdown__num">{String(value).padStart(2, "0")}</span>
      <span className="sale-countdown__label">{label}</span>
    </div>
  );
}

function SaleCard({ item }: { item: SaleItem }) {
  const navigate = useNavigate();
  return (
    <div className="sale-card" onClick={() => navigate(`/product/${item.id}`)}>
      <div className="sale-card__img-wrap">
        <img
          src={item.imagem_url ?? listProd1}
          alt={item.nome}
          className="sale-card__img"
          onError={e => { (e.target as HTMLImageElement).src = listProd1; }}
        />
        <span className="sale-card__badge">−{item.desconto_pct}%</span>
      </div>
      <div className="sale-card__info">
        <p className="sale-card__name">{item.nome}</p>
        {item.cor && <p className="sale-card__color">{item.cor}</p>}
        <div className="sale-card__pricing">
          <span className="sale-card__sale-price">{fmtPreco(item.preco_sale)}</span>
          <span className="sale-card__orig-price">{fmtPreco(item.preco)}</span>
        </div>
      </div>
    </div>
  );
}

export function SalePage() {
  usePageTitle("Sale");
  const [items, setItems]             = useState<SaleItem[]>([]);
  const [carregando, setCarregando]   = useState(true);
  const [erro, setErro]               = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FilterCategoria>("Todos");
  const [sortBy, setSortBy]           = useState<SortKey>("featured");
  const [timeLeft, setTimeLeft]       = useState(getTimeLeft());

  useEffect(() => {
    saleApi.list()
      .then(data => setItems(data))
      .catch(e => setErro((e as Error).message ?? "Erro ao carregar produtos em sale."))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = items.filter(
    p => activeCategory === "Todos" || p.categoria === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.preco_sale - b.preco_sale;
    if (sortBy === "price-desc") return b.preco_sale - a.preco_sale;
    if (sortBy === "pct")        return b.desconto_pct - a.desconto_pct;
    return a.id - b.id;
  });

  return (
    <div className="page">
      <Header />

      <section className="sale-hero">
        <div className="sale-hero__bg" />
        <div className="sale-hero__content">
          <p className="sale-hero__eyebrow">SALE SAZONAL</p>
          <h1 className="sale-hero__title">Até 50% OFF</h1>

          <div className="sale-countdown">
            <p className="sale-countdown__header">A sale acaba em:</p>
            <div className="sale-countdown__timer">
              <CountdownUnit value={timeLeft.d} label="Dias" />
              <span className="sale-countdown__sep">:</span>
              <CountdownUnit value={timeLeft.h} label="Horas" />
              <span className="sale-countdown__sep">:</span>
              <CountdownUnit value={timeLeft.m} label="Minutos" />
              <span className="sale-countdown__sep">:</span>
              <CountdownUnit value={timeLeft.s} label="Segundos" />
            </div>
          </div>
        </div>

        <div className="sale-hero__tiles">
          {[
            { label: "Superiores", img: catShirts,   cat: "Superiores" },
            { label: "Inferiores", img: catDenim,     cat: "Inferiores" },
            { label: "Inverno",    img: catOuterwear, cat: "Inverno"    },
          ].map(tile => (
            <div
              key={tile.label}
              className="sale-hero__tile"
              onClick={() => setActiveCategory(tile.cat as FilterCategoria)}
            >
              <img src={tile.img} alt={tile.label} className="sale-hero__tile-img" />
              <div className="sale-hero__tile-overlay">
                <p className="sale-hero__tile-label">{tile.label}</p>
                <p className="sale-hero__tile-cta">Compre já  →</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="sale-toolbar">
        <div className="sale-cats">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`sale-cat-btn${activeCategory === cat ? " sale-cat-btn--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sale-sort">
          <label className="sale-sort__label">Ordenar por</label>
          <select
            className="sale-sort__select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortKey)}
          >
            <option value="featured">Misturado</option>
            <option value="price-asc">Preço: baixo para alto</option>
            <option value="price-desc">Preço: alto para baixo</option>
            <option value="pct">Maior Desconto</option>
          </select>
        </div>
      </div>

      <div className="sale-results-row">
        <p className="sale-results-count">
          {carregando
            ? "Carregando..."
            : <>Mostrando <strong>{sorted.length}</strong> ite{sorted.length !== 1 ? "ns" : "m"}{activeCategory !== "Todos" ? ` em ${activeCategory}` : ""}</>
          }
        </p>
        <p className="sale-results-note">Frete grátis em compras acima de R$ 100,00</p>
      </div>

      {erro && (
        <p style={{ color: "#d0021b", fontSize: 14, padding: "20px 40px" }}>{erro}</p>
      )}

      <div className="sale-grid">
        {sorted.map(item => (
          <SaleCard key={item.id} item={item} />
        ))}
        {!carregando && !erro && sorted.length === 0 && (
          <p style={{ color: "#737373", fontSize: 14, gridColumn: "1/-1", padding: "20px 0" }}>
            Nenhum produto em sale nesta categoria.
          </p>
        )}
      </div>

      <div className="sale-policy-strip">
        {[
          { icon: "✓", text: "Devolução gratuita dentro de 30 dias" },
          { icon: "✓", text: "Frete grátis em pedidos acima de R$ 100,00" },
          { icon: "✓", text: "Itens em liquidação claramente marcados" },
          { icon: "✓", text: "Checkout seguro" },
        ].map(p => (
          <div key={p.text} className="sale-policy-strip__item">
            <span className="sale-policy-strip__icon">{p.icon}</span>
            <span className="sale-policy-strip__text">{p.text}</span>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
