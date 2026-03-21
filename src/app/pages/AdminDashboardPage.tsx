import React, { useState } from "react";
import { useNavigate } from "react-router";
import { AdminSidebar } from "../components/AdminSidebar";

// ─── Icons ────────────────────────────────────────────────────────────────────

function TrendUpIcon({ color = "#2a7a3b" }: { color?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17,6 23,6 23,12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17,18 23,18 23,12" stroke="#d0021b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon2() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShoppingBagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <polyline points="23,4 23,10 17,10" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="1,20 1,14 7,14" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const REVENUE_DATA = [42, 58, 51, 74, 91, 88, 62, 78, 95, 82, 107, 124];
const ORDERS_DATA  = [310, 420, 380, 510, 680, 630, 440, 560, 720, 590, 810, 940];

const RECENT_ORDERS = [
  { id: "#EV-48291", customer: "Sophie Nguyen",   product: "The Merino Turtleneck",       amount: 120, status: "Delivered", date: "Jun 19" },
  { id: "#EV-48287", customer: "Marcus Rivera",   product: "The Straight Leg Jean",       amount: 196, status: "Shipped",   date: "Jun 19" },
  { id: "#EV-48283", customer: "Priya Patel",     product: "The Oxford Shirt",            amount: 78,  status: "Processing",date: "Jun 18" },
  { id: "#EV-48279", customer: "Ethan Brooks",    product: "The ReNew Fleece Jacket",     amount: 135, status: "Delivered", date: "Jun 18" },
  { id: "#EV-48274", customer: "Nadia Okonkwo",   product: "The Italian Leather Belt",    amount: 55,  status: "Cancelled", date: "Jun 17" },
  { id: "#EV-48270", customer: "Jordan Kim",      product: "The Canvas Tote",             amount: 35,  status: "Delivered", date: "Jun 17" },
];

const LOW_STOCK = [
  { name: "The ReNew Fleece Jacket",   sku: "EVR-M-JKT-006", stock: 4,  category: "Men"   },
  { name: "The Reversible Sherpa",     sku: "EVR-M-JKT-011", stock: 12, category: "Men"   },
  { name: "The Linen Shirt Dress",     sku: "EVR-W-DRS-010", stock: 27, category: "Women" },
  { name: "The Italian Leather Belt",  sku: "EVR-A-BLT-004", stock: 33, category: "Acc."  },
];

const TOP_PRODUCTS = [
  { name: "The Merino Turtleneck",         revenue: 31200, orders: 260, pct: 100 },
  { name: "The Straight Leg Jean",         revenue: 24696, orders: 252, pct: 79  },
  { name: "The Reversible Sherpa Jacket",  revenue: 20196, orders: 102, pct: 65  },
  { name: "The Oxford Shirt",              revenue: 19110, orders: 245, pct: 61  },
  { name: "The Organic Cotton Box-Cut Tee",revenue: 14035, orders: 401, pct: 45  },
];

const ORDER_STATUS_DIST = [
  { label: "Delivered",  value: 68, color: "#2a7a3b" },
  { label: "Shipped",    value: 18, color: "#4a7ab5" },
  { label: "Processing", value: 10, color: "#f5a623" },
  { label: "Cancelled",  value: 4,  color: "#d0021b" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, trend, icon, color
}: {
  label: string; value: string; sub: string;
  trend: "up" | "down" | "neutral"; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="dash-kpi">
      <div className="dash-kpi__icon" style={{ color }}>{icon}</div>
      <div className="dash-kpi__body">
        <p className="dash-kpi__label">{label}</p>
        <p className="dash-kpi__value">{value}</p>
        <div className="dash-kpi__trend">
          {trend === "up"   && <TrendUpIcon />}
          {trend === "down" && <TrendDownIcon />}
          <span style={{ color: trend === "up" ? "#2a7a3b" : trend === "down" ? "#d0021b" : "#737373" }}>
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";
function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg: Record<OrderStatus, { dot: string; color: string }> = {
    Delivered:  { dot: "#2a7a3b", color: "#2a7a3b" },
    Shipped:    { dot: "#4a7ab5", color: "#4a7ab5" },
    Processing: { dot: "#f5a623", color: "#b07a0a" },
    Cancelled:  { dot: "#d0021b", color: "#d0021b" },
  };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: cfg[status].color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg[status].dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

// Mini bar chart – pure CSS
function BarChart({ data, months }: { data: number[]; months: string[] }) {
  const max = Math.max(...data);
  return (
    <div className="dash-chart">
      {data.map((v, i) => (
        <div key={months[i]} className="dash-chart__col">
          <div className="dash-chart__bar-wrap">
            <div
              className="dash-chart__bar"
              style={{ height: `${(v / max) * 100}%` }}
              title={`${months[i]}: $${v}k`}
            />
          </div>
          <span className="dash-chart__label">{months[i]}</span>
        </div>
      ))}
    </div>
  );
}

// Donut-style ring using SVG
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const r = 48;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  return (
    <div className="dash-donut">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {segments.map(seg => {
          const dashLength = (seg.value / total) * circumference;
          const dash = `${dashLength} ${circumference - dashLength}`;
          const el = (
            <circle
              key={seg.label}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="20"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += dashLength;
          return el;
        })}
        <text x="60" y="56" textAnchor="middle" fontSize="14" fill="#262626">68%</text>
        <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#737373">Delivered</text>
      </svg>
      <div className="dash-donut__legend">
        {segments.map(seg => (
          <div key={seg.label} className="dash-donut__item">
            <span className="dash-donut__dot" style={{ background: seg.color }} />
            <span className="dash-donut__item-label">{seg.label}</span>
            <span className="dash-donut__item-val">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [chartTab, setChartTab] = useState<"revenue" | "orders">("revenue");
  const [period, setPeriod]     = useState<"12m" | "6m" | "3m">("12m");

  const slicedMonths  = period === "12m" ? MONTHS : period === "6m" ? MONTHS.slice(6) : MONTHS.slice(9);
  const slicedRevenue = period === "12m" ? REVENUE_DATA : period === "6m" ? REVENUE_DATA.slice(6) : REVENUE_DATA.slice(9);
  const slicedOrders  = period === "12m" ? ORDERS_DATA  : period === "6m" ? ORDERS_DATA.slice(6)  : ORDERS_DATA.slice(9);

  return (
    <div className="admin-page">
      <AdminSidebar activeItem="dashboard" />

      <main className="admin-main">
        {/* Top bar */}
        <div className="admin-topbar">
          <div>
            <p className="admin-topbar__title">Dashboard</p>
            <p className="admin-topbar__sub">Overview for the last 12 months · Updated just now</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="admin-btn admin-btn--ghost" style={{ gap: 6, fontSize: 11 }}>
              <RefreshIcon /> Refresh
            </button>
            <button className="admin-btn admin-btn--dark" onClick={() => navigate("/admin/products")}>
              + Add Product
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="dash-kpis">
          <KpiCard
            label="Total Revenue"
            value="$852,410"
            sub="+18.4% vs last year"
            trend="up"
            icon={<DollarIcon />}
            color="#2a7a3b"
          />
          <KpiCard
            label="Total Orders"
            value="6,993"
            sub="+12.1% vs last year"
            trend="up"
            icon={<ShoppingBagIcon />}
            color="#4a7ab5"
          />
          <KpiCard
            label="Active Users"
            value="10"
            sub="+3 this month"
            trend="up"
            icon={<UsersIcon2 />}
            color="#8a6ab5"
          />
          <KpiCard
            label="Products"
            value="12"
            sub="4 out of stock"
            trend="neutral"
            icon={<PackageIcon />}
            color="#b07a0a"
          />
          <KpiCard
            label="Avg. Order Value"
            value="$121.90"
            sub="+5.3% vs last year"
            trend="up"
            icon={<DollarIcon />}
            color="#2a7a3b"
          />
          <KpiCard
            label="Return Rate"
            value="4.2%"
            sub="-0.8% vs last year"
            trend="up"
            icon={<RefreshIcon />}
            color="#4a7ab5"
          />
        </div>

        {/* Charts row */}
        <div className="dash-charts-row">

          {/* Revenue / Orders bar chart */}
          <div className="dash-panel dash-panel--wide">
            <div className="dash-panel__head">
              <div>
                <p className="dash-panel__title">
                  {chartTab === "revenue" ? "Revenue" : "Orders"}
                </p>
                <p className="dash-panel__sub">
                  {chartTab === "revenue" ? "Monthly revenue in $k" : "Monthly order count"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {(["revenue", "orders"] as const).map(t => (
                  <button
                    key={t}
                    className={`dash-tab-btn${chartTab === t ? " dash-tab-btn--active" : ""}`}
                    onClick={() => setChartTab(t)}
                  >
                    {t === "revenue" ? "Revenue" : "Orders"}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {(["12m", "6m", "3m"] as const).map(p => (
                  <button
                    key={p}
                    className={`dash-tab-btn${period === p ? " dash-tab-btn--active" : ""}`}
                    onClick={() => setPeriod(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <BarChart
              data={chartTab === "revenue" ? slicedRevenue : slicedOrders}
              months={slicedMonths}
            />
          </div>

          {/* Order status donut */}
          <div className="dash-panel">
            <div className="dash-panel__head">
              <div>
                <p className="dash-panel__title">Order Status</p>
                <p className="dash-panel__sub">Distribution — all time</p>
              </div>
            </div>
            <DonutChart segments={ORDER_STATUS_DIST} />
          </div>

        </div>

        {/* Bottom row */}
        <div className="dash-bottom-row">

          {/* Recent Orders */}
          <div className="dash-panel dash-panel--wide">
            <div className="dash-panel__head">
              <div>
                <p className="dash-panel__title">Recent Orders</p>
                <p className="dash-panel__sub">Last 6 transactions</p>
              </div>
              <button className="dash-tab-btn" onClick={() => {}}>View All</button>
            </div>
            <table className="admin-table" style={{ marginTop: 0 }}>
              <thead>
                <tr>
                  <th className="admin-table__th">Order</th>
                  <th className="admin-table__th">Customer</th>
                  <th className="admin-table__th">Product</th>
                  <th className="admin-table__th" style={{ textAlign: "right" }}>Amount</th>
                  <th className="admin-table__th">Status</th>
                  <th className="admin-table__th">Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map(order => (
                  <tr key={order.id} className="admin-table__row">
                    <td className="admin-table__td" style={{ fontSize: 11, letterSpacing: "0.4px", color: "#737373" }}>{order.id}</td>
                    <td className="admin-table__td">{order.customer}</td>
                    <td className="admin-table__td admin-table__td--muted" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.product}</td>
                    <td className="admin-table__td" style={{ textAlign: "right" }}>${order.amount}</td>
                    <td className="admin-table__td"><OrderStatusBadge status={order.status as OrderStatus} /></td>
                    <td className="admin-table__td admin-table__td--muted">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column: Low stock + Top products */}
          <div className="dash-col-right">

            {/* Low stock alerts */}
            <div className="dash-panel">
              <div className="dash-panel__head">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertIcon />
                  <p className="dash-panel__title">Low Stock Alerts</p>
                </div>
                <button className="dash-tab-btn" onClick={() => navigate("/admin/products")}>Manage</button>
              </div>
              <div className="dash-alerts">
                {LOW_STOCK.map(item => (
                  <div key={item.sku} className="dash-alert">
                    <div>
                      <p className="dash-alert__name">{item.name}</p>
                      <p className="dash-alert__sku">{item.sku} · {item.category}</p>
                    </div>
                    <span
                      className="dash-alert__stock"
                      style={{ color: item.stock < 10 ? "#d0021b" : "#f5a623" }}
                    >
                      {item.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top products */}
            <div className="dash-panel">
              <div className="dash-panel__head">
                <p className="dash-panel__title">Top Products</p>
              </div>
              <div className="dash-top-products">
                {TOP_PRODUCTS.map(p => (
                  <div key={p.name} className="dash-top-product">
                    <div style={{ flex: 1 }}>
                      <p className="dash-top-product__name">{p.name}</p>
                      <div className="dash-top-product__bar-track">
                        <div className="dash-top-product__bar" style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                    <div className="dash-top-product__stats">
                      <span>${(p.revenue / 1000).toFixed(1)}k</span>
                      <span style={{ color: "#b0aeae" }}>·</span>
                      <span style={{ color: "#737373" }}>{p.orders} orders</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
