import React, { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  landingHero,
  catShirts, catDenim, catTees, catPants, catSweaters, catOuterwear,
  bannerNewArrivals, bannerBestSellers, bannerHoliday,
  missionBanner,
  favProduct1, favProduct2, favProduct3, favProduct4,
  reviewImg,
  editorialImg1, editorialImg2,
  ugcPhoto1, ugcPhoto2, ugcPhoto3, ugcPhoto4, ugcPhoto5,
  perkShipping, perkSustain, perkStores,
} from "../../imports/assets";

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L8.5 5H13L9.5 7.5L11 11.5L7 9L3 11.5L4.5 7.5L1 5H5.5L7 1Z" fill="#000" />
    </svg>
  );
}

const categoryItems = [
  { img: catShirts,   label: "SHIRTS" },
  { img: catDenim,    label: "DENIM" },
  { img: catTees,     label: "TEES" },
  { img: catPants,    label: "PANTS" },
  { img: catSweaters, label: "SWEATERS" },
  { img: catOuterwear,label: "OUTERWEAR" },
];

const bannerItems = [
  { img: bannerNewArrivals, title: "New Arrivals",          cta: "SHOP THE LATEST" },
  { img: bannerBestSellers, title: "Best-Sellers",          cta: "SHOP YOUR FAVORITES" },
  { img: bannerHoliday,     title: "The Holiday Outfit",    cta: "SHOP OCCASION" },
];

const favoriteProducts = [
  { img: favProduct1, name: "The Waffle Long-Sleeve Crew",                          price: "$60",  color: "Bone" },
  { img: favProduct2, name: "The Bomber Jacket | Uniform",                          price: "$148", color: "Toasted Coconut" },
  { img: favProduct3, name: "The Slim 4-Way Stretch Organic Jean | Uniform",        price: "$98",  color: "Dark Indigo" },
  { img: favProduct4, name: "The Essential Organic Crew",                           price: "$30",  color: "Vintage Black" },
];

const ugcPhotos = [ugcPhoto1, ugcPhoto2, ugcPhoto3, ugcPhoto4, ugcPhoto5];

