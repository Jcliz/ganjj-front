import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Logo } from "./Logo";
import { navDropImg1, navDropImg2 } from "../../assets/assets";
import { CartSidebar } from "./CartSidebar";
import { useAuth } from "../../contexts/AuthContext";

interface NavDropdownProps {
  onClose: () => void;
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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 10, lineHeight: "16px", color: "#737373", letterSpacing: "0.6px", fontWeight: 600 }}>OPÇÕES</p>
        {["Coleção nova", "Camisas", "Camisetas", "Casacos", "Calças", "Abaixo de R$100"].map(item => (
          <p key={item} onClick={() => { navigate("/listing"); onClose(); }} style={{ fontSize: 14, lineHeight: "16.8px", color: "#262626", letterSpacing: "1.4px", cursor: "pointer" }}>{item}</p>
        ))}
      </div>

      <div style={{ flex: 2, display: "flex", gap: 12 }}>
        <div style={{ flex: 1, height: 262, position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => { navigate("/listing"); onClose(); }}>
          <img src={navDropImg1} alt="" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", padding: "16px", width: "100%" }}>
              <div style={{ flex: 1, fontSize: 24, lineHeight: "33.24px", color: "#fff", fontWeight: 600 }}>
                <p>Peças</p>
                <p>Sociais</p>
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
                <p>Casacos</p>
                <p>Legais </p>
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
  activeTab?: "feminino" | "masculino" | "sobre";
  subNavItems?: { label: string; path?: string; active?: boolean; sale?: boolean }[];
}

export function Header({ activeTab, subNavItems }: HeaderProps) {
  const navigate = useNavigate();
  useLocation();
  const { usuario, logout } = useAuth();
  const [showMenDropdown, setShowMenDropdown] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const defaultSubNav = [
    { label: "Lookbook", path: "/lookbook", active: false },
    { label: "Trocas e devoluções", path: "/returns", active: false },
    { label: "Contato", path: "/contact", active: false },
    { label: "Sale ganjj", sale: true, path: "/sale", active: false },
  ];

  const nav = subNavItems ?? defaultSubNav;

  return (
    <header className="header">

      <div className="main-nav" style={{ position: "relative" }}>
        <div className="main-nav__inner">
          <div className="main-nav__tabs">
            <div
              className={`main-nav__tab${activeTab === "masculino" ? " main-nav__tab--active" : ""}`}
              onClick={() => { navigate("/listing"); setShowMenDropdown(false); }}
              onMouseEnter={() => setShowMenDropdown(true)}
              onMouseLeave={() => setShowMenDropdown(false)}
              style={{ cursor: "pointer" }}
            >
              <span>Feminino</span>
              {activeTab === "masculino" && <div className="main-nav__tab-underline" />}
            </div>
            <div
              className={`main-nav__tab${activeTab === "masculino" ? " main-nav__tab--active" : ""}`}
              onClick={() => { navigate("/listing"); setShowMenDropdown(false); }}
              onMouseEnter={() => setShowMenDropdown(true)}
              onMouseLeave={() => setShowMenDropdown(false)}
              style={{ cursor: "pointer" }}
            >
              <span>Masculino</span>
              {activeTab === "masculino" && <div className="main-nav__tab-underline" />}
            </div>
            <div className="main-nav__tab" onClick={() => navigate("/about")} style={{ cursor: "pointer" }}>Sobre-nós</div>
            {usuario?.is_admin && (
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
            )}
          </div>

          <Logo onClick={() => navigate("/")} />

          <div className="main-nav__icons">
            <button className="main-nav__icon-btn" onClick={() => navigate("/search")} aria-label="Search">
              <SearchIcon />
            </button>

            {/* Botão de conta — dropdown quando logado, navega para /login quando não logado */}
            <div style={{ position: "relative" }} ref={userMenuRef}>
              <button
                className="main-nav__icon-btn"
                aria-label="Account"
                onClick={() => usuario ? setShowUserMenu(v => !v) : navigate("/login")}
                style={usuario ? {
                  width: "auto",
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  paddingLeft: 12,
                  paddingRight: 12,
                  maxWidth: 200,
                } : undefined}
              >
                <UserIcon />
                {usuario && (
                  <span style={{
                    fontSize: 12,
                    color: "#262626",
                    letterSpacing: "0.5px",
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {usuario.nome?.split(" ")[0] ?? usuario.email}
                  </span>
                )}
              </button>

              {showUserMenu && usuario && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "#fff",
                  border: "1px solid #dddbdc",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  minWidth: 180,
                  zIndex: 300,
                  padding: "8px 0",
                }}>
                  <div style={{ padding: "10px 16px 8px", borderBottom: "1px solid #f0f0f0" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#262626", margin: 0 }}>{usuario.nome}</p>
                    <p style={{ fontSize: 11, color: "#737373", margin: "2px 0 0" }}>{usuario.email}</p>
                  </div>
                  {usuario.is_admin && (
                    <button
                      onClick={() => { navigate("/admin/dashboard"); setShowUserMenu(false); }}
                      style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: "#262626", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.5px" }}
                    >
                      Painel admin
                    </button>
                  )}
                  <button
                    onClick={() => { navigate("/settings"); setShowUserMenu(false); }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: "#262626", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.5px" }}
                  >
                    Minha conta
                  </button>
                  <button
                    onClick={async () => { await logout(); setShowUserMenu(false); navigate("/"); }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 16px", fontSize: 13, color: "#d0021b", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.5px" }}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>

            <button className="main-nav__icon-btn" aria-label="Cart" onClick={() => setShowCart(true)}>
              <CartIcon />
            </button>
          </div>
        </div>

        {showMenDropdown && (
          <div onMouseEnter={() => setShowMenDropdown(true)} onMouseLeave={() => setShowMenDropdown(false)}>
            <MenDropdown onClose={() => setShowMenDropdown(false)} />
          </div>
        )}
      </div>

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