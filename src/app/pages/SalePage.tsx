import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  listProd1, listProd2, listProd3, listProd4,
  listProd5, listProd6, listProd7, listProd8, listProd9,
  catShirts, catDenim, catOuterwear, catSweaters,
} from "../../assets/assets";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = "All" | "Tops" | "Bottoms" | "Outerwear" | "Knitwear" | "Accessories";

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

// ─── Mock data ────────────────────────────────────────────────────────────────

const SALE_PRODUCTS: SaleProduct[] = [
  { id: 1, name: "The Air Oversized Tee", category: "Tops", originalPrice: 30, salePrice: 18, img: listProd1, color: "White", tag: "40% OFF" },
  { id: 2, name: "The Organic Cotton Crew", category: "Tops", originalPrice: 45, salePrice: 27, img: listProd2, color: "Bone", tag: "40% OFF" },
  { id: 3, name: "The Slim Jean", category: "Bottoms", originalPrice: 88, salePrice: 55, img: listProd3, color: "Dark Indigo", tag: "37% OFF" },
  { id: 4, name: "The Wide-Leg Jean", category: "Bottoms", originalPrice: 98, salePrice: 59, img: listProd4, color: "Vintage", tag: "40% OFF" },
  { id: 5, name: "The ReNew Sherpa Jacket", category: "Outerwear", originalPrice: 168, salePrice: 98, img: listProd5, color: "Camel", tag: "41% OFF" },
  { id: 6, name: "The Merino Turtleneck", category: "Knitwear", originalPrice: 120, salePrice: 72, img: listProd6, color: "Heather", tag: "40% OFF" },
  { id: 7, name: "The Cashmere Crewneck", category: "Knitwear", originalPrice: 175, salePrice: 105, img: listProd7, color: "Cream", tag: "40% OFF" },
  { id: 8, name: "The Day Market Tote", category: "Accessories", originalPrice: 65, salePrice: 39, img: listProd8, color: "Natural", tag: "40% OFF" },
  { id: 9, name: "The Italian Leather Belt", category: "Accessories", originalPrice: 55, salePrice: 33, img: listProd9, color: "Black", tag: "40% OFF" },
  { id: 10, name: "The Oxford Button-Down", category: "Tops", originalPrice: 78, salePrice: 47, img: catShirts, color: "Blue Stripe", tag: "39% OFF" },
  { id: 11, name: "The Straight Leg Jean", category: "Bottoms", originalPrice: 98, salePrice: 55, img: catDenim, color: "Slate", tag: "43% OFF" },
  { id: 12, name: "The ReNew Puffer Vest", category: "Outerwear", originalPrice: 128, salePrice: 77, img: catOuterwear, color: "Forest", tag: "39% OFF" },
];

const CATEGORIES: Category[] = ["All", "Tops", "Bottoms", "Outerwear", "Knitwear", "Accessories"];

const saleSubNav = [
  { label: "All Sale", active: true, path: "/sale" },
  { label: "New Arrivals", path: "/listing" },
  { label: "Best-Sellers", path: "/listing" },
  { label: "Lookbook", path: "/lookbook" },
];

// ─── Countdown ────────────────────────────────────────────────────────────────

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

// ─── Product Card ─────────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SalePage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "pct">("featured");
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = SALE_PRODUCTS.filter(
    p => activeCategory === "All" || p.category === activeCategory
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
      <Header subNavItems={saleSubNav} />

      {/* ── Hero ── */}
      <section className="sale-hero">
        <div className="sale-hero__bg" />
        <div className="sale-hero__content">
          <p className="sale-hero__eyebrow">SEASONAL CLEARANCE</p>
          <h1 className="sale-hero__title">Up to 50% off</h1>
          <p className="sale-hero__sub">
            Final markdowns on our most beloved styles — while quantities last.
          </p>

          {/* Countdown */}
          <div className="sale-countdown">
            <p className="sale-countdown__header">Sale ends in</p>
            <div className="sale-countdown__timer">
              <CountdownUnit value={timeLeft.d} label="Days" />
              <span className="sale-countdown__sep">:</span>
              <CountdownUnit value={timeLeft.h} label="Hrs" />
              <span className="sale-countdown__sep">:</span>
              <CountdownUnit value={timeLeft.m} label="Min" />
              <span className="sale-countdown__sep">:</span>
              <CountdownUnit value={timeLeft.s} label="Sec" />
            </div>
          </div>
        </div>

        {/* Category tiles */}
        <div className="sale-hero__tiles">
          {[
            { label: "Tops", img: catShirts, cat: "Tops" },
            { label: "Denim", img: catDenim, cat: "Bottoms" },
            { label: "Outerwear", img: catOuterwear, cat: "Outerwear" },
            { label: "Knitwear", img: catSweaters, cat: "Knitwear" },
          ].map(tile => (
            <div
              key={tile.label}
              className="sale-hero__tile"
              onClick={() => setActiveCategory(tile.cat as Category)}
            >
              <img src={tile.img} alt={tile.label} className="sale-hero__tile-img" />
              <div className="sale-hero__tile-overlay">
                <p className="sale-hero__tile-label">{tile.label}</p>
                <p className="sale-hero__tile-cta">Shop Now →</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div className="sale-toolbar">
        {/* Category pills */}
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

        {/* Sort */}
        <div className="sale-sort">
          <label className="sale-sort__label">Sort by</label>
          <select
            className="sale-sort__select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="pct">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* ── Results info ── */}
      <div className="sale-results-row">
        <p className="sale-results-count">
          Showing <strong>{sorted.length}</strong> item{sorted.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        </p>
        <p className="sale-results-note">Free shipping on orders over $100</p>
      </div>

      {/* ── Product Grid ── */}
      <div className="sale-grid">
        {sorted.map(product => (
          <SaleCard key={product.id} product={product} />
        ))}
      </div>

      {/* ── Policy strip ── */}
      <div className="sale-policy-strip">
        {[
          { icon: "✓", text: "Free returns within 30 days" },
          { icon: "✓", text: "Free shipping on orders $100+" },
          { icon: "✓", text: "Final sale items clearly marked" },
          { icon: "✓", text: "Secure & encrypted checkout" },
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