export function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="page">
      <Header />

      {/* Hero */}
      <section className="hero">
        <img src={landingHero} alt="Hero" className="hero__bg" />
        <div className="hero__content">
          <div className="hero__inner">
            <div className="hero__text-block">
              <p className="hero__title">Your Cozy Era</p>
              <div className="hero__subtitle">
                <p>Get peak comfy-chic</p>
                <p>with new winter essentials.</p>
              </div>
            </div>
            <button className="btn btn--wide">SHOP NOW</button>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section-categories">
        <p className="section-categories__title">Shop by Category</p>
        <div className="category-grid">
          {categoryItems.map(({ img, label }) => (
            <div key={label} className="category-card">
              <div className="category-card__img">
                <img src={img} alt={label} />
              </div>
              <p className="category-card__label">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Banners */}
      <section className="section-banners">
        {bannerItems.map(({ img, title, cta }) => (
          <div key={title} className="banner-card">
            <img src={img} alt={title} className="banner-card__bg" />
            <p className="banner-card__title">{title}</p>
            <button className="btn btn--wide">{cta}</button>
          </div>
        ))}
      </section>

      {/* Mission Banner */}
      <section className="section-mission">
        <div className="mission-banner">
          <img src={missionBanner} alt="Mission" className="mission-banner__bg" />
          <div className="mission-banner__content">
            <p className="mission-banner__title">We're on a Mission To Clean Up the Industry</p>
            <p className="mission-banner__subtitle">Read about our progress in our latest Impact Report.</p>
            <button className="btn btn--wide">LEARN MORE</button>
          </div>
        </div>
      </section>

      {/* Everlane Favorites */}
      <section className="section-favorites">
        <div className="section-favorites__header">
          <p className="section-favorites__title">Everlane Favorites</p>
          <p className="section-favorites__subtitle">Beautifully Functional. Purposefully Designed. Consciously Crafted.</p>
        </div>

        <div className="product-carousel">
          <div className="carousel-arrow">
            <svg width="14" height="27" viewBox="0 0 14.5 27" fill="none">
              <path d="M13.5 26L1 13.5L13.5 1" stroke="#262626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          {favoriteProducts.map(({ img, name, price, color }) => (
            <div key={name} className="product-card">
              <div className="product-card__img">
                <img src={img} alt={name} />
              </div>
              <div className="product-card__info">
                <div className="product-card__name-row">
                  <span style={{ flex: 1 }}>{name}</span>
                  <span style={{ whiteSpace: "nowrap" }}>{price}</span>
                </div>
                <p className="product-card__color">{color}</p>
              </div>
            </div>
          ))}
          <div className="carousel-arrow">
            <svg width="14" height="27" viewBox="0 0 14.5 27" fill="none">
              <path d="M1 1L13.5 13.5L1 26" stroke="#262626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div className="indicator">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`indicator__dot${i === activeSlide ? " indicator__dot--active" : ""}`}
              onClick={() => setActiveSlide(i)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </section>

      {/* People Are Talking */}
      <section style={{ display: "flex", flexDirection: "column", gap: 30, width: "100%", paddingBottom: 30 }}>
        <div style={{ borderTop: "1px solid #dddbdc", margin: "0 77px" }} />

        <div className="review-panel">
          <div className="carousel-arrow">
            <svg width="9.5" height="17" viewBox="0 0 9.5 17" fill="none">
              <path d="M8.5 16L1 8.5L8.5 1" stroke="#262626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>

          <div className="review-panel__text">
            <p className="review-panel__label">People Are Talking</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
              <div className="review-panel__stars">
                {[0,1,2,3,4].map(i => <StarIcon key={i} />)}
              </div>
              <p className="review-panel__quote">
                "Love this shirt! Fits perfectly and the fabric is thick without being stiff."
              </p>
            </div>
            <p className="review-panel__attribution">
              -- JonSnSF, <span style={{ textDecoration: "underline", cursor: "pointer" }}>The Heavyweight Overshirt</span>
            </p>
          </div>

          <div className="review-panel__img">
            <img src={reviewImg} alt="Review" />
          </div>

          <div className="carousel-arrow">
            <svg width="9.5" height="17" viewBox="0 0 9.5 17" fill="none">
              <path d="M1 1L8.5 8.5L1 16" stroke="#262626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", padding: 20 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: i === 0 ? "#262626" : "#dddbdc" }} />
          ))}
        </div>
        <div style={{ height: 1, background: "#000", margin: "0 77px" }} />
      </section>

      {/* Editorial Grid */}
      <section className="section-editorial">
        <div className="editorial-grid">
          <div className="editorial-card">
            <p className="editorial-card__title">Our Holiday Gift Picks</p>
            <div className="editorial-card__img">
              <img src={editorialImg1} alt="Holiday Gift Picks" />
            </div>
            <p className="editorial-card__desc">The best presents for everyone on your list.</p>
            <p className="editorial-card__link">Read More</p>
          </div>
          <div className="editorial-card">
            <p className="editorial-card__title">Cleaner Fashion</p>
            <div className="editorial-card__img">
              <img src={editorialImg2} alt="Cleaner Fashion" />
            </div>
            <p className="editorial-card__desc">See the sustainability efforts behind each of our products.</p>
            <p className="editorial-card__link">Learn More</p>
          </div>
        </div>
      </section>

      {/* #EverlaneOnYou */}
      <section className="section-ugc">
        <div className="ugc-header">
          <p className="ugc-header__title">Everlane On You</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            <p className="ugc-header__sub">Share your latest look with #EverlaneOnYou for a chance to be featured.</p>
            <p className="ugc-header__link">Add Your Photo</p>
          </div>
        </div>
        <div className="ugc-photos" style={{ marginTop: 12 }}>
          <div className="carousel-arrow">
            <svg width="14" height="27" viewBox="0 0 14.5 27" fill="none">
              <path d="M13.5 26L1 13.5L13.5 1" stroke="#262626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          {ugcPhotos.map((photo, i) => (
            <div key={i} className="ugc-photo">
              <img src={photo} alt={`Community photo ${i + 1}`} />
              <button className="ugc-photo__cart-btn" aria-label="Add to cart">
                <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                  <path d="M3 4h3l2.5 13h13l2.5-9H8" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="22" r="1.5" fill="#262626" />
                  <circle cx="20" cy="22" r="1.5" fill="#262626" />
                </svg>
              </button>
            </div>
          ))}
          <div className="carousel-arrow">
            <svg width="14" height="27" viewBox="0 0 14.5 27" fill="none">
              <path d="M1 1L13.5 13.5L1 26" stroke="#262626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="section-perks">
        <div className="perks-grid">
          <div className="perk">
            <div className="perk__icon">
              <img src={perkShipping} alt="Shipping" />
            </div>
            <div>
              <p className="perk__title">Complimentary Shipping</p>
              <p className="perk__desc">Enjoy free shipping on U.S. orders over $100.</p>
            </div>
          </div>
          <div className="perk">
            <div className="perk__icon">
              <img src={perkSustain} alt="Sustainability" />
            </div>
            <div>
              <p className="perk__title">Consciously Crafted</p>
              <p className="perk__desc">Designed with you and the planet in mind.</p>
            </div>
          </div>
          <div className="perk">
            <div className="perk__icon">
              <img src={perkStores} alt="Stores" />
            </div>
            <div>
              <p className="perk__title">Come Say Hi</p>
              <p className="perk__desc">We have 11 stores across the U.S.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
