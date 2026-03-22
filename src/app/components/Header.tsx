import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Logo } from "./Logo";
import svgPaths from "../../assets/svg-61drw48kvb";
import { navDropImg1, navDropImg2 } from "../../assets/assets";
import { CartSidebar } from "./CartSidebar";

interface NavDropdownProps {
  onClose: () => void;
}

function USFlag() {
  return (
    <div className="us-flag">
      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 21 15">
        <g>
          <path clipRule="evenodd" d="M0 0H21V15H0V0Z" fill="url(#f0)" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p38a1a400} fill="url(#f1)" fillRule="evenodd" />
          <path clipRule="evenodd" d="M0 0H9V7H0V0Z" fill="url(#f2)" fillRule="evenodd" />
          <path clipRule="evenodd" d={svgPaths.p16aae200} fill="url(#f3)" fillRule="evenodd" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="f0" x1="1050" x2="1050" y1="0" y2="1500">
            <stop stopColor="white" /><stop offset="1" stopColor="#F0F0F0" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="f1" x1="1050" x2="1050" y1="0" y2="1500">
            <stop stopColor="#D02F44" /><stop offset="1" stopColor="#B12537" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="f2" x1="450" x2="450" y1="0" y2="700">
            <stop stopColor="#46467F" /><stop offset="1" stopColor="#3C3C6D" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="f3" x1="351" x2="351" y1="1" y2="501">
            <stop stopColor="white" /><stop offset="1" stopColor="#F0F0F0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <circle cx="12" cy="12" r="8" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
      <line x1="18.8" y1="18.8" x2="24" y2="24" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="11" r="5" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 27C6 22 10.5 18 16 18C21.5 18 26 22 26 27" stroke="#262626" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <path d="M3 4h3l2.5 13h13l2.5-9H8" stroke="#262626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="22" r="1.5" fill="#262626" />
      <circle cx="20" cy="22" r="1.5" fill="#262626" />
    </svg>
  );
}

function ArrowRightIcon({ color = "white" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="14,6 20,12 14,18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenDropdown({ onClose }: NavDropdownProps) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "#fff",
        borderTop: "1px solid #dddbdc",
        borderBottom: "1px solid #dddbdc",
        padding: "24px 60px",
        display: "flex",
        gap: "48px",
        zIndex: 200,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {/* Highlights */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 10, lineHeight: "16px", color: "#737373", letterSpacing: "0.6px", fontWeight: 600 }}>HIGHLIGHTS</p>
        {["Shop All New Arrivals", "The Gift Guide", "New Bottoms", "New Tops", "T-Shirt Bundles", "Under $100"].map(item => (
          <p key={item} onClick={() => { navigate("/listing"); onClose(); }} style={{ fontSize: 14, lineHeight: "16.8px", color: "#262626", letterSpacing: "1.4px", cursor: "pointer" }}>{item}</p>
        ))}
      </div>

      {/* Featured Shops */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 10, lineHeight: "16px", color: "#737373", letterSpacing: "0.6px", fontWeight: 600 }}>FEATURED SHOPS</p>
        {["The Holiday Outfit Edit", "Giftable Sweaters", "Uniform & Capsule", "The Performance Chino Shop", "Top Rated Men's Clothing"].map(item => (
          <p key={item} onClick={() => { navigate("/listing"); onClose(); }} style={{ fontSize: 14, lineHeight: "16.8px", color: "#262626", letterSpacing: "1.4px", cursor: "pointer" }}>{item}</p>
        ))}
      </div>

      {/* Image Cards */}
      <div style={{ flex: 2, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, height: 262, position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => { navigate("/listing"); onClose(); }}>
          <img src={navDropImg1} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", padding: "16px", width: "100%" }}>
              <div style={{ flex: 1, fontSize: 24, lineHeight: "33.24px", color: "#fff", fontWeight: 600 }}>
                <p>The Holiday</p>
                <p>Outfit Edit</p>
              </div>
              <ArrowRightIcon />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, height: 262, position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => { navigate("/listing"); onClose(); }}>
          <img src={navDropImg2} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", padding: "16px", width: "100%" }}>
              <div style={{ flex: 1, fontSize: 24, lineHeight: "33.24px", color: "#fff", fontWeight: 600 }}>
                <p>Giftable</p>
                <p>Sweaters</p>
              </div>
              <ArrowRightIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  activeTab?: "women" | "men" | "about" | "stories";
  subNavItems?: { label: string; path?: string; active?: boolean; sale?: boolean }[];
}

