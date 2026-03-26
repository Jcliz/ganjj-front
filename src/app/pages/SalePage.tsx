import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  listProd1, listProd2, listProd3, listProd4,
  listProd5, listProd6, listProd7, listProd8,
  catShirts, catDenim, catOuterwear,
} from "../../assets/assets";

type Category = "Todos" | "Superiores" | "Inferiores" | "Inverno";

interface SaleProduct {
  id: number;
  name: string;
  category: Category;
  originalPrice: number;
  salePrice: number;
  img: string;
  color: string;
  tag?: string;
}

const SALE_PRODUCTS: SaleProduct[] = [
  { id: 1, name: "Camiseta oversized", category: "Superiores", originalPrice: 30, salePrice: 18, img: listProd1, color: "White", tag: "40% OFF" },
  { id: 2, name: "Turtleneck com algodão orgânico", category: "Superiores", originalPrice: 45, salePrice: 27, img: listProd2, color: "Bone", tag: "40% OFF" },
  { id: 3, name: "Slim Jim", category: "Inferiores", originalPrice: 88, salePrice: 55, img: listProd3, color: "Dark Indigo", tag: "37% OFF" },
  { id: 4, name: "Jeans Wide-leg", category: "Inferiores", originalPrice: 98, salePrice: 59, img: listProd4, color: "Vintage", tag: "40% OFF" },
  { id: 5, name: "Jaqueta ReNew Sherpa", category: "Inverno", originalPrice: 168, salePrice: 98, img: listProd5, color: "Camel", tag: "41% OFF" },
  { id: 6, name: "Turtleneck Marino", category: "Todos", originalPrice: 120, salePrice: 72, img: listProd6, color: "Heather", tag: "40% OFF" },
  { id: 7, name: "Crewneck Cashmere", category: "Todos", originalPrice: 175, salePrice: 105, img: listProd7, color: "Cream", tag: "40% OFF" },
  { id: 8, name: "Market Tote", category: "Todos", originalPrice: 65, salePrice: 39, img: listProd8, color: "Natural", tag: "40% OFF" },
];

const CATEGORIES: Category[] = ["Todos", "Superiores", "Inferiores", "Inverno"];

function getTimeLeft() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);
  endDate.setHours(23, 59, 59, 0);
  const diff = endDate.getTime() - Date.now();
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

function SaleCard({ product }: { product: SaleProduct }) {
  const navigate = useNavigate();
  const pctOff = Math.round((1 - product.salePrice / product.originalPrice) * 100);
  return (
    <div className="sale-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="sale-card__img-wrap">
        <img src={product.img} alt={product.name} className="sale-card__img" />
        <span className="sale-card__badge">−{pctOff}%</span>
      </div>
      <div className="sale-card__info">
        <p className="sale-card__name">{product.name}</p>
        <p className="sale-card__color">{product.color}</p>
        <div className="sale-card__pricing">
          <span className="sale-card__sale-price">${product.salePrice}</span>
          <span className="sale-card__orig-price">${product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
}

export function SalePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("Todos");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "pct">("featured");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = SALE_PRODUCTS.filter(
    p => activeCategory === "Todos" || p.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.salePrice - b.salePrice;
    if (sortBy === "price-desc") return b.salePrice - a.salePrice;
    if (sortBy === "pct") return (b.originalPrice - b.salePrice) / b.originalPrice
      - (a.originalPrice - a.salePrice) / a.originalPrice;
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
            { label: "Superiores", img: catShirts, cat: "Superiores" },
            { label: "Inferiores", img: catDenim, cat: "Inferiores" },
            { label: "Inverno", img: catOuterwear, cat: "Inverno" },
          ].map(tile => (
            <div
              key={tile.label}
              className="sale-hero__tile"
              onClick={() => setActiveCategory(tile.cat as Category)}
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
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
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
          Mostrando <strong>{sorted.length}</strong> ite{sorted.length !== 1 ? "ns" : "m"}
          {activeCategory !== "Todos" ? ` em ${activeCategory}` : ""}
        </p>
        <p className="sale-results-note">Frete grátis em compras acima de R$ 100,00</p>
      </div>

      <div className="sale-grid">
        {sorted.map(product => (
          <SaleCard key={product.id} product={product} />
        ))}
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
