import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  pdMain, pdThumb1, pdThumb2, pdThumb3, pdThumb4, pdThumb5,
  pdRec1, pdRec2, pdRec3, pdRec4,
} from "../../assets/assets";

function StarFull({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5L7 1Z" fill="#000" />
    </svg>
  );
}

const galleryImages = [pdMain, pdThumb1, pdThumb2, pdThumb3, pdThumb4, pdThumb5];

const recommendedProducts = [
  { img: pdRec1, name: "The OG-Fit LT-Sleeve Crew", price: "$40" },
  { img: pdRec2, name: "The Waffle Long-Sleeve Crew", price: "$60" },
  { img: pdRec3, name: "The Hoodie Relaxed Jean", price: "$88" },
  { img: pdRec4, name: "The Rib Long-Sleeve Tee", price: "$60" },
];

const colorSwatches = [
  { name: "Dark Olive", hex: "#4a4a2a" },
  { name: "Navy", hex: "#1a1a5e" },
  { name: "Brown", hex: "#5a3825" },
];

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

const reviews = [
  {
    author: "ElizabethMillys",
    date: "5 days ago",
    rating: 5,
    text: "Fit and feel is very attractive sir",
    meta: "Height: 5'4\" · Weight: 135 lb · Size Purchased: 11 · 13 to 14",
  },
  {
    author: "Anonymous",
    date: "4 days ago",
    rating: 5,
    text: "Great quality, worth every penny. But for fit, you'll need a large pants and it is perfect. It does run a bit oversized which is great.",
    meta: "Height: 5'8\" · Weight: 160 lb · Size Purchased: L",
  },
];