export function Header({ activeTab, subNavItems }: HeaderProps) {
  const navigate = useNavigate();
  useLocation();
  const [showMenDropdown, setShowMenDropdown] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const defaultSubNav = [
    { label: "Holiday Gifting", active: false },
    { label: "New Arrivals", active: false },
    { label: "Best-Sellers", active: false },
    { label: "Clothing", active: false },
    { label: "Tops & Sweaters", active: false },
    { label: "Pants & Jeans", active: false },
    { label: "Outerwear", active: false },
    { label: "Shoes & Bags", active: false },
    { label: "Lookbook", path: "/lookbook", active: false },
    { label: "Returns", path: "/returns", active: false },
    { label: "Contact", path: "/contact", active: false },
    { label: "Sale", sale: true, path: "/sale", active: false },
  ];

  const nav = subNavItems ?? defaultSubNav;

  return (
    <header className="header">
      <div className="announce-bar" style={{ width: "100%" }}>
        <div className="announce-bar__center">
          <span className="announce-bar__text">Get early access on launches and offers.</span>
          <span className="announce-bar__link">Sign Up For Texts</span>
          <ArrowRightIcon color="white" />
        </div>
        <div className="announce-bar__currency">
          <USFlag />
          <span className="announce-bar__usd">USD</span>
        </div>
      </div>

      <div className="main-nav" style={{ position: "relative" }}>
        <div className="main-nav__inner">
          {/* Left tabs */}
          <div className="main-nav__tabs">
            <div className="main-nav__tab" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Women</div>
            <div
              className={`main-nav__tab${activeTab === "men" ? " main-nav__tab--active" : ""}`}
              onClick={() => { navigate("/listing"); setShowMenDropdown(false); }}
              onMouseEnter={() => setShowMenDropdown(true)}
              onMouseLeave={() => setShowMenDropdown(false)}
              style={{ cursor: "pointer" }}
            >
              <span>Men</span>
              {activeTab === "men" && <div className="main-nav__tab-underline" />}
            </div>
            <div className="main-nav__tab" onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>About</div>
            <div className="main-nav__tab" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Everworld Stories</div>
            <div
              className="main-nav__tab main-nav__tab--admin"
              onClick={() => navigate("/admin/users")}
              style={{ cursor: "pointer" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Admin
              </span>
            </div>
          </div>

          {/* Logo (centered) */}
          <Logo onClick={() => navigate("/")} />

          {/* Right icons */}
          <div className="main-nav__icons">
            <button className="main-nav__icon-btn" onClick={() => navigate("/search")} aria-label="Search">
              <SearchIcon />
            </button>
            <button className="main-nav__icon-btn" aria-label="Account" onClick={() => navigate("/login")}>
              <UserIcon />
            </button>
            <button className="main-nav__icon-btn" aria-label="Cart" onClick={() => setShowCart(true)}>
              <CartIcon />
            </button>
          </div>
        </div>

        {/* Men Dropdown */}
        {showMenDropdown && (
          <div onMouseEnter={() => setShowMenDropdown(true)} onMouseLeave={() => setShowMenDropdown(false)}>
            <MenDropdown onClose={() => setShowMenDropdown(false)} />
          </div>
        )}
      </div>

      {/* Sub Nav */}
      <div className="sub-nav">
        {nav.map((item) => (
          <div
            key={item.label}
            className={`sub-nav__tab${item.sale ? " sub-nav__tab--sale" : ""}${item.active ? " sub-nav__tab--active" : ""}`}
            onClick={() => item.path && navigate(item.path)}
            style={{ cursor: item.path ? "pointer" : "default" }}
          >
            {item.label}
          </div>
        ))}
      </div>

      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
    </header>
  );
}