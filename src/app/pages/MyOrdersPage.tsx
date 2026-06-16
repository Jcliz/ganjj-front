import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ORDER_STEPS } from "../data/orders";
import { pedidoApi, type Pedido } from "../../lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { month: "long", day: "numeric", year: "numeric" });
}

function formatMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getStatusInfo(passo: number) {
  if (passo <= 2) return { label: "Em processamento", bg: "#fdf3e7", color: "#b06a1c" };
  if (passo <= 4) return { label: "Frete",            bg: "#e8f0fb", color: "#2d5fa0" };
  return                { label: "Concluído",          bg: "#e8f3ec", color: "#2f7d4f" };
}

function StatusBadge({ step }: { step: number }) {
  const { label, bg, color } = getStatusInfo(step);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 12,
        letterSpacing: 0.4,
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function Timeline({ currentStep }: { currentStep: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginTop: 24 }}>
      {ORDER_STEPS.map((label, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        const reached = completed || active;
        return (
          <div
            key={label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              minWidth: 0,
            }}
          >
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 11,
                  right: "50%",
                  width: "100%",
                  height: 2,
                  background: i < currentStep ? "#262626" : "#dddbdc",
                  zIndex: 0,
                }}
              />
            )}
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: reached ? "#262626" : "#fff",
                border: `2px solid ${reached ? "#262626" : "#dddbdc"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
                boxShadow: active ? "0 0 0 4px rgba(38,38,38,0.12)" : "none",
              }}
            >
              {completed && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <polyline points="5,12 10,17 19,7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 12,
                textAlign: "center",
                color: reached ? "#262626" : "#9a9898",
                padding: "0 4px",
                lineHeight: 1.3,
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ pedido }: { pedido: Pedido }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e6e4e4", padding: "32px 36px", marginBottom: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: 24,
          borderBottom: "1px solid #f0eeec",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 18, color: "#262626" }}>Pedido {pedido.codigo}</span>
            <StatusBadge step={pedido.passo_atual} />
          </div>
          <div style={{ fontSize: 13, color: "#737373" }}>
            Realizado em {formatDate(pedido.criado_em)}
            {pedido.endereco_entrega && ` · Destino: ${pedido.endereco_entrega}`}
          </div>
          {pedido.numero_rastreio && (
            <div style={{ fontSize: 13, color: "#737373", marginTop: 4 }}>
              Rastreio: <span style={{ color: "#262626" }}>{pedido.numero_rastreio}</span>
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, color: "#9a9898", textTransform: "uppercase", letterSpacing: 0.6 }}>Subtotal</div>
          <div style={{ fontSize: 20, color: "#262626", marginTop: 4 }}>{formatMoney(pedido.total)}</div>
        </div>
      </div>

      <Timeline currentStep={pedido.passo_atual} />

      <div style={{ marginTop: 32, borderTop: "1px solid #f0eeec", paddingTop: 24 }}>
        {pedido.itens.map((item, i) => (
          <div
            key={i}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#262626" }}>{item.nome}</div>
              <div style={{ fontSize: 13, color: "#9a9898", marginTop: 2 }}>
                {item.tamanho && `${item.tamanho} · `}Qtd {item.quantidade}
              </div>
            </div>
            <div style={{ fontSize: 14, color: "#262626" }}>{formatMoney(item.preco * item.quantidade)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MyOrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pedidoApi.meus()
      .then(setPedidos)
      .catch((err) => setError(err.message ?? "Erro ao carregar pedidos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", display: "flex", flexDirection: "column" }}>
      <Header />
      <main style={{ flex: 1, maxWidth: 980, width: "100%", margin: "0 auto", padding: "72px 32px 96px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: "#9a9898", letterSpacing: 1, textTransform: "uppercase" }}>
            Sua conta
          </div>
          <h1 style={{ margin: "8px 0 12px", fontSize: 36, color: "#262626" }}>Meus pedidos</h1>
          <div style={{ fontSize: 14, color: "#737373" }}>
            Acompanhe suas compras recentes e siga cada entrega.
          </div>
        </div>

        {loading && (
          <div style={{ padding: 64, textAlign: "center", color: "#737373", fontSize: 14 }}>
            Carregando pedidos...
          </div>
        )}

        {!loading && error && (
          <div style={{ background: "#fff", border: "1px solid #e6e4e4", padding: 64, textAlign: "center", color: "#d0021b", fontSize: 14 }}>
            {error}
          </div>
        )}

        {!loading && !error && pedidos.length === 0 && (
          <div style={{ background: "#fff", border: "1px solid #e6e4e4", padding: 64, textAlign: "center", color: "#737373", fontSize: 14 }}>
            Você ainda não realizou nenhum pedido.
          </div>
        )}

        {!loading && !error && pedidos.map((p) => <OrderCard key={p.id} pedido={p} />)}
      </main>
      <Footer />
    </div>
  );
}
