import React from "react";
import { useNavigate } from "react-router";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminNavItem =
  | "dashboard"
  | "users"
  | "products"
  | "orders";

interface AdminSidebarProps {
  activeItem?: AdminNavItem;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="11,6 5,12 11,18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M21 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="4"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6"  y1="20" x2="6"  y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: {
  key: AdminNavItem;
  label: string;
  path: string;
  icon: React.ReactNode;
}[] = [
  { key: "dashboard", label: "Dashboard", path: "/admin/dashboard", icon: <AnalyticsIcon /> },
  { key: "users",     label: "Usuários",  path: "/admin/users",     icon: <UsersIcon />     },
  { key: "products",  label: "Produtos",  path: "/admin/products",  icon: <ProductsIcon />  },
  { key: "orders",    label: "Pedidos",   path: "/admin/orders",    icon: <OrdersIcon />    },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar({ activeItem }: AdminSidebarProps) {
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      {/* Logo / brand */}
      <div className="admin-sidebar__logo" onClick={() => navigate("/")}>
        <span className="admin-sidebar__logo-text">GANJJ</span>
        <span className="admin-sidebar__logo-badge">PAINEL ADMIN</span>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map(item => (
          <div
            key={item.key}
            className={`admin-sidebar__item${item.key === activeItem ? " admin-sidebar__item--active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="admin-sidebar__item-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar__footer">
        <button className="admin-sidebar__back" onClick={() => navigate("/")}>
          <ArrowLeftIcon />
          Voltar à Loja
        </button>
      </div>
    </aside>
  );
}