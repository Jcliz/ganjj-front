import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// ─── Sub-nav ──────────────────────────────────────────────────────────────────

const lookbookSubNav = [
  { label: "Lookbook", active: true, path: "/lookbook" },
  { label: "New Arrivals", path: "/listing" },
  { label: "Best-Sellers", path: "/listing" },
  { label: "Sale", sale: true, path: "/sale" },
];

// ─── Collections ─────────────────────────────────────────────────────────────

type CollectionKey = "all" | "ss25" | "fw24" | "essentials" | "men";

const COLLECTIONS: { key: CollectionKey; label: string }[] = [
  { key: "all",        label: "All"        },
  { key: "ss25",       label: "SS25"       },
  { key: "fw24",       label: "FW24"       },
  { key: "essentials", label: "Essentials" },
  { key: "men",        label: "Men"        },
];

// ─── Photos ───────────────────────────────────────────────────────────────────

interface LookPhoto {
  id: number;
  src: string;
  collection: CollectionKey;
  title: string;
  subtitle: string;
  span: "wide" | "tall" | "normal";
}

const PHOTOS: LookPhoto[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1762605135012-56a59a059e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbWluaW1hbCUyMGNsb3RoaW5nJTIwbW9kZWx8ZW58MXx8fHwxNzc0MTE0NzgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "ss25",
    title: "The Air Collection",
    subtitle: "SS25 · Lightweight Essentials",
    span: "wide",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1763766274631-2bb0489d23c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbG9va2Jvb2slMjB3b21hbiUyMGNvYXQlMjBhdXR1bW4lMjBzdHJlZXR8ZW58MXx8fHwxNzc0MTE0Nzg2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "fw24",
    title: "Urban Layer",
    subtitle: "FW24 · The Outerwear Edit",
    span: "tall",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1759873911409-41fbf46e29c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRyb3VzZXJzJTIwYmxhemVyJTIwZWxlZ2FudCUyMG1pbmltYWxpc3QlMjBmYXNoaW9ufGVufDF8fHx8MTc3NDExNDgxM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "essentials",
    title: "Power Dressing",
    subtitle: "Essentials · The Tailored Set",
    span: "normal",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1588877682318-916dba50de43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBkZW5pbSUyMGplYW5zJTIwb3V0ZG9vciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDExNDc5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "essentials",
    title: "The Denim Chapter",
    subtitle: "Essentials · Straight Leg Jean",
    span: "normal",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1687275165002-4ba0a0525051?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN3ZWF0ZXIlMjBrbml0d2VhciUyMGVkaXRvcmlhbCUyMHdhcm0lMjBsaWdodHxlbnwxfHx8fDE3NzQxMTQ3OTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "fw24",
    title: "Warm Textures",
    subtitle: "FW24 · The Knitwear Edit",
    span: "tall",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1629458512512-79f23b9f0f07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBsaW5lbiUyMHNoaXJ0JTIwc3VtbWVyJTIwbWluaW1hbCUyMG91dGRvb3J8ZW58MXx8fHwxNzc0MTE0ODAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "ss25",
    title: "Linen Days",
    subtitle: "SS25 · The Summer Edit",
    span: "normal",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1760551733370-78b60b3bb962?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBibGFjayUyMGNvYXQlMjB3aW50ZXIlMjBlZGl0b3JpYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzQxMTQ4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "fw24",
    title: "Midnight Outerwear",
    subtitle: "FW24 · The Coat Edit",
    span: "wide",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1612049621554-1df669d740df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwY291cGxlJTIwbWluaW1hbCUyMG5ldXRyYWwlMjBvdXRmaXRzfGVufDF8fHx8MTc3NDExNDgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "men",
    title: "His & Hers",
    subtitle: "Essentials · Neutral Pairs",
    span: "normal",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1677779817420-b3ad7a4a1f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwY2xvc2UlMjB1cCUyMHRleHR1cmUlMjBmYWJyaWMlMjBkZXRhaWx8ZW58MXx8fHwxNzc0MTE0ODE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "essentials",
    title: "Material Studies",
    subtitle: "Craft · Fabric & Texture",
    span: "tall",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1690576639506-aebeccf53744?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjYXN1YWwlMjBtaW5pbWFsaXN0JTIwb3V0Zml0JTIwbmV1dHJhbCUyMGVhcnRoJTIwdG9uZXN8ZW58MXx8fHwxNzc0MTE0ODE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "men",
    title: "The Quiet Man",
    subtitle: "Men · Everyday Essentials",
    span: "normal",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1763551229559-a16b9376c60c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBzdHVkaW8lMjBuZXV0cmFsJTIwdG9uZXN8ZW58MXx8fHwxNzc0MTE0Nzg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    collection: "ss25",
    title: "Studio Calm",
    subtitle: "SS25 · Clean Lines",
    span: "wide",
  },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  photo: LookPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ photo, onClose, onPrev, onNext }: LightboxProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  onNext();
      if (e.key === "ArrowLeft")   onPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="lb-backdrop" onClick={onClose}>
      <div className="lb-box" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="lb-close" onClick={onClose}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Prev */}
        <button className="lb-arrow lb-arrow--prev" onClick={onPrev}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polyline points="15,18 9,12 15,6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Image */}
        <ImageWithFallback src={photo.src} alt={photo.title} className="lb-img" />

        {/* Caption */}
        <div className="lb-caption">
          <p className="lb-caption__title">{photo.title}</p>
          <p className="lb-caption__sub">{photo.subtitle}</p>
        </div>

        {/* Next */}
        <button className="lb-arrow lb-arrow--next" onClick={onNext}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polyline points="9,6 15,12 9,18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LookbookPage() {
  const [activeCol,   setActiveCol]   = useState<CollectionKey>("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = PHOTOS.filter(p => activeCol === "all" || p.collection === activeCol);

  function openLightbox(idx: number) { setLightboxIdx(idx); }
  function closeLightbox()           { setLightboxIdx(null); }
  function prevPhoto() { setLightboxIdx(i => i === null ? null : (i - 1 + filtered.length) % filtered.length); }
  function nextPhoto() { setLightboxIdx(i => i === null ? null : (i + 1) % filtered.length); }

  return (
    <div className="page">
      <Header subNavItems={lookbookSubNav} />

      {/* ── Hero ── */}
      <section className="lb-page-hero">
        <div className="lb-page-hero__content">
          <p className="lb-page-hero__season">EVERLANE LOOKBOOK</p>
          <h1 className="lb-page-hero__title">Dressed for<br />Real Life</h1>
          <p className="lb-page-hero__sub">
            Editorial portraits of the clothes we love —<br />
            made to be worn, not just admired.
          </p>
        </div>
      </section>

      {/* ── Collection filter ── */}
      <div className="lb-filter-bar">
        {COLLECTIONS.map(col => (
          <button
            key={col.key}
            className={`lb-filter-btn${activeCol === col.key ? " lb-filter-btn--active" : ""}`}
            onClick={() => setActiveCol(col.key)}
          >
            {col.label}
          </button>
        ))}
        <span className="lb-filter-count">
          {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Masonry grid ── */}
      <div className="lb-grid">
        {filtered.map((photo, idx) => (
          <div
            key={photo.id}
            className={`lb-cell lb-cell--${photo.span}`}
            onClick={() => openLightbox(idx)}
          >
            <ImageWithFallback
              src={photo.src}
              alt={photo.title}
              className="lb-cell__img"
            />
            <div className="lb-cell__overlay">
              <div className="lb-cell__info">
                <p className="lb-cell__collection">
                  {COLLECTIONS.find(c => c.key === photo.collection)?.label}
                </p>
                <p className="lb-cell__title">{photo.title}</p>
                <p className="lb-cell__sub">{photo.subtitle}</p>
              </div>
              <div className="lb-cell__zoom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="1.5"/>
                  <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="11" y1="8" x2="11" y2="14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="8" y1="11" x2="14" y2="11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Credits ── */}
      <div className="lb-credits">
        <p className="lb-credits__text">
          Photography by Everlane Creative Studio · All rights reserved
        </p>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && filtered[lightboxIdx] && (
        <Lightbox
          photo={filtered[lightboxIdx]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}

      <Footer />
    </div>
  );
}
