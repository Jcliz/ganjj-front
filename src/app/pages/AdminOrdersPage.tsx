import React, { useEffect, useMemo, useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { ORDER_STEPS } from "../data/orders";
import { pedidoApi, type AdminPedido } from "../../lib/api";


function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function MiniTimeline({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {ORDER_STEPS.map((label, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        const reached = completed || active;
        return (
          <React.Fragment key={label}>
            <div
              title={label}
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: reached ? "#262626" : "#fff",
                border: `2px solid ${reached ? "#262626" : "#dddbdc"}`,
                flexShrink: 0,
                boxShadow: active ? "0 0 0 3px rgba(38,38,38,0.15)" : "none",
              }}
            />
            {i < ORDER_STEPS.length - 1 && (
              <div style={{ width: 28, height: 2, background: i < currentStep ? "#262626" : "#dddbdc" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function OrderRow({
  pedido,
  expanded,
  onToggle,
  onStepChange,
}: {
  pedido: AdminPedido;
  expanded: boolean;
  onToggle: () => void;
  onStepChange: (id: number, passo: number, status: string) => void;
}) {
  const [updating, setUpdating] = useState(false);
  const stepLabel = ORDER_STEPS[pedido.passo_atual];
  const isDone = pedido.passo_atual >= ORDER_STEPS.length - 1;

  async function changeStep(newPasso: number) {
    setUpdating(true);
    try {
      const res = await pedidoApi.atualizarPasso(pedido.id, newPasso);
      onStepChange(pedido.id, res.passo_atual, res.status);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <tr
        onClick={onToggle}
        style={{ borderBottom: "1px solid #f0eeec", cursor: "pointer", background: expanded ? "#fafaf9" : "#fff" }}
      >
        <td style={{ padding: "18px 20px", fontSize: 14, color: "#262626" }}>{pedido.codigo}</td>
        <td style={{ padding: "18px 20px", fontSize: 14, color: "#262626" }}>
          <div>{pedido.cliente_nome ?? "—"}</div>
          <div style={{ fontSize: 12, color: "#9a9898", marginTop: 2 }}>{pedido.cliente_email ?? "—"}</div>
        </td>
        <td style={{ padding: "18px 20px", fontSize: 13, color: "#737373" }}>{formatDate(pedido.criado_em)}</td>
        <td style={{ padding: "18px 20px", fontSize: 14, color: "#262626" }}>{formatMoney(pedido.total)}</td>
        <td style={{ padding: "18px 20px" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 999,
              background: isDone ? "#e8f3ec" : "#fdf3e7",
              color: isDone ? "#2f7d4f" : "#b06a1c",
              fontSize: 12,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            {stepLabel}
          </span>
        </td>
        <td style={{ padding: "18px 20px", textAlign: "right" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
            <polyline points="6,9 12,15 18,9" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </td>
      </tr>

      {expanded && (
        <tr style={{ background: "#fafaf9", borderBottom: "1px solid #f0eeec" }}>
          <td colSpan={6} style={{ padding: "24px 28px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
              <div style={{ minWidth: 280 }}>
                <div style={{ fontSize: 12, color: "#9a9898", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8 }}>
                  Entrega
                </div>
                <div style={{ fontSize: 14, color: "#262626" }}>{pedido.endereco_entrega ?? "—"}</div>
                {pedido.numero_rastreio && (
                  <div style={{ fontSize: 13, color: "#737373", marginTop: 6 }}>
                    Rastreio: <span style={{ color: "#262626" }}>{pedido.numero_rastreio}</span>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 320 }}>
                <div style={{ fontSize: 12, color: "#9a9898", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>
                  Itens
                </div>
                {pedido.itens.map((it, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", color: "#262626" }}>
                    <span>
                      {it.nome}
                      <span style={{ color: "#9a9898" }}>
                        {it.tamanho ? ` · ${it.tamanho}` : ""} · Qtd {it.quantidade}
                      </span>
                    </span>
                    <span>{formatMoney(it.preco * it.quantidade)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #e6e4e4" }}>
              <div style={{ fontSize: 12, color: "#9a9898", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 16 }}>
                Progresso da entrega
              </div>
              <MiniTimeline currentStep={pedido.passo_atual} />
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); changeStep(pedido.passo_atual - 1); }}
                  disabled={pedido.passo_atual === 0 || updating}
                  style={{
                    padding: "10px 16px",
                    background: "#fff",
                    border: "1px solid #262626",
                    color: pedido.passo_atual === 0 || updating ? "#bdbdbd" : "#262626",
                    cursor: pedido.passo_atual === 0 || updating ? "not-allowed" : "pointer",
                    fontSize: 13,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  ← Etapa anterior
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); changeStep(pedido.passo_atual + 1); }}
                  disabled={pedido.passo_atual >= ORDER_STEPS.length - 1 || updating}
                  style={{
                    padding: "10px 16px",
                    background: pedido.passo_atual >= ORDER_STEPS.length - 1 || updating ? "#dddbdc" : "#262626",
                    color: "#fff",
                    border: "none",
                    cursor: pedido.passo_atual >= ORDER_STEPS.length - 1 || updating ? "not-allowed" : "pointer",
                    fontSize: 13,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                  }}
                >
                  Avançar etapa →
                </button>
                <select
                  value={pedido.passo_atual}
                  disabled={updating}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => changeStep(parseInt(e.target.value, 10))}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #dddbdc",
                    background: "#fff",
                    fontSize: 13,
                    color: "#262626",
                    cursor: updating ? "not-allowed" : "pointer",
                  }}
                >
                  {ORDER_STEPS.map((label, i) => (
                    <option key={label} value={i}>{i + 1}. {label}</option>
                  ))}
                </select>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function AdminOrdersPage() {
  const [pedidos, setPedidos] = useState<AdminPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    pedidoApi.adminTodos()
      .then(setPedidos)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleStepChange(id: number, passo: number, novoStatus: string) {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, passo_atual: passo, status: novoStatus } : p))
    );
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pedidos;
    return pedidos.filter(
      (p) =>
        p.codigo.toLowerCase().includes(q) ||
        (p.cliente_nome ?? "").toLowerCase().includes(q) ||
        (p.cliente_email ?? "").toLowerCase().includes(q),
    );
  }, [pedidos, query]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f4f2" }}>
      <AdminSidebar activeItem="orders" />
      <main style={{ flex: 1, padding: "48px 56px" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ margin: 0, fontSize: 28, color: "#262626" }}>Pedidos</h1>
          <div style={{ fontSize: 14, color: "#737373", marginTop: 6 }}>
            Gerencie todos os pedidos e avance a etapa de entrega de cada cliente.
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e6e4e4" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0eeec", display: "flex", gap: 16, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar por código, nome ou email do cliente"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                border: "1px solid #dddbdc",
                fontSize: 14,
                color: "#262626",
                background: "#fafaf9",
                outline: "none",
              }}
            />
            <div style={{ fontSize: 13, color: "#737373" }}>
              {filtered.length} pedido{filtered.length === 1 ? "" : "s"}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: 48, textAlign: "center", color: "#9a9898", fontSize: 14 }}>
              Carregando pedidos...
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafaf9", borderBottom: "1px solid #e6e4e4" }}>
                  {["Pedido", "Cliente", "Realizado em", "Total", "Etapa atual", ""].map((h, i) => (
                    <th
                      key={i}
                      style={{
                        textAlign: i === 5 ? "right" : "left",
                        padding: "14px 20px",
                        fontSize: 12,
                        letterSpacing: 0.6,
                        textTransform: "uppercase",
                        color: "#737373",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <OrderRow
                    key={p.id}
                    pedido={p}
                    expanded={expandedId === p.id}
                    onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    onStepChange={handleStepChange}
                  />
                ))}
              </tbody>
            </table>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: "center", color: "#9a9898", fontSize: 14 }}>
              Nenhum pedido encontrado.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
