import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  listProd1, listProd2, listProd3, listProd4, listProd5,
  listProd6, listProd7, listProd8, listProd9,
} from "../../imports/assets";

const products = [
  { id: "1", img: listProd1, name: "The Cloud Relaxed Cardigan",                 price: "$132", sale: "$132", badge: "30% off", color: "Black",            swatches: ["#1a1a1a","#1a3a6b","#5a3825"] },
  { id: "2", img: listProd2, name: "The Organic Cotton Long-Sleeve Turtleneck",  price: "$44",  sale: "$35",  badge: "30% off", color: "Black",            tags: ["ORGANIC COTTON"] },
  { id: "3", img: listProd3, name: "The Wool Flannel Pant",                      price: "$118", sale: "$87",  badge: "30% off", color: "Heather Charcoal", tags: ["RENEWED MATERIALS","CLEANER CHEMISTRY"] },
  { id: "4", img: listProd4, name: "The Cloud Relaxed Cardigan",                 price: "$132", sale: "$132", badge: "30% off", color: "Black",            swatches: ["#1a1a1a","#1a3a6b","#5a3825","#000"] },
  { id: "5", img: listProd5, name: "The Organic Cotton Long-Sleeve Turtleneck",  price: "$44",  sale: "$35",  badge: "30% off", color: "Black",            tags: ["ORGANIC COTTON"] },
  { id: "6", img: listProd6, name: "The Wool Flannel Pant",                      price: "$118", sale: "$87",  badge: "30% off", color: "Heather Charcoal", tags: ["RENEWED MATERIALS","CLEANER CHEMISTRY"] },
  { id: "7", img: listProd7, name: "The Cloud Relaxed Cardigan",                 price: "$132", sale: "$132", badge: "30% off", color: "Black",            swatches: ["#1a1a1a","#777","#5a3825","#c8a400"] },
  { id: "8", img: listProd8, name: "The Organic Cotton Long-Sleeve Turtleneck",  price: "$44",  sale: "$35",  badge: "30% off", color: "Black",            tags: ["ORGANIC COTTON"] },
  { id: "9", img: listProd9, name: "The Wool Flannel Pant",                      price: "$118", sale: "$87",  badge: "30% off", color: "Heather Charcoal", tags: ["RENEWED MATERIALS","CLEANER CHEMISTRY"] },
];

const categories = [
  "Everyone - All Gender Collection",
  "Accessories & Gift Cards",
  "Backpacks, Weekenders & Duffle Bags",
  "Dress Shirts & Button Downs",
  "Hoodies & Sweatshirts",
];

const colors = [
  { name: "Black",  hex: "#1a1a1a" },
  { name: "Blue",   hex: "#1a3a6b" },
  { name: "Brown",  hex: "#5a3825" },
  { name: "Green",  hex: "#2d4a2d" },
  { name: "Grey",   hex: "#888" },
  { name: "Orange", hex: "#d46b1a" },
  { name: "Pink",   hex: "#e8a5b0" },
  { name: "Red",    hex: "#c0392b" },
  { name: "Tan",    hex: "#c8a87a" },
];

const menSubNav = [
  { label: "About" },
  { label: "Stores" },
  { label: "Factories" },
  { label: "Environmental Initiatives" },
  { label: "Our Carbon Commitment" },
  { label: "Annual Impact Report" },
  { label: "Cleaner Fashion" },
];

export function ListingPage() {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  return (
    <div className="page">
      <Header activeTab="men" subNavItems={menSubNav} />

      <div className="listing-page">
        {/* Sidebar */}
        <aside className="listing-sidebar">
          <p className="listing-sidebar__count">249 Products</p>

          {/* Category Filter */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Category</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, overflow: "hidden", maxHeight: 169 }}>
              {categories.map(cat => (
                <label key={cat} className="filter-checkbox" style={{ cursor: "pointer" }}>
                  <div className="filter-checkbox__box" />
                  <span className="filter-checkbox__label">{cat}</span>
                </label>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#4c4c4b", letterSpacing: "0.2px", padding: "4px 0 20px", cursor: "pointer" }}>View More +</p>
          </div>

          {/* Color Filter */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Color</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {colors.map(({ name, hex }) => (
                <div
                  key={name}
                  className="filter-color"
                  onClick={() => setSelectedColors(prev =>
                    prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
                  )}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="filter-color__swatch"
                    style={{
                      background: hex,
                      outline: selectedColors.includes(name) ? "2px solid #262626" : "none",
                      outlineOffset: 2,
                    }}
                  />
                  <span className="filter-color__name">{name}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#4c4c4b", letterSpacing: "0.2px", padding: "4px 0 20px", cursor: "pointer" }}>View More +</p>
          </div>

          {/* Size Filter */}
          <div className="filter-section">
            <div className="filter-section__header">
              <p className="filter-section__title">Size</p>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 9L6 3L11 9" stroke="#262626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: 12, color: "#737373", marginBottom: 8 }}>Waist</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {["30","32","34","36","38","40"].map(s => (
                <button key={s} style={{ border: "1px solid #dddbdc", padding: "4px 8px", fontSize: 12, cursor: "pointer", background: "#fff", color: "#262626" }}>{s}</button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#737373", marginBottom: 8 }}>Clothing</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {["XXS","XS","S","M","L","XL","XXL","XXXL"].map(s => (
                <button key={s} style={{ border: "1px solid #dddbdc", padding: "4px 8px", fontSize: 12, cursor: "pointer", background: "#fff", color: "#262626" }}>{s}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="listing-main">
          <p className="listing-breadcrumb">Home &gt; Men</p>
          <p className="listing-title">Men's Clothing &amp; Apparel - New Arrivals</p>
          <p className="listing-featured-label">Featured</p>

          <div className="product-grid">
            {products.map(({ id, img, name, price, sale, badge, color, swatches, tags }) => (
              <div
                key={id}
                className="listing-product-card"
                onClick={() => navigate(`/product/${id}`)}
              >
                <div className="listing-product-card__img">
                  <img src={img} alt={name} />
                  {badge && <div className="listing-product-card__badge">{badge}</div>}
                </div>
                <p className="listing-product-card__name">{name}</p>
                <div className="listing-product-card__price-row">
                  {sale !== price ? (
                    <>
                      <span className="listing-product-card__original-price">{price}</span>
                      <span className="listing-product-card__sale-price">{sale}</span>
                    </>
                  ) : (
                    <span style={{ color: "#262626" }}>{price}</span>
                  )}
                </div>
                <p className="listing-product-card__color">{color}</p>
                {swatches && (
                  <div className="listing-product-card__swatches">
                    {swatches.map(hex => (
                      <div key={hex} className="listing-product-card__swatch" style={{ background: hex }} />
                    ))}
                  </div>
                )}
                {tags && (
                  <div className="listing-product-card__tags">
                    {tags.map(tag => (
                      <span key={tag} className="listing-product-card__tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
