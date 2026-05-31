import { useState } from "react";
import { useNavigate } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { searchCat1, searchCat2, searchCat3, searchCat4 } from "../../assets/assets";

const popularCategories = [
  { img: searchCat1, label: "Women's Sweaters" },
  { img: searchCat2, label: "Women's Bottom" },
  { img: searchCat3, label: "Women's Boots" },
  { img: searchCat4, label: "Men's Best Sellers" },
];

export function SearchPage() {
  usePageTitle("Busca");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="page">
      <Header activeTab="men" />

      {/* Search Bar */}
      <section className="search-bar-section">
        <input
          className="search-input-box"
          type="text"
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        <button className="search-cancel" onClick={() => navigate(-1)}>Cancel</button>
      </section>

      {/* Popular Categories */}
      <section className="popular-categories-section">
        <p className="popular-categories-label">Popular Categories</p>
        <div className="popular-grid">
          {popularCategories.map(({ img, label }) => (
            <div
              key={label}
              className="popular-card"
              onClick={() => navigate("/listing")}
              style={{ cursor: "pointer" }}
            >
              <div className="popular-card__img">
                <img src={img} alt={label} />
              </div>
              <p className="popular-card__label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
