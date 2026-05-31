import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { AdminSidebar } from "../components/AdminSidebar";

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

interface Kpis {
  receita_total: number;
  total_pedidos: number;
  usuarios_ativos: number;
  total_produtos: number;
  sem_estoque: number;
  ticket_medio: number;
}

interface GraficoMes {
  mes: string;
  receita: number;
  pedidos: number;
}

interface StatusDist {
  label: string;
  value: number;
  color: string;
}

interface PedidoRecente {
  id: string;
  cliente: string;
  itens: number;
  total: number;
  status: string;
  data: string;
}

interface EstoqueBaixo {
  nome: string;
  estoque: number;
  categoria: string;
}

interface TopProduto {
  nome: string;
  receita: number;
  pedidos: number;
  pct: number;
}

interface DashboardData {
  kpis: Kpis;
  grafico_mensal: GraficoMes[];
  status_pedidos: StatusDist[];
  pedidos_recentes: PedidoRecente[];
  estoque_baixo: EstoqueBaixo[];
  top_produtos: TopProduto[];
}

function fmtBRL(value: number) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

type OrderStatus = "Entregue" | "Enviado" | "Em processamento" | "Cancelado";
const STATUS_CFG: Record<string, { dot: string; color: string }> = {
  "Entregue":         { dot: "#2a7a3b", color: "#2a7a3b" },
  "Enviado":          { dot: "#4a7ab5", color: "#4a7ab5" },
  "Em processamento": { dot: "#f5a623", color: "#b07a0a" },
  "Cancelado":        { dot: "#d0021b", color: "#d0021b" },
};

function OrderStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? { dot: "#737373", color: "#737373" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: cfg.color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function BarChart({ data, months }: { data: number[]; months: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="dash-chart">
      {data.map((v, i) => (
        <div key={months[i]} className="dash-chart__col">
          <div className="dash-chart__bar-wrap">
            <div
              className="dash-chart__bar"
              style={{ height: `${(v / max) * 100}%` }}
              title={`${months[i]}: R$ ${v.toLocaleString('pt-BR')}`}
            />
          </div>
          <span className="dash-chart__label">{months[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments }: { segments: StatusDist[] }) {
  const r = 48;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  const topSegment = segments.length > 0 ? segments[0] : null;

  return (
    <div className="dash-donut">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {segments.map(seg => {
          const dashLength = (seg.value / (total || 1)) * circumference;
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
        {topSegment && (
          <>
            <text x="60" y="56" textAnchor="middle" fontSize="14" fill="#262626">{topSegment.value}%</text>
            <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#737373">{topSegment.label}</text>
          </>
        )}
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

const API_URL = 'http://localhost:3000';

export function AdminDashboardPage() {
  usePageTitle("Dashboard");
  const navigate = useNavigate();
  const [chartTab, setChartTab] = useState<"revenue" | "orders">("revenue");
  const [period, setPeriod]     = useState<"12m" | "6m" | "3m">("12m");
  const [data, setData]         = useState<DashboardData | null>(null);
  const [loading, setLoading]   = useState(true);

  const fetchDashboard = () => {
    setLoading(true);
    fetch(`${API_URL}/api/dashboard`)
      .then(r => r.json())
      .then((d: DashboardData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchDashboard(); }, []);

  const grafico = data?.grafico_mensal ?? [];
  const sliceStart = period === "12m" ? 0 : period === "6m" ? 6 : 9;
  const slicedGrafico = grafico.slice(sliceStart);
  const slicedMonths  = slicedGrafico.map(g => g.mes);
  const slicedRevenue = slicedGrafico.map(g => g.receita);
  const slicedOrders  = slicedGrafico.map(g => g.pedidos);

  const kpis            = data?.kpis;
  const statusPedidos   = data?.status_pedidos   ?? [];
  const pedidosRecentes = data?.pedidos_recentes ?? [];
  const estoqueBaixo    = data?.estoque_baixo    ?? [];
  const topProdutos     = data?.top_produtos     ?? [];

  return (
    <div className="admin-page">
      <AdminSidebar activeItem="dashboard" />

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="admin-topbar__title">Dashboard</p>
            <p className="admin-topbar__sub">Visão geral dos últimos 12 meses · Atualizado agora</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="admin-btn admin-btn--ghost" style={{ gap: 6, fontSize: 11 }} onClick={fetchDashboard}>
              <RefreshIcon /> Atualizar
            </button>
            <button className="admin-btn admin-btn--dark" onClick={() => navigate("/admin/products")}>
              + Adicionar Produto
            </button>
          </div>
        </div>

        {loading && (
          <p style={{ color: "#737373", fontSize: 13, padding: "40px 0", textAlign: "center" }}>
            Carregando dados...
          </p>
        )}

        {!loading && (
          <>
            <div className="dash-kpis">
              <KpiCard
                label="Receita Total"
                value={`R$ ${fmtBRL(kpis?.receita_total ?? 0)}`}
                sub="acumulado"
                trend="neutral"
                icon={<DollarIcon />}
                color="#2a7a3b"
              />
              <KpiCard
                label="Total de Pedidos"
                value={(kpis?.total_pedidos ?? 0).toLocaleString('pt-BR')}
                sub="acumulado"
                trend="neutral"
                icon={<ShoppingBagIcon />}
                color="#4a7ab5"
              />
              <KpiCard
                label="Usuários Ativos"
                value={(kpis?.usuarios_ativos ?? 0).toLocaleString('pt-BR')}
                sub="cadastrados"
                trend="neutral"
                icon={<UsersIcon2 />}
                color="#8a6ab5"
              />
              <KpiCard
                label="Produtos"
                value={(kpis?.total_produtos ?? 0).toLocaleString('pt-BR')}
                sub={`${kpis?.sem_estoque ?? 0} sem estoque`}
                trend={(kpis?.sem_estoque ?? 0) > 0 ? "down" : "neutral"}
                icon={<PackageIcon />}
                color="#b07a0a"
              />
              <KpiCard
                label="Ticket Médio"
                value={`R$ ${fmtBRL(kpis?.ticket_medio ?? 0)}`}
                sub="por pedido"
                trend="neutral"
                icon={<DollarIcon />}
                color="#2a7a3b"
              />
            </div>

            <div className="dash-charts-row">
              <div className="dash-panel dash-panel--wide">
                <div className="dash-panel__head">
                  <div>
                    <p className="dash-panel__title">
                      {chartTab === "revenue" ? "Receita" : "Pedidos"}
                    </p>
                    <p className="dash-panel__sub">
                      {chartTab === "revenue" ? "Receita mensal em R$" : "Total de pedidos mensais"}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["revenue", "orders"] as const).map(t => (
                      <button
                        key={t}
                        className={`dash-tab-btn${chartTab === t ? " dash-tab-btn--active" : ""}`}
                        onClick={() => setChartTab(t)}
                      >
                        {t === "revenue" ? "Receita" : "Pedidos"}
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

              <div className="dash-panel">
                <div className="dash-panel__head">
                  <div>
                    <p className="dash-panel__title">Status dos Pedidos</p>
                    <p className="dash-panel__sub">Distribuição — todo o período</p>
                  </div>
                </div>
                <DonutChart segments={statusPedidos} />
              </div>
            </div>

            {/* Bottom row */}
            <div className="dash-bottom-row">

              {/* Pedidos Recentes */}
              <div className="dash-panel dash-panel--wide">
                <div className="dash-panel__head">
                  <div>
                    <p className="dash-panel__title">Pedidos Recentes</p>
                    <p className="dash-panel__sub">Últimas 6 transações</p>
                  </div>
                  <button className="dash-tab-btn" onClick={() => navigate("/admin/orders")}>Ver Todos</button>
                </div>
                <table className="admin-table" style={{ marginTop: 0 }}>
                  <thead>
                    <tr>
                      <th className="admin-table__th">Pedido</th>
                      <th className="admin-table__th">Cliente</th>
                      <th className="admin-table__th">Itens</th>
                      <th className="admin-table__th" style={{ textAlign: "right" }}>Total</th>
                      <th className="admin-table__th">Status</th>
                      <th className="admin-table__th">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosRecentes.map(order => (
                      <tr key={order.id} className="admin-table__row">
                        <td className="admin-table__td" style={{ fontSize: 11, letterSpacing: "0.4px", color: "#737373" }}>{order.id}</td>
                        <td className="admin-table__td">{order.cliente}</td>
                        <td className="admin-table__td admin-table__td--muted">{order.itens} {order.itens === 1 ? "item" : "itens"}</td>
                        <td className="admin-table__td" style={{ textAlign: "right" }}>R$ {fmtBRL(order.total)}</td>
                        <td className="admin-table__td"><OrderStatusBadge status={order.status as OrderStatus} /></td>
                        <td className="admin-table__td admin-table__td--muted">{order.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="dash-col-right">

                {/* Alertas de Estoque Baixo */}
                <div className="dash-panel">
                  <div className="dash-panel__head">
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <AlertIcon />
                      <p className="dash-panel__title">Alertas de Estoque Baixo</p>
                    </div>
                    <button className="dash-tab-btn" onClick={() => navigate("/admin/products")}>Gerenciar</button>
                  </div>
                  <div className="dash-alerts">
                    {estoqueBaixo.length === 0 && (
                      <p style={{ fontSize: 12, color: "#737373", padding: "8px 0" }}>Nenhum produto com estoque baixo.</p>
                    )}
                    {estoqueBaixo.map(item => (
                      <div key={item.nome} className="dash-alert">
                        <div>
                          <p className="dash-alert__name">{item.nome}</p>
                          <p className="dash-alert__sku">{item.categoria}</p>
                        </div>
                        <span
                          className="dash-alert__stock"
                          style={{ color: item.estoque < 10 ? "#d0021b" : "#f5a623" }}
                        >
                          {item.estoque} restantes
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Produtos */}
                <div className="dash-panel">
                  <div className="dash-panel__head">
                    <p className="dash-panel__title">Produtos Mais Vendidos</p>
                  </div>
                  <div className="dash-top-products">
                    {topProdutos.length === 0 && (
                      <p style={{ fontSize: 12, color: "#737373" }}>Nenhuma venda registrada.</p>
                    )}
                    {topProdutos.map(p => (
                      <div key={p.nome} className="dash-top-product">
                        <div style={{ flex: 1 }}>
                          <p className="dash-top-product__name">{p.nome}</p>
                          <div className="dash-top-product__bar-track">
                            <div className="dash-top-product__bar" style={{ width: `${p.pct}%` }} />
                          </div>
                        </div>
                        <div className="dash-top-product__stats">
                          <span>R$ {(p.receita / 1000).toFixed(1)}k</span>
                          <span style={{ color: "#b0aeae" }}>·</span>
                          <span style={{ color: "#737373" }}>{p.pedidos} pedidos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