export function ProductDetailPage() {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0].name);
  const [selectedSize, setSelectedSize] = useState("M");
  const [mainImage, setMainImage] = useState(galleryImages[0]);

  return (
    <div className="page">
      <Header activeTab="men" />

      {/* Breadcrumb */}
      <div style={{ padding: "12px 40px", borderBottom: "1px solid #dddbdc" }}>
        <p style={{ fontSize: 12, color: "#737373", letterSpacing: "0.2px" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</span>
          {" > "}
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/listing")}>Men</span>
          {" > Outerwear"}
        </p>
      </div>

      {/* Main Product Area */}
      <div style={{ display: "flex", gap: 40, padding: "0 0 60px", width: "100%", alignItems: "flex-start" }}>

        {/* Gallery */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, padding: "24px 0 0 40px" }}>
          {/* Main image */}
          <div style={{ width: "100%", aspectRatio: "3/4", position: "relative", overflow: "hidden", background: "#f5f4f4" }}>
            <img
              src={mainImage}
              alt="Product"
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          {/* Thumbnails */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {galleryImages.slice(1).map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImage(img)}
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  position: "relative",
                  overflow: "hidden",
                  background: "#f5f4f4",
                  cursor: "pointer",
                  border: mainImage === img ? "2px solid #262626" : "2px solid transparent",
                }}
              >
                <img
                  src={img}
                  alt={`View ${i + 2}`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ width: 340, flexShrink: 0, padding: "40px 40px 0 0", display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontSize: 12, color: "#d0021b", letterSpacing: "0.5px" }}>30% off</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 20, lineHeight: "28px", color: "#262626" }}>
              The ReWoole Oversized Shirt Jacket
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ color: "#737373", fontSize: 16, textDecoration: "line-through" }}>$198</span>
              <span style={{ color: "#262626", fontSize: 16, fontWeight: 600 }}>$167</span>
            </div>
            <div style={{ display: "flex", gap: 2 }}>
              {[0, 1, 2, 3, 4].map(i => <StarFull key={i} size={12} />)}
            </div>
          </div>

          {/* Color */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 12, color: "#262626", letterSpacing: "0.2px" }}>
              Color: <strong>{selectedColor}</strong>
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {colorSwatches.map(({ name, hex }) => (
                <div
                  key={name}
                  onClick={() => setSelectedColor(name)}
                  title={name}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: hex, cursor: "pointer",
                    border: selectedColor === name ? "2px solid #262626" : "2px solid transparent",
                    outline: selectedColor === name ? "1px solid #fff" : "none",
                    outlineOffset: -4,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#262626", letterSpacing: "0.2px" }}>
              <span>Size</span>
              <span style={{ color: "#737373", textDecoration: "underline", cursor: "pointer" }}>Size Guide</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    border: `1px solid ${selectedSize === size ? "#262626" : "#dddbdc"}`,
                    padding: "8px 12px", fontSize: 12, letterSpacing: "0.2px", cursor: "pointer",
                    background: selectedSize === size ? "#262626" : "#fff",
                    color: selectedSize === size ? "#fff" : "#262626",
                    fontFamily: "inherit",
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Bag */}
          <button
            style={{
              width: "100%", background: "#262626", color: "#fff",
              padding: "16px", fontSize: 14, letterSpacing: "1.4px",
              textAlign: "center", cursor: "pointer", border: "none", fontFamily: "inherit",
            }}
          >
            ADD TO BAG
          </button>

          {/* Perks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "📦", text: "Free Shipping on orders over $100" },
              { icon: "↩", text: "Easy Returns — 30 day window when you sign up" },
              { icon: "🌿", text: "Get it in 3–4 business days" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 12, color: "#262626", letterSpacing: "0.2px" }}>
                <span>{icon}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div style={{ borderTop: "1px solid #dddbdc", paddingTop: 16 }}>
            <p style={{ fontSize: 14, lineHeight: "22px", color: "#262626", letterSpacing: "0.2px" }}>
              Part shirt, part jacket, all style. About your new cross-utility staple: The ReWoole Oversized Shirt Jacket
              combines best-in-class fit and versatile function. With belt loop front chest pockets and a button-up placket,
              it's a wardrobe must.
            </p>
          </div>

          {/* Model + Fit */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "#262626", borderTop: "1px solid #dddbdc", paddingTop: 16 }}>
            <div style={{ display: "flex", gap: 24 }}>
              <div><p style={{ color: "#737373" }}>Model</p><p>Model is 6'1", wearing a M</p></div>
              <div><p style={{ color: "#737373" }}>Fit</p><p>Boyfriend/Boxy fit</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="recommended-section" style={{ borderTop: "1px solid #dddbdc" }}>
        <p className="recommended-section__title">Recommended Products</p>
        <div className="recommended-grid">
          {recommendedProducts.map(({ img, name, price }) => (
            <div key={name} className="recommended-card" onClick={() => navigate("/product/1")}>
              <div className="recommended-card__img">
                <img src={img} alt={name} />
              </div>
              <p className="recommended-card__name">{name}</p>
              <p className="recommended-card__price">{price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <p className="reviews-section__title">Reviews</p>
        <div style={{ display: "flex", gap: 40, marginBottom: 32, padding: "20px 0", borderTop: "1px solid #dddbdc", borderBottom: "1px solid #dddbdc" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <p style={{ fontSize: 32, fontWeight: 600, color: "#262626" }}>5.0</p>
            <div style={{ display: "flex", gap: 2 }}>{[0, 1, 2, 3, 4].map(i => <StarFull key={i} size={14} />)}</div>
            <p style={{ fontSize: 12, color: "#737373" }}>Overall Rating</p>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#737373", width: 8 }}>{rating}</span>
                <div style={{ flex: 1, height: 4, background: "#f0f0f0", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: rating === 5 ? "90%" : "5%", height: "100%", background: "#262626", borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {reviews.map(({ author, date, rating, text, meta }) => (
          <div key={author} className="review-card">
            <div className="review-card__header">
              <p className="review-card__author">{author}</p>
              <p className="review-card__date">{date}</p>
            </div>
            <div style={{ display: "flex", gap: 2 }}>{Array.from({ length: rating }).map((_, i) => <StarFull key={i} size={12} />)}</div>
            <p className="review-card__text">{text}</p>
            <p className="review-card__meta">{meta}</p>
          </div>
        ))}
      </div>

      {/* Transparent Pricing */}
      <div className="transparent-pricing">
        <p className="transparent-pricing__title">Transparent Pricing</p>
        <div className="pricing-breakdown">
          {[
            { label: "Materials", value: "$65.77" },
            { label: "Hardware", value: "$3.05" },
            { label: "Labor", value: "$26.34" },
            { label: "Duties", value: "$8.18" },
            { label: "Transport", value: "$5.67" },
          ].map(({ label, value }) => (
            <div key={label} className="pricing-item">
              <div className="pricing-item__icon" style={{ background: "#e0e0e0", borderRadius: 4 }} />
              <p className="pricing-item__label">{label}</p>
              <p className="pricing-item__value">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
